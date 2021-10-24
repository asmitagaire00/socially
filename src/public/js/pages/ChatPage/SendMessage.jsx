import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';

import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

import messageService from '../../services/MessageService';
import { setNotification } from '../../redux/NotificationSlice';

function SendMessage({
  currentConversation,
  updateMessages,
  updateTyping,
  socket,
}) {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth.account);
  const typingTimeout = useRef(null);

  useEffect(() => {
    socket.current.on('display-typing', ({ isTyping }) => {
      updateTyping(isTyping);
    });
  }, [socket, updateTyping]);

  function handleMessageInputChange(e) {
    setMessage(e.target.value);
  }

  function timeoutFunction() {
    socket.current.emit('typing', {
      convId: currentConversation?.id,
      senderId: user,
      receiversId: currentConversation?.users.filter((u) => u !== user),
      isTying: false,
    });
  }

  function handleKeyUp(e) {
    if (e.code !== 'Enter') {
      socket.current.emit('typing', {
        convId: currentConversation?.id,
        senderId: user,
        receiversId: currentConversation?.users.filter((u) => u !== user),
        isTyping: true,
      });
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(timeoutFunction, 2000);
    }
  }

  function handleSendMessage(e) {
    e.preventDefault();

    const messageData = {
      convId: currentConversation?.id,
      senderId: user,
      text: message,
    };

    socket.current.emit('send-message', {
      ...messageData,
      receiversId: currentConversation?.users,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    });

    messageService
      .createMessage(messageData)
      .then((res) => {
        const { data } = res.data;
        setMessage('');
        updateMessages(data);
      })
      .catch(() =>
        dispatch(
          setNotification({
            message: 'Error. Could not create message!',
            isError: true,
          }),
        ),
      );
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
            value={message}
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
  currentConversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  updateMessages: PropTypes.func.isRequired,
  updateTyping: PropTypes.func.isRequired,
  socket: PropTypes.shape({ current: PropTypes.instanceOf(Socket) }).isRequired,
};

export default SendMessage;
