import axios from 'axios';
import config from '../config/config';

function createConversation(userIds) {
  return axios({
    method: 'POST',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/conversations/`,
    data: userIds,
  });
}

function getConversations({ userId }) {
  return axios({
    method: 'GET',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/users/${userId}/conversations`,
  });
}

function createMessage({ convId, senderId, text }) {
  return axios({
    method: 'POST',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/messages/`,
    data: { conversation: convId, sender: senderId, text },
  });
}

function getMessages({ convId }) {
  return axios({
    method: 'GET',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/conversations/${convId}/messages`,
  });
}

function getUsers({ convId }) {
  return axios({
    method: 'GET',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/conversations/${convId}/users`,
  });
}

const messageService = {
  getUsers,
  getMessages,
  createMessage,
  createConversation,
  getConversations,
};

export default messageService;
