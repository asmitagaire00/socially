import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';

import { createComment } from '../../redux/PostSlice';

function AddComment({ postId }) {
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.post);

  function handleCommentChange(e) {
    setComment(e.target.value);
  }

  function handleCommentSubmit(e) {
    e.preventDefault();
    dispatch(createComment({ comment, postId }));
  }

  return (
    <>
      <div>
        <textarea
          name="add-comment"
          rows="2"
          placeholder="Comment..."
          onChange={handleCommentChange}
          value={comment}
        />
      </div>
      <div>
        <Button onClick={handleCommentSubmit} disabled={loading}>
          {loading ? 'Commenting...' : 'Comment'}
        </Button>
      </div>
    </>
  );
}

AddComment.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default AddComment;
