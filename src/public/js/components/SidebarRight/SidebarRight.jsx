import React from 'react';

import CakeIcon from '@material-ui/icons/Cake';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';

import FeaturedImg from '../../../assets/img/girl.jpg';
import AvatarImg from '../../../assets/img/dennis.jpeg';

export default function SidebarRight() {
  return (
    <Paper variant="outlined" square>
      <div className="sidebar-right__birthday">
        <div className="sidebar-right__birthday-icon">
          <CakeIcon />
        </div>
        <div className="sidebar-right__birthday-info">
          Steve Jobs and 2 others have birthdays today.
        </div>
      </div>
      <div className="sidebar-right__featured">
        <span>
          <b>Featured</b>
        </span>
        <img
          className="sidebar-right__featured-img"
          src={FeaturedImg}
          alt="featured content"
        />
      </div>
      <div className="sidebar-right__chat">
        <span>
          <b>Chat</b>
        </span>
        <ul className="sidebar-right__chat-list">
          <li className="sidebar-right__chat-item">
            <Avatar
              src={AvatarImg}
              aria-label="post"
              className="sidebar-right__avatar--active"
            />
            <span>Dennis Ritchie</span>
          </li>
          <li className="sidebar-right__chat-item">
            <Avatar
              src={AvatarImg}
              aria-label="post"
              className="sidebar-right__avatar--active"
            />
            <span>Dennis Ritchie</span>
          </li>
          <li className="sidebar-right__chat-item">
            <Avatar
              src={AvatarImg}
              aria-label="post"
              className="sidebar-right__avatar"
            />
            <span>Dennis Ritchie</span>
          </li>
          <li className="sidebar-right__chat-item">
            <Avatar
              src={AvatarImg}
              aria-label="post"
              className="sidebar-right__avatar"
            />
            <span>Dennis Ritchie</span>
          </li>
          <li className="sidebar-right__chat-item">
            <Avatar
              src={AvatarImg}
              aria-label="post"
              className="sidebar-right__avatar"
            />
            <span>Dennis Ritchie</span>
          </li>
        </ul>
      </div>
    </Paper>
  );
}
