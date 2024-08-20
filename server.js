const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");
const { request } = require('express');
const multer = require('multer')
const path = require('path')
const cors = require('cors');
dotenv.config();

//connection db
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodeCrud'
});

connection.connect((error) => {
  if (error) throw error;
  console.log('connection successful');
});

const jsonparser = bodyparser.json();
app.use(cors());


//get api for register
app.get("/register", (req, res) => {
  connection.query('SELECT * FROM crud', (err, result) => {
    if (err) throw err;
    res.send(result)
  });
});



//post api for register

app.post("/register", jsonparser, (req, res) => {
  const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
  };

  bcrypt.hash(user.password, 10, (err, hash) => {
      connection.query(
          `INSERT INTO crud (name, email, password) VALUES ('${user.name}','${user.email}','${hash}')`
      );
      if (err) {
          console.log("Hash Error", err);
      }
      console.log("User added!");
      res.status(201).send("User added!");
  });
});


//Generating Access Token

function createAccessToken(user) {
  // console.log(process.env.TOKEN_SECRET);
  return jwt.sign({ email: user.email, id: user.id },
      process.env.TOKEN_SECRET, {
          expiresIn: "2h",
      }
  );
}

//POST Request for LogIn

app.post("/login", jsonparser, (req, res) => {
  const userInput = {
      email: req.body.email,
      password: req.body.password,
  };
  // console.log("user login mail", userInput.email, userInput.password);

  connection.query(
      `SELECT * FROM crud where email = '${userInput.email}' limit 1`,
      (err, resp) => {
          if (err) {
              res.status(401).send(err);
          }

          if (resp.length) {
              const user = resp[0];
              // console.log(resp[0]);

              bcrypt.compare(userInput.password, user.password, (err, result) => {
                  if (result) {
                      // res.status(200).send(result);
                      const token = createAccessToken(user);
                      res.json({ token: token });
                  } else {
                      res.status(200).send(result);
                  }
              });
          } else {
              res.status(401).send("Unauthorised User!");
          }
      }
  );
});

//Middleware
const auth_token = (req, res, next) => {
  const header = req.headers["authorization"];
 
  const token = header && header.split(" ")[1];
  if (!token) {
      res.status(401).send({ error: "Please authenticate using a valid token!" });
  }
  try {
      const decodedtoken = jwt.decode(token);
      req.Useremail = decodedtoken.email;
      req.Userid = decodedtoken.id;
      next();
  } catch (error) {
      res.status(401).send({ error: "Please authenticate using a valid token!" });
  }
};

// GET Request

app.get("/me", auth_token, (req, res) => {
  connection.query(
      `SELECT id, name, email FROM crud WHERE email= '${req.Useremail}'`,
      (err, resp) => {
          if (err) {
              res.send(err);
          } else {
              res.send(resp[0]);
          }
      }
  );
});



// Specific User's Posts by their Id

app.get("/me/:id", auth_token, (req, res) => {
    let id = req.params.id;
    connection.query(
        `SELECT  crud.id, crud.name, posts.id, posts.title, posts.description, posts.slug, posts.created_at, posts.image FROM crud INNER JOIN posts ON crud.id = posts.author_id WHERE posts.author_id = '${id}' AND crud.email = '${req.Useremail}' ORDER BY created_at DESC`,
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

// All users

app.get("/user", (req, res) => {
    connection.query(`SELECT * FROM crud`, (err, resp) => {
        if (err) {
            resp.send("Error", err);
        } else {
            res.send(resp);
        }
    });
});

//middleware for uploads files
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
    }
})

const uploads = multer({ storage: storage })


//Serve images

app.use(express.static(path.join(__dirname, 'uploads')))


// Adding Posts

