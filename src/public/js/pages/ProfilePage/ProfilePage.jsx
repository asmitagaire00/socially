import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Feed from '../../components/Feed';
import { getPosts } from '../../redux/PostSlice';
import AppLayout from '../../components/AppLayout';

function ProfilePage() {
  const LIMIT = 7; // num of posts per request
  const skip = useRef(0);
  const dispatch = useDispatch();
  const { loading, posts, totalPostsCount } = useSelector(
    (state) => state.post,
  );

  const loadMorePosts = () => {
    dispatch(getPosts({ skip: skip.current, limit: LIMIT }));
    skip.current += LIMIT;
  };

  return (
    <AppLayout>
      <Feed
        loading={loading}
        posts={posts}
        totalPostsCount={totalPostsCount}
        loadMore={loadMorePosts}
      />
    </AppLayout>
  );
}

export default ProfilePage;
