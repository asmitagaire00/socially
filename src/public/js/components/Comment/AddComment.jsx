import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import TextAreaResize from '@material-ui/core/TextareaAutosize';

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
    <div className="add-comment">
      <div>
        <TextAreaResize
          name="add-comment"
          onChange={handleCommentChange}
          value={comment}
          rows={2}
          className="add-comment__textarea"
        />
      </div>
      <div>
        <Button onClick={handleCommentSubmit} disabled={loading}>
          {loading ? 'Commenting...' : 'Comment'}
        </Button>
      </div>
    </div>
  );
}

AddComment.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default AddComment;
