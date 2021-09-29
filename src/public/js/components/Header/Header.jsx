import React from 'react';
import { Link } from 'react-router-dom';

import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';

import SearchBar from './SearchBar';
import ProfileMenu from './ProfileMenu';
import routes from '../../config/routes';

export default function Header() {
  return (
    <header>
      <div className="header">
        <div className="header__logo">
          <Link className="link" to={routes.home}>
            Socially
          </Link>
        </div>
        <SearchBar />
        <div className="header__links">
          <IconButton
            className="header__icon-btn"
            aria-label="Show messages"
            color="inherit"
          >
            <Badge badgeContent={3} max={10} color="primary">
              <MailIcon className="header__icon" />
            </Badge>
          </IconButton>
          <IconButton
            className="header__icon-btn"
            aria-label="Show notifications"
            color="inherit"
          >
            <Badge badgeContent={17} max={10} color="primary">
              <NotificationsIcon className="header__icon" />
            </Badge>
          </IconButton>
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
