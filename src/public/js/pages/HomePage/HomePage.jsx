import React from 'react';

import PostFeed from './PostFeed';
import AddPost from '../../components/AddPost';
import AppLayout from '../../components/AppLayout';

function HomePage() {
  return (
    <div>
      <AppLayout>
        <AddPost />
        <PostFeed />
      </AppLayout>
    </div>
  );
}

export default HomePage;
