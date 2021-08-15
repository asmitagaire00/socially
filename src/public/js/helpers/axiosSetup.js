/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import { userService } from '../services/userService';

export default function axiosSetup() {
  axios.interceptors.request.use(
    (conf) => {
      const token = localStorage.getItem('jwtToken');

      if (token) {
        // eslint-disable-next-line no-param-reassign
        conf.headers.Authorization = `Bearer ${token}`;
      }
      return conf;
    },
    (error) => Promise.reject(error),
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.data.error.code === 'INVALID_REFRESH_TOKEN' &&
        error.response.status === 401 &&
        error.config &&
        !error.config._retry
      ) {
        originalRequest._retry = true;

        console.log('err res', error.response);

        return userService
          .refreshToken()
          .then((res) => {
            const { jwtToken } = res.data.data;
            localStorage.setItem('jwtToken', jwtToken);

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
