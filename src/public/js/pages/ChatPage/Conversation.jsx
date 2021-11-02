import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import chatService from '../../services/ChatService';
import { setNotification } from '../../redux/NotificationSlice';
import {
  markCurrentConversationSeen,
  setCurrentConversation,
} from '../../redux/ChatSlice';

function Conversation({ conversation }) {
  const [convName, setConvName] = useState('');
  const [thisConvSeen, setThisConvSeen] = useState(true);
  const { user } = useSelector((state) => state.auth.account);
  const dispatch = useDispatch();

  useEffect(() => {
    // get users info to set conv name
    chatService
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
      .catch(() =>
        dispatch(
          setNotification({ message: 'Could not fetch users!', isError: true }),
        ),
      );
  }, [conversation.id, dispatch]);

  useEffect(() => {
    // check if conversation is seen by current user
    if (conversation?.seenBy?.includes(user)) setThisConvSeen(true);
    else setThisConvSeen(false);
  }, [conversation?.seenBy, user]);

  // keyboard support a11y
  function handleKeyDown(e) {
    if (e.keyCode === 13) dispatch(setCurrentConversation(conversation));
  }

  function handleConvClick() {
    // set conversation seen by current user on conv click
    dispatch(
      markCurrentConversationSeen({
        convId: conversation?.id,
        userIds: [user],
      }),
    );
    setThisConvSeen(true);
  }

  return (
    <>
      <div
        onClick={() => handleConvClick()}
        key={conversation.id}
        role="button"
        tabIndex={0}
        onKeyDown={() => handleKeyDown()}
      >
        <Link to={`/messages/${conversation.id}`}>
          <List className="conversation">
            <ListItem button key={convName}>
              <ListItemIcon>
                <Avatar
                  alt={convName}
                  src="https://material-ui.com/static/images/avatar/1.jpg"
                />
              </ListItemIcon>
              <ListItemText className="conversation__name">
                {convName} {!thisConvSeen && '  <<<New message!!>>>'}
              </ListItemText>
            </ListItem>
          </List>
        </Link>
      </div>
    </>
  );
}

Conversation.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.string).isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    seenBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Conversation;
