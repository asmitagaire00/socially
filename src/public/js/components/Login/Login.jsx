import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { login } from '../../redux/AuthSlice';
import validate from './validate';

function renderField({ input, label, type, meta: { touched, error } }) {
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>{label}</label>
      <div>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <input {...input} placeholder={label} type={type} />
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error, errorMessage } = useSelector((state) => state.auth);

  function onSubmit(e) {
    e.preventDefault();
    dispatch(login({ email, password }));
  }

  return (
    <>
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
          <button type="submit" disabled={loading}>
            Login
          </button>
        </div>
      </form>

      {error && <p>{`Error: ${errorMessage}`}</p>}
      {loading && <p>Logging in...</p>}
    </>
  );
}

export default reduxForm({
  form: 'loginForm',
  validate,
})(Login);
