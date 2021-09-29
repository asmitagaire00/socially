/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import { authService } from '../services/AuthService';
import TokenService from '../services/TokenService';

export default function axiosSetup() {
  axios.interceptors.request.use(
    (conf) => {
      const token = TokenService.getToken();

      if (token) {
        conf.headers.Authorization = `Bearer ${token}`;
        conf.withCredentials = true;
      }
      return conf;
    },
    (error) => Promise.reject(error),
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const originalRequest = error.config;

      // try to refresh token if it is invalid
      if (
        error.response &&
        error.response.data.error.code === 'UNAUTHORIZED' &&
        error.config &&
        !error.config._retry
      ) {
        originalRequest._retry = true;

        return authService
          .refreshToken()
          .then((res) => {
            const { jwtToken } = res.data.data;
            TokenService.setToken(jwtToken);

            return axios(originalRequest);
          })
          .catch((err) => {
            Promise.reject(err);
          });
      }

      return Promise.reject(error);
    },
  );
}
