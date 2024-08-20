import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import { Vortex } from 'react-loader-spinner'

const baseURL = "http://localhost:3000/";

const UserPost = () => {

  const Navigate = useNavigate();

  const [data, setData] = useState();

  const [showLoader, setShowLoader] = useState(true);

  const token = localStorage.getItem("token");

  function getData() {

    axios.get(`${baseURL}posts`)
      .then((res) => {
        console.log(res, 'get===============>')
        setData(res.data)
        setShowLoader(false)
      })
  }

  function handleDelete(id) {
    axios.delete(`${baseURL}posts/${id}`,
      { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        getData();
      })

    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false)
    }, 1000);

    toast.success('Delete Post Successful', {
      position: 'top-center'
    });
  }

  useEffect(() => {
    getData();
  }, [])

  console.log(data);
  return (
    <>
      {showLoader ?
        <Vortex
          visible={true}
          height="80"
          width="80"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
        />
        :
        <>
          <div className='container'>
            <h1>My Posts</h1>
            <div className='row'>

              {data && data?.map((eachData, index) => {

                console.log(eachData.image, "hhhhyhhh");
                return (
                  <>
                    <div className='col-sm-4 ' key={index}>

                      <div className="card-body" style={{ width: '18rem' }} >
                        <img src={`${baseURL}${eachData.image}`}
                          className="card-img-top" alt="..." />
                        <h1 className="card-title">{eachData.title}</h1>
                        <p className="card-subtitle">{eachData.description}</p>
                        <h2 className="card-subtitle">{eachData.name}</h2>
                        <p className="card-subtitle">{eachData.created_at}</p>
                        <p className="card-subtitle">{eachData.updated_at}</p>

                        <button
                          onClick={() =>
                            Navigate(`/EditPost/${eachData?.id}`)
                          }
                        >
                          <i className="fa-regular fa-pen-to-square text-success"></i>
                        </button>

                        <button onClick={() => handleDelete(eachData.id)}>
                          <i className="fa-solid fa-trash text-danger"></i></button>
                      </div>
                    </div>

                  </>
                )
              })
              }
            </div>
          </div>
        </>
      }
    </>
  )
}
export default UserPost