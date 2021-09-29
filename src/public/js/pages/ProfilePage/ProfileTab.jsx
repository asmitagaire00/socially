import React from 'react';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import AppBar from '@material-ui/core/AppBar';

import Feed from '../../components/Feed';
import useFetchPosts from './useFetchPosts';
import ProfileTabPanel from './ProfileTabPanel';

function ProfileTab() {
  const [value, setValue] = React.useState(0);
  const { postsClear, loading, posts, totalPostsCount, loadMorePosts } =
    useFetchPosts();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Posts" />
          <Tab label="Likes" />
          <Tab label="Media" />
        </Tabs>
      </AppBar>
      <ProfileTabPanel value={value} index={0}>
        {postsClear && (
          <Feed
            loading={loading}
            posts={posts}
            totalPostsCount={totalPostsCount}
            loadMore={loadMorePosts}
          />
        )}
      </ProfileTabPanel>
      <ProfileTabPanel value={value} index={1}>
        Likes
      </ProfileTabPanel>
      <ProfileTabPanel value={value} index={2}>
        Media
      </ProfileTabPanel>
    </div>
  );
}

export default ProfileTab;
