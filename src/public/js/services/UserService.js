import axios from 'axios';
import config from '../config/config';

function followUser({ id, curUserId }) {
  return axios({
    method: 'POST',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/follows/${id}/follow`,
    data: {
      curUserId,
    },
  });
}

function unfollowUser({ id, curUserId }) {
  return axios({
    method: 'PUT',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/follows/${id}/unfollow`,
    data: {
      curUserId,
    },
  });
}

const userService = {
  followUser,
  unfollowUser,
};

export default userService;
