import React from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import AvatarImg from '../../../assets/img/dennis.jpeg';
import MountainImg from '../../../assets/img/mountain.jpg';
import ProfileTab from './ProfileTab';

function Profile() {
  return (
    <div className="profile">
      <div className="profile__banner">
        <img src={MountainImg} alt="cover" className="profile__cover" />
        <img
          src={AvatarImg}
          aria-label="profile-avatar"
          className="profile__avatar"
        />
        <div className="profile__btn-group">
          <ButtonGroup>
            <Button>Edit profile</Button>
            <Button>Follow</Button>
          </ButtonGroup>
        </div>
      </div>
      <ProfileTab />
    </div>
  );
}

export default Profile;
