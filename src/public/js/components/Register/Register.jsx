/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import ErrorOutlineSharp from '@material-ui/icons/ErrorOutlineSharp';

import routes from '../../config/routes';
import validate from './validate';
import { register } from '../../redux/AuthSlice';

function renderField({ input, label, type, meta: { touched, error } }) {
  return (
    <div>
      <label htmlFor={`register-${label.replace(/\s/g, '')}`}>{label}</label>
      <div>
        <input
          id={`register-${label.replace(/\s/g, '')}`}
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

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { loading, account } = useSelector((state) => state.auth);
  const isAuthenticated = !!account;
  const dispatch = useDispatch();

  function onSubmit(e) {
    e.preventDefault();

    const newUser = { firstName, lastName, email, password, confirmPassword };
    dispatch(register(newUser));
  }

  return (
    <div className="register">
      {isAuthenticated && <Redirect to={`${routes.root}`} />}

      <div>
        <form onSubmit={onSubmit}>
          <Field
            name="firstName"
            type="text"
            component={renderField}
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Field
            name="lastName"
            type="text"
            component={renderField}
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
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
          <Field
            name="confirmPassword"
            type="password"
            component={renderField}
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className="register__btn"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </div>
        </form>

        {loading && <p>Registering...</p>}
      </div>
    </div>
  );
}

export default reduxForm({
  form: 'registerForm',
  validate,
})(Register);
