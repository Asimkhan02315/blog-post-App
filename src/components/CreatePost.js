import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseURL = "http://localhost:3000/";

const CreatePost = () => {

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const token = localStorage.getItem('token')

  const onSubmit = (data) => {

    console.log(data)
    var formdata = new FormData();
    formdata.append('image', data.image[0]);
    formdata.append('title', data.title);
    formdata.append('description', data.description);

    fetch(`${baseURL}posts`, {
      method: "POST",
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

  return (
    <div>
      <h1>Add Posts</h1>

      <form onSubmit={handleSubmit(onSubmit)}>

        <label>Title:</label>
        <div className='form-group'>
          <input
            {...register("title", { required: true })}
            aria-invalid={errors.title ? "true" : "false"}
          />
          {errors.title?.type === 'required' && <p role="alert">Title is required</p>}
        </div>
        <br /><br />

        <label>Description:</label>
        <div className='form-group'>
          <textarea
            {...register("description", { required: "Description is required" })}
            aria-invalid={errors.description ? "true" : "false"}
          />
          {errors.description && <p role="alert">{errors.description?.message}</p>}
        </div>
        <br /><br />

        <label>Image:</label>
        <div className='form-group'>
          <input type='file'
            {...register("image")}
            aria-invalid={errors.image ? "true" : "false"}
          />
          {errors.image && <p role="alert">{errors.image?.message}</p>}
        </div>
        <br /><br />

        <input
          className='btn btn-info'
          type="submit" value='Post' />
      </form>
    </div>
  )
}
export default CreatePost