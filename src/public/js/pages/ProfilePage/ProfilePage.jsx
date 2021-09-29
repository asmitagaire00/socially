import React from 'react';

import AppLayout from '../../components/AppLayout';
import ProfileBanner from './ProfileBanner';
import ProfileTab from './ProfileTab';

function ProfilePage() {
  return (
    <AppLayout>
      <ProfileBanner />
      <ProfileTab />
    </AppLayout>
  );
}

export default ProfilePage;
