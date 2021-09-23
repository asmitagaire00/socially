import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Feed from '../../components/Feed';
import { getFollowedPosts } from '../../redux/PostSlice';

function PostFeed() {
  const LIMIT = 7; // num of posts per request
  const skip = useRef(0);
  const dispatch = useDispatch();

  const { loading, followedPosts, totalFollowedPostsCount } = useSelector(
    (state) => state.post,
  );

  const loadMorePosts = () => {
    dispatch(getFollowedPosts({ skip: skip.current, limit: LIMIT }));
    skip.current += LIMIT;
  };

  return (
    <Feed
      loading={loading}
      posts={followedPosts}
      totalPostsCount={totalFollowedPostsCount}
      loadMore={loadMorePosts}
    />
  );
}

export default PostFeed;
