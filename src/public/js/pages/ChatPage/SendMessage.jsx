import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';

import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

import { setTyping, createMessage, addNewMessage } from '../../redux/ChatSlice';

function SendMessage({ socket }) {
  const dispatch = useDispatch();
  const [typingMessage, setTypingMessage] = useState('');
  const [curConvLiveUsersId, setCurConvLiveUsersId] = useState('');
  const { user } = useSelector((state) => state.auth.account);
  const { currentConversation } = useSelector((state) => state.chat);

  const typingTimeout = useRef(null);

  const { current } = socket;

  useEffect(() => {
    current?.on('display-typing', ({ isTyping }) => {
      dispatch(setTyping(isTyping));
    });
  }, [dispatch, current]);

  useEffect(() => {
    current?.on('get-message', (data) => {
      const msg = {
        conversation: data.convId,
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
        id: data.senderId + Date.now().toString(), // temp id for live socket msgs only
      };

      dispatch(addNewMessage(msg));
    });
  }, [current, dispatch]);

  function handleMessageInputChange(e) {
    setTypingMessage(e.target.value);
  }

  function timeoutFunction() {
    current.emit('typing', {
      convId: currentConversation?.id,
      senderId: user,
      receiversId: currentConversation?.users.filter((u) => u !== user),
      isTying: false,
    });
  }

  function handleKeyUp(e) {
    if (e.code !== 'Enter') {
      current.emit('typing', {
        convId: currentConversation?.id,
        senderId: user,
        receiversId: currentConversation?.users.filter((u) => u !== user),
        isTyping: true,
      });
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(timeoutFunction, 2000);
    }
  }

  useEffect(() => {
    // mark conv as read to those users who are live in current conv chat
    current.on('get-users', (users) => {
      const curLiveUsersId = users
        .filter((u) => u.convId === currentConversation?.id)
        .map((u) => u.userId);

      setCurConvLiveUsersId(curLiveUsersId);
    });
  }, [current, currentConversation?.id]);

  function handleSendMessage(e) {
    e.preventDefault();

    const messageData = {
      convId: currentConversation?.id,
      senderId: user,
      text: typingMessage,
      seenBy: curConvLiveUsersId,
    };

    current.emit('send-message', {
      ...messageData,
      receiversId: currentConversation?.users,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    });

    dispatch(createMessage(messageData));
    setTypingMessage('');
  }

  return (
    <form onSubmit={handleSendMessage}>
      <Grid container style={{ padding: '20px' }}>
        <Grid item xs={11}>
          <TextField
            id="sendMessageInput"
            label=""
            fullWidth
            onChange={handleMessageInputChange}
            value={typingMessage}
            onKeyUp={handleKeyUp}
          />
        </Grid>
        <Grid item xs={1} align="right">
          <IconButton type="submit" color="primary" aria-label="send message">
            <SendIcon />
          </IconButton>
        </Grid>
      </Grid>
    </form>
  );
}

SendMessage.propTypes = {
  socket: PropTypes.shape({ current: PropTypes.instanceOf(Socket) }).isRequired,
};

export default SendMessage;
