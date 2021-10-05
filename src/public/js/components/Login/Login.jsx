/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import ErrorOutlineSharp from '@material-ui/icons/ErrorOutlineSharp';

import validate from './validate';
import { login } from '../../redux/AuthSlice';

function renderField({ input, label, type, meta: { touched, error } }) {
  return (
    <div>
      <label htmlFor={`login-${label}`}>{label}</label>
      <div>
        <input
          id={`login-${label}`}
          {...input}
          type={type}
          className={touched && error ? 'input input--error' : 'input'}
        />
        {touched && error && (
          <div className="error-line">
            <ErrorOutlineSharp />
            &nbsp;{error}
          </div>
        )}
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  function onSubmit(e) {
    e.preventDefault();
    dispatch(login({ email, password }));
  }

  return (
    <div className="login">
      <form onSubmit={onSubmit}>
        <Field
          name="email"
          type="email"
          component={renderField}
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          name="password"
          type="password"
          component={renderField}
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className="login__btn"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>

      {loading && <p>Logging in...</p>}
    </div>
  );
}

export default reduxForm({
  form: 'loginForm',
  validate,
})(Login);
