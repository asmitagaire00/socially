import React from 'react';
import PropTypes from 'prop-types';

import Post from '../Post';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

function Feed({ loading, posts, totalPostsCount, loadMore }) {
  const infiniteScrollRef = useInfiniteScroll(loading, loadMore);
  return (
    <div className="feed">
      {posts &&
        posts.map((post) => {
          const {
            likes,
            comments,
            tags,
            caption,
            image,
            user,
            id: postId,
            createdAt,
            updatedAt,
          } = post;

          return (
            <Post
              key={postId}
              likes={likes}
              comments={comments}
              tags={tags}
              caption={caption}
              image={image}
              user={user}
              postId={postId}
              createdAt={createdAt}
              updatedAt={updatedAt}
            />
          );
        })}
      {posts.length === totalPostsCount ? (
        <></>
      ) : (
        <div ref={infiniteScrollRef}>Loading...</div>
      )}
      {!loading && totalPostsCount < 1 && <p>No posts!</p>}
    </div>
  );
}

Feed.propTypes = {
  loading: PropTypes.bool.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalPostsCount: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
};

export default Feed;
