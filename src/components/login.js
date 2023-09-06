import React from 'react';
import { useState } from 'react';
import Navbar from './navbar';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function HandleLogin() {
        const user = {
            email: email,
            password: password
        };
        fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(user)
        }).then(response => {
            console.log(response);
            return response.text();
        }).then(data => {
            if (data === 'user not found') {
                setError(data);
            } else {
                data = JSON.parse(data);
                localStorage.setItem('token', data.access_token);
                window.location.href = '/';
            }
        }).catch(err => {
            console.log(err);
        });
            
    }
    return (
        <div>
            <Navbar />
            <input type="email" placeholder="Email" onChange={event => setEmail(event.target.value)} />
            <input type="password" placeholder="Password" onChange={event => setPassword(event.target.value)} />
            <button onClick={HandleLogin}>Login</button>
            <p>{error}</p>

        </div>
    );
};

export default Login;