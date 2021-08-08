/* eslint-disable no-use-before-define */
import axios from 'axios';
import config from '../config/config';

// eslint-disable-next-line import/prefer-default-export
export const userService = {
  register,
  login,
  autoLogin,
  logout,
  verifyEmail,
  refreshToken,
};

async function register(user) {
  return axios({
    method: 'POST',
    withCredentials: true, // request browser to set the cookie
    url: `${config.apiUrl}/api/v1/account/register`,
    data: user,
  });
}

async function login(email, password) {
  return axios({
    method: 'POST',
    withCredentials: true, // request browser to set the cookie
    url: `${config.apiUrl}/api/v1/account/login`,
    data: { email, password },
  });
}

async function autoLogin(token) {
  return axios({
    method: 'POST',
    withCredentials: true, // request browser to set the cookie
    url: `${config.apiUrl}/api/v1/account/auto-login`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function logout(token) {
  // 'refreshToken' cookie is sent
  return axios({
    method: 'POST',
    withCredentials: true, // request browser to set the cookie
    url: `${config.apiUrl}/api/v1/account/revoke-token`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function verifyEmail(emailVerificationToken) {
  return axios({
    method: 'POST',
    withCredentials: true, // request browser to set the cookie
    url: `${config.apiUrl}/api/v1/account/verify-email`,
    data: { emailVerificationToken },
  });
}

async function refreshToken() {
  return axios({
    method: 'POST',
    withCredentials: true, // request browser to set the cookie
    url: `${config.apiUrl}/api/v1/account/refresh-token`,
  });
}
