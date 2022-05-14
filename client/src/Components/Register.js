import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

function Register(props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function register() {
    // check user is not signed in
    if (props.authenticated) {
      setErrorMessage('Cannot register while signed in');
      return;
    }
    // create user on firebase
    const create = await createUserWithEmailAndPassword(
      props.auth,
      email,
      password
    )
      .then((userCredential) => {
        return userCredential;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        return null;
      });

    // check if it worked - create user row in server database
    if (create) {
      axios
        .post(
          '/api/user',
          {
            user: {
              username: username,
              email: email,
              phoneNumber: phoneNumber,
            },
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        )
        .then(({ data }) => {
          console.log('data returned from register', data);
          props.updateUserState(data.user);
        });
    }
    // navigate to home page
    <Navigate to="/home" />;
  }

  // if the user is already logged in - navigate to home page
  if (props.authenticated) {
    return <Navigate to="/home" />;
  }
  return (
    <div>
      <div>
        <h3>Register</h3>
        <label>username</label>
        <input
          type="text"
          placeholder="please enter your username here"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <label>email</label>
        <input
          type="text"
          placeholder="please enter your email here"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <label>password</label>
        <input
          type="password"
          placeholder="please enter your password here"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <label>phone number</label>
        <input
          type="number"
          placeholder="please enter your phone number here"
          onChange={(e) => setPhoneNumber(e.target.value)}
        ></input>
        <button onClick={register}>Register</button>
        <div>
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
