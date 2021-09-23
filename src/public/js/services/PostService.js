import axios from 'axios';
import config from '../config/config';

function getPosts({ skip, limit }) {
  return axios({
    method: 'GET',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/posts/`,
    params: {
      skip,
      limit,
    },
  });
}

function getFollowedPosts({ skip, limit }) {
  return axios({
    method: 'GET',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/posts/followed/all`,
    params: {
      skip,
      limit,
    },
  });
}

function addPost(post) {
  // a post might consist image with caption so multipart form data is sent
  const postData = new FormData();
  postData.append('image', post.image);
  postData.append('caption', post.caption);

  return axios({
    method: 'POST',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/posts/`,
    data: postData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

function addComment({ comment, postId }) {
  return axios({
    method: 'POST',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/comments/`,
    data: { comment, postId },
  });
}

function likePost({ postId }) {
  return axios({
    method: 'POST',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/likes/`,
    data: { postId },
  });
}

function unlikePost({ likeId }) {
  return axios({
    method: 'DELETE',
    withCredentials: true,
    url: `${config.apiUrl}/api/v1/likes/${likeId}`,
  });
}

const postService = {
  getPosts,
  getFollowedPosts,
  addPost,
  addComment,
  likePost,
  unlikePost,
};
export default postService;
