import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

import AvatarImg from '../../../assets/img/dennis.jpeg';
import MountainImg from '../../../assets/img/mountain.jpg';
import userService from '../../services/UserService';
import {
  getFollowersById,
  unfollowUser,
  followUser,
} from '../../redux/UserSlice';

function useGetAccountByUserName() {
  const [accountDetails, setAccountDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userName } = useParams();

  useEffect(() => {
    if (userName) {
      setLoading(true);
      userService
        .getAccountByUserName({ userName })
        .then((res) => {
          const { data } = res.data;
          setAccountDetails(data);
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          setError(e);
        });
    }
  }, [userName]);

  return {
    error,
    loading,
    userName,
    firstName: accountDetails?.firstName,
    lastName: accountDetails?.lastName,
    id: accountDetails?.user?.id,
    createdAt: accountDetails?.createdAt,
  };
}

function ProfileBanner() {
  const {
    firstName,
    lastName,
    userName,
    id: userId,
    createdAt,
  } = useGetAccountByUserName();

  const dispatch = useDispatch();
  const { user: curUserId } = useSelector((state) => state.auth.account);
  const { followerDetails, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (userId) dispatch(getFollowersById({ userId }));
  }, [userId, dispatch]);

  function handleFollowClick() {
    const { isCurUserFollowingUser } = followerDetails;

    if (isCurUserFollowingUser) dispatch(unfollowUser({ id: userId }));
    else dispatch(followUser({ id: userId }));
  }

  return (
    <>
      <div className="profile-banner">
        <img src={MountainImg} alt="cover" className="profile-banner__cover" />
        <img
          src={AvatarImg}
          aria-label="profile-avatar"
          className="profile-banner__avatar"
        />
        <div className="profile-banner__btn-group">
          <ButtonGroup>
            {curUserId === userId && <Button>Edit profile</Button>}
            {!(curUserId === userId) && (
              <Button onClick={handleFollowClick} disabled={loading}>
                {followerDetails && followerDetails.isCurUserFollowingUser
                  ? 'Unfollow'
                  : 'Follow'}
              </Button>
            )}
          </ButtonGroup>
        </div>
      </div>

      <div>
        <div>
          {firstName} {lastName}
        </div>
        <div>@{userName}</div>
        <div>
          <CalendarTodayIcon />
          <span>Joined {createdAt}</span>
        </div>
      </div>
    </>
  );
}

export default ProfileBanner;
