import React from 'react';

import AddPost from '../../components/AddPost';
import AppLayout from '../../components/AppLayout';
import Feed from '../../components/Feed';
import useFetchPosts from './useFetchPosts';

function HomePage() {
  const { postsClear, loading, posts, totalPostsCount, loadMorePosts } =
    useFetchPosts();

  return (
    <div>
      <AppLayout>
        <AddPost />
        {postsClear && (
          <Feed
            loading={loading}
            posts={posts}
            totalPostsCount={totalPostsCount}
            loadMore={loadMorePosts}
          />
        )}
      </AppLayout>
    </div>
  );
}

export default HomePage;
