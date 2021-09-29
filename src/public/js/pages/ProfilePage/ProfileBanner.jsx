import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import AvatarImg from '../../../assets/img/dennis.jpeg';
import MountainImg from '../../../assets/img/mountain.jpg';
import userService from '../../services/UserService';

function ProfileBanner() {
  const location = useLocation();
  const { userId } = location.state;
  const { user } = useSelector((state) => state.auth.account);
  const { id: curUserId } = user;
  const isThisCurUser = userId === curUserId;

  function handleFollowClick() {
    userService.followUser({ id: userId, curUserId });
  }

  return (
    <div className="profile-banner">
      <img src={MountainImg} alt="cover" className="profile-banner__cover" />
      <img
        src={AvatarImg}
        aria-label="profile-avatar"
        className="profile-banner__avatar"
      />
      <div className="profile-banner__btn-group">
        <ButtonGroup>
          <Button>Edit profile</Button>
          {!isThisCurUser && (
            <Button onClick={handleFollowClick}>Follow</Button>
          )}
        </ButtonGroup>
      </div>
    </div>
  );
}

export default ProfileBanner;
