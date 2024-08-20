import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const baseURL = "http://localhost:3000/";

const Register = () => {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const Register = () => {
    axios.post(`${baseURL}register`, {
      name: name,
      email: email,
      password: password,
    }).then((res) => {
      console.log(res)
    })
    navigate("/Login");

    axios.get(`${baseURL}register`)
      .then((res) => {
        console.log(res)
      })
  }

  return (
    <div>
      <h1>Register Page</h1>
      <input type='text' placeholder=' Name' onChange={(e) => {
        setName(e.target.value)
      }} /><br /><br />
      <input type='email' placeholder='Email' onChange={(e) => {
        setEmail(e.target.value)
      }} /><br /><br />
      <input type='password' placeholder='Password' onChange={(e) => {
        setPassword(e.target.value)
      }} /><br /><br />
      <input className='btn btn-info'
        type='submit' value='Register' onClick={Register} />
    </div>
  )
}
export default Register