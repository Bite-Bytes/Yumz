import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/App.css';

async function loginUser(credentials) {
  return fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(res => {
      if (res.status === 200) {
        return res;
      }
      else if (res.status === 300) {
        return false;
      }
    });

}

// This entire portion is used for react-router setup
export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const signin = await loginUser({
      email,
      password
    });
    if (!signin) {
      resetForm();
    }
    navigate('/');



  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Email</p>
          <input type="text" onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <label>
            <button className="signupButton" type="button" onClick={e => navigate('/signup')}>No account yet?</button>
          </label>
        </div>
        <div>
          <button className="submit" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};
