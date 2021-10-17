import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import messageService from '../../services/MessageService';
import { setNotification } from '../../redux/NotificationSlice';

function Conversation({ conversation }) {
  const [convName, setConvName] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    messageService
      .getUsers({ convId: conversation.id })
      .then((res) => {
        const { data } = res.data;
        setConvName(
          data.reduce(
            (acc, curUser) => `${acc + curUser.account?.firstName}, `,
            '',
          ),
        );
      })
      .catch(() => dispatch(setNotification({ isError: true })));
  }, [conversation, dispatch]);

  return (
    <List className="conversation">
      <ListItem button key={convName}>
        <ListItemIcon>
          <Avatar
            alt={convName}
            src="https://material-ui.com/static/images/avatar/1.jpg"
          />
        </ListItemIcon>
        <ListItemText className="conversation__name">{convName}</ListItemText>
      </ListItem>
    </List>
  );
}

Conversation.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.string).isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default Conversation;
