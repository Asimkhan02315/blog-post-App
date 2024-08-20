
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseURL = "http://localhost:3000/";

const EditPost = () => {

  const navigate = useNavigate();

  const [post, setPost] = useState([]);

  const { id } = useParams();

  const token = localStorage.getItem("token");

  const { register, handleSubmit, formState: { errors } } = useForm();

  const userpost = () => {
    axios.get(`${baseURL}posts/${id}`)
      .then((res) => {
        console.log(res, "hyyyy")
        setPost(res.data)

      })
  };

  const onSubmit = (data) => {
    console.log(data)

    let id = post[0].id;


    var formdata = new FormData();
    formdata.append('image', data.image[0]);
    formdata.append('title', data.title);
    formdata.append('description', data.description);


    fetch(`${baseURL}posts/${id}`, {
      method: "PUT",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        toast.success('Post Successful', {
          position: 'top-center'
        });
        navigate('/UserPost');
      })
  }

  useEffect(() => {
    userpost();
  }, []);


  return (
    <div>
      <h1>Update Post</h1>

      <form onSubmit={handleSubmit(onSubmit)}>

        {post && post.map((a, index) => {

          return (
            <div key={index}>
              <label>Title:</label>
              <div className='form-group'>
                <input defaultValue={a.title}
                  {...register("title", { required: true })}
                  aria-invalid={errors.title ? "true" : "false"}
                />
                {errors.title?.type === 'required' && <p role="alert">Title is required</p>}
              </div>
              <br /><br />

              <label>Description:</label>
              <div className='form-group'>
                <textarea defaultValue={a.description}

                  {...register("description", { required: "Description is required" })}
                  aria-invalid={errors.description ? "true" : "false"}
                />
                {errors.description && <p role="alert">{errors.description?.message}</p>}
              </div>
              <br /><br />



              <label>Image:</label>
              <div className='form-group'>
                <input type='file'

                  {...register("image", { required: "File is required" })}
                  aria-invalid={errors.file ? "true" : "false"}
                />
                {errors.file && <p role="alert">{errors.file?.message}</p>}
              </div>
              <br /><br />

              <input className='btn btn-info'
                type="submit" value='Update Post' />
            </div>

          )

        })}

      </form>
    </div>
  )
}

export default EditPost