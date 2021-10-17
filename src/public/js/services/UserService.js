import axios from 'axios';
import config from '../config/config';

function getUser({ id }) {
  return axios({
    method: 'GET',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/users/${id}`,
  });
}

function followUser({ id }) {
  return axios({
    method: 'POST',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/follows/${id}/follow`,
  });
}

function unfollowUser({ id }) {
  return axios({
    method: 'DELETE',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/follows/${id}/unfollow`,
  });
}

function getFollowersById({ userId }) {
  return axios({
    method: 'GET',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/users/${userId}/followers`,
  });
}

function getFollowingsById({ userId }) {
  return axios({
    method: 'GET',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/users/${userId}/followings`,
  });
}

function getAccountByUserName({ userName }) {
  return axios({
    method: 'GET',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/users/${userName}/account`,
  });
}

const userService = {
  getUser,
  followUser,
  unfollowUser,
  getFollowersById,
  getFollowingsById,
  getAccountByUserName,
};

export default userService;
