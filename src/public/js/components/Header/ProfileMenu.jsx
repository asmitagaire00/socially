import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Logout from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';

import AvatarImg from '../../../assets/img/dennis.jpeg';
import routes from '../../config/routes';

function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { userName, user: userId } = useSelector((state) => state.auth.user);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Avatar
          alt="Dennis Ritchie"
          src={AvatarImg}
          className="header__avatar"
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'profile-section',
        }}
        PaperProps={{
          style: {
            transform: 'translateX(10px) translateY(50px)',
          },
        }}
      >
        <MenuItem onClick={handleClose}>
          <Link
            to={{
              pathname: routes.profile(userName),
              state: { userId, userName },
            }}
          >
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            Profile
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export default ProfileMenu;
