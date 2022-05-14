import { React, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function login() {
    signInWithEmailAndPassword(props.auth, email, password)
      .then((userCredential) => {
        // Signed in - navigate to home page
        <Navigate to="/home" />;
      })
      .catch((error) => {
        // could not sign in
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  // if the user is already logged in, navigate to home page
  if (props.authenticated) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="Login">
      <header className="Login-header">
        <h3>Login</h3>
        <label>email</label>
        <input type="text" onChange={(e) => setEmail(e.target.value)}></input>
        <label>password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button onClick={login}>Sign in</button>
        <div>
          <Link to="/register">click here to register an account</Link>
        </div>
      </header>
    </div>
  );
}

export default Login;
