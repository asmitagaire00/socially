import React from 'react';
import PropTypes from 'prop-types';

import AddComment from './AddComment';

function Comment({ comments, postId }) {
  return (
    <div>
      <AddComment postId={postId} />

      {comments.map((commentObj) => (
        <p key={commentObj.id}>{commentObj.comment}</p>
      ))}
    </div>
  );
}

Comment.propTypes = {
  comments: PropTypes.arrayOf(Object).isRequired,
  postId: PropTypes.string.isRequired,
};

export default Comment;