app.post("/posts", jsonparser, uploads.single('image'), auth_token, (req, res) => {
    
    console.log(req.file.originalname)
    
    const postdata = {
        title: req.body.title,
        description: req.body.description,
        image: req.file.originalname,
        author_id: req.Userid,
        // created_at: req.body.created_at,
    };
    // Create Slug
// return res.send(postdata)
    var SlugCount = 0;
    const slug = postdata.title
        .toLowerCase()
        .split(/[ ]+/)
        .join(" ")
        .replaceAll(" ", "-");
        
    connection.query(
        `SELECT COUNT(slug) AS slugcount FROM posts WHERE (slug) LIKE '%${slug}%'`,
        (err, rows) => {
            if (err) {
                throw err;
            }
            SlugCount = rows[0].slugcount;
            console.log("Rows", SlugCount);
            // return SlugCount;
            console.log(SlugCount, "slugcount");
            if (SlugCount > 0) {
                // console.log("hggh");
                connection.query(
                    `INSERT INTO posts(title, description, slug, author_id, image) VALUES ('${
            postdata.title
          }', '${postdata.description}', '${slug + "-" + SlugCount}', '${
            postdata.author_id
          }', '${postdata.image}')`,
                    (err) => {
                        if (err) {
                            return res.status(400).send(err);
                        }
                        // console.log("else status", result);
                        return res.status(201).send("Post Added");
                    }
                );
            } else {
                // console.log("bye");
                connection.query(
                    `INSERT INTO posts(title, description, slug, author_id, image) VALUES ('${postdata.title}', '${postdata.description}', '${slug}', '${postdata.author_id}', '${postdata.image}')`,
                    (err) => {
                        if (err) {
                            return res.status(400).send(err);
                        }
                        // console.log("else status", result);
                        return res.status(201).send("Post Added");
                    }
                );
            }
        }
    );
    // res.status(200).send("Post Added!");
    // console.log("main res", res);
});

//All Posts

app.get("/posts", (req, res) => {
    connection.query(
        `SELECT * FROM posts ORDER BY created_at DESC`,
        (err, resp) => {
            if (err) {
                res.send(resp);
            } else {
                res.send(resp);
            }
        }
    );
});



// Single Post find through the slug

// app.get("/posts/:slug",jsonparser, auth_token,(req, res) => {
//     let slug = req.params.slug;
    
//     connection.query(
//         `SELECT posts.id, crud.name, posts.title, posts.description, posts.created_at, posts.updated_at, posts.author_id, posts.image FROM crud INNER JOIN posts ON crud.id = posts.author_id WHERE posts.slug = '${slug}'`,
//         (err, resp) => {
//             if (err) {
//                 res.send(err);
//             } else {
               
//                 res.send(resp);
//             }
//         }
//     );
// });

// Single Post find through the id

app.get("/posts/:id", (req, res) => {
    let id = req.params.id;
   
    connection.query(
        `SELECT posts.id, crud.name, posts.title, posts.description, posts.created_at, posts.updated_at, posts.author_id, posts.image FROM crud INNER JOIN posts ON crud.id = posts.author_id WHERE posts.id = '${id}'`,
        (err, resp) => {
            if (err) {
                res.send(err);
            } else {
               
                res.send(resp);
            }
        }
    );
});





// Delete Post using Post_id

app.delete("/posts/:id", auth_token, (req, res) => {
    let id = req.params.id;
    // console.log(id)

    connection.query(
        `DELETE posts FROM crud INNER JOIN posts WHERE posts.id = '${id}' AND posts.author_id = '${req.Userid}'`,
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Update Post using Post_id

app.put("/posts/:id", jsonparser, auth_token,uploads.single('image'), auth_token, (req, res) => {
    const updatedData = {
        title: req.body.title,
        description: req.body.description,
        image: req.file.originalname,
        updatedAt: new Date(),
    };
    let id = req.params.id;
    let idCount = 0;
    connection.query(
        `SELECT COUNT(id)
 AS Id_Count FROM posts WHERE posts.id = '${id}' AND posts.author_id = '${req.Userid}'`,
        (err, rows) => {
            if (err) {
                throw err;
            }
            idCount = rows[0].Id_Count;
            if (idCount) {
                connection.query(
                    `UPDATE posts SET title = '${updatedData.title}', description = '${updatedData.description}', updated_at = '${updatedData.updatedAt}', image = '${updatedData.image}' WHERE posts.id= '${id}' AND posts.author_id = '${req.Userid}'`,
                    (err, result) => {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send(result);
                            // console.log(result);
                        }
                    }
                );
            } else {
                res.status(401).send("Wrong credentials!");
            }
        }
    );
});
  

//setup
app.get('/', (req, res) => {
  res.send('Welcome to New Application');
});

app.listen(3000);