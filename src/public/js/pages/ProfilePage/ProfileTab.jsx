import React from 'react';
import { useDispatch } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ProfileTabPanel from './ProfileTabPanel';
import ProfilePostFeed from './ProfilePostFeed';
import { clearPosts } from '../../redux/PostSlice';

function ProfileTab() {
  const [value, setValue] = React.useState(0);

  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    dispatch(clearPosts());
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
        <ProfilePostFeed />
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
