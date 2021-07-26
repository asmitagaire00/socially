/* eslint-disable no-use-before-define */
import config from '../config/config';

// eslint-disable-next-line import/prefer-default-export
export const userService = { register, login, autoLogin, logout };

async function register(user) {
  const reqOptions = {
    method: 'POST',
    credentials: 'include', // request browser to set the cookie
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  };

  return fetch(`${config.apiUrl}/api/v1/account/register`, reqOptions);
}

async function login(email, password) {
  const reqOptions = {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  };

  return fetch(`${config.apiUrl}/api/v1/account/login`, reqOptions);
}

async function autoLogin(token) {
  const reqOptions = {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  return fetch(`${config.apiUrl}/api/v1/account/auto-login`, reqOptions);
}

async function logout(token) {
  // 'refreshToken' cookie is sent
  const reqOptions = {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  return fetch(`${config.apiUrl}/api/v1/account/revoke-token`, reqOptions);
}
