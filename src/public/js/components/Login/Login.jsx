import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import routes from '../../config/routes';
import { login } from '../../redux/AuthSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, error, errorMessage, user } = useSelector(
    (state) => state.auth,
  );
  const isAuthenticated = !!user;
  const dispatch = useDispatch();

  function onSubmit(e) {
    e.preventDefault();
    dispatch(login({ email, password }));
  }

  return (
    <>
      {isAuthenticated && <Redirect to={`${routes.root}`} />}
      <div>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>

      {error && <p>{`Error: ${errorMessage}`}</p>}
      {loading && <p>Logging in...</p>}
    </>
  );
}
