import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import MenuSharp from '@material-ui/icons/MenuSharp';
import NotificationsIcon from '@material-ui/icons/Notifications';

import SearchBar from './SearchBar';
import ProfileMenu from './ProfileMenu';
import routes from '../../config/routes';
import DrawerCustom from '../DrawerCustom/DrawerCustom';
import DrawerList from './DrawerList';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { userName, user } = useSelector((state) => state.auth.account);
  const { id: userId } = user;

  function handleHamburgerClick() {
    setDrawerOpen(!drawerOpen);
  }

  return (
    <>
      {drawerOpen && (
        <DrawerCustom
          open={drawerOpen}
          handleToggleDrawer={handleHamburgerClick}
        >
          <DrawerList />
        </DrawerCustom>
      )}
      <header>
        <div className="header">
          <div className="header__logo">
            <IconButton
              color="inherit"
              onClick={handleHamburgerClick}
              className="header__hamburger"
            >
              <MenuSharp />
            </IconButton>
            <Link className="link" to={routes.home}>
              Socially
            </Link>
          </div>
          <SearchBar />
          <div className="header__links">
            <Link
              to={{
                pathname: '/messages',
                state: { userId, userName },
              }}
            >
              <IconButton
                className="header__icon-btn"
                aria-label="Show messages"
                color="inherit"
              >
                <Badge badgeContent={3} max={10} color="primary">
                  <MailIcon className="header__icon" />
                </Badge>
              </IconButton>
            </Link>
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
    </>
  );
}
