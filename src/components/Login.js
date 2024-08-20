import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const baseURL = "http://localhost:3000/";

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const Login = () => {
        axios.post(`${baseURL}login`, {
            email: email,
            password: password,
        })
            .then((response) => {
                const { token } = response.data;
                localStorage.setItem('token', token)
                navigate('/')
            })
    }

    return (
        <div>
            <h1>Login Page</h1>
            <input type='email' placeholder='Email' onChange={(e) => {
                setEmail(e.target.value)
            }} /><br /><br />
            <input type='password' placeholder='Password' onChange={(e) => {
                setPassword(e.target.value)
            }} /><br /><br />
            <input className='btn btn-info'
                type='submit' value='Login' onClick={Login} />
        </div>
    )
}
export default Login