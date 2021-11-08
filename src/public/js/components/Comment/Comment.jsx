import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import AddComment from './AddComment';
import routes from '../../config/routes';

function Comment({ comments, postId }) {
  return (
    <div className="comment">
      <AddComment postId={postId} />

      {comments.map((commentObj) => {
        dayjs.extend(relativeTime);
        const parsedCreatedAt = dayjs(commentObj.createdAt).fromNow();

        return (
          <div className="comment__comment" key={commentObj.id}>
            <p key={commentObj.id}>{commentObj.comment}</p>
            <p>
              <Link
                to={{
                  pathname: routes.profile(commentObj.user?.account.userName),
                  state: {
                    userId: commentObj.user?.id,
                    userName: commentObj.user?.account.userName,
                  },
                }}
                className="link"
              >
                {`${commentObj.user?.account.firstName} ${commentObj.user?.account.lastName}`}
              </Link>{' '}
              . {parsedCreatedAt}
            </p>
          </div>
        );
      })}
    </div>
  );
}

Comment.propTypes = {
  comments: PropTypes.arrayOf(Object).isRequired,
  postId: PropTypes.string.isRequired,
};

export default Comment;
