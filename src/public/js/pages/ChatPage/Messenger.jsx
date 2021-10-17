import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

import Message from './Message';
import SendMessage from './SendMessage';
import Conversation from './Conversation';
import messageService from '../../services/MessageService';
import { setNotification } from '../../redux/NotificationSlice';
import config from '../../config/config';
import { getFollowingsById } from '../../redux/UserSlice';

function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [liveMessage, setLiveMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth.account);
  const { followingDetails } = useSelector((state) => state.user);
  const scrollToLatestMsgRef = useRef();
  const socket = useRef();

  useEffect(() => {
    // init socket
    socket.current = io(config.apiUrl);

    dispatch(getFollowingsById({ userId: user }));

    socket.current.on('get-message', (data) => {
      setLiveMessage({
        conversation: data.convId,
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
        id: data.senderId + Date.now().toString(), // temp id for live socket msgs only
      });
    });
  }, [dispatch, user]);

  useEffect(() => {
    if (
      liveMessage &&
      currentConversation?.users.includes(liveMessage.sender)
    ) {
      setMessages((prev) => [...prev, liveMessage]);
    }
  }, [currentConversation?.users, liveMessage]);

  useEffect(() => {
    socket.current.emit('add-user', user, currentConversation?.id);
    socket.current.on('get-users', (users) => {
      setOnlineUsers(
        followingDetails?.followings.filter((f) =>
          users.some((u) => u.userId === f?.user?.id),
        ),
      );
    });
  }, [currentConversation?.id, followingDetails?.followings, user]);

  //
  useEffect(() => {
    messageService
      .getConversations({ userId: user })
      .then((res) => {
        const { data } = res.data;
        setConversations(data);
      })
      .catch(() =>
        dispatch(
          setNotification({
            message: 'Error. Could not fetch conversations!',
            isError: true,
          }),
        ),
      );
  }, [dispatch, user]);

  useEffect(() => {
    const id = currentConversation?.id;
    if (id) {
      messageService
        .getMessages({ convId: id })
        .then((res) => {
          const { data } = res.data;
          setMessages(data);
        })
        .catch(() =>
          dispatch(
            setNotification({
              message: 'Error. Could not fetch messages!',
              isError: true,
            }),
          ),
        );
    }
  }, [currentConversation?.id, dispatch, user]);

  useEffect(() => {
    scrollToLatestMsgRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // keyboard support a11y
  function handleKeyDown(e, conv) {
    if (e.keyCode === 13) setCurrentConversation(conv);
  }

  function handleSendMessage(e) {
    e.preventDefault();

    socket.current.emit('send-message', {
      convId: currentConversation?.id,
      senderId: user,
      receiversId: currentConversation?.users,
      text: message,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    });

    messageService
      .createMessage({
        convId: currentConversation?.id,
        senderId: user,
        text: message,
      })
      .then((res) => {
        const { data } = res.data;
        setMessage('');
        setMessages([...messages, data]);
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

  function handleMessageInputChange(e) {
    setMessage(e.target.value);
  }

  return (
    <>
      {/* {!onlineUsers && 'No online users!'}
      {onlineUsers && onlineUsers.map((u) => `${u?.user?.id}, `)} */}

      <Paper variant="outlined" square className="messenger">
        <div className="messenger__conversations">
          <div className="messenger__search">
            <TextField
              id="searchFieldChat"
              label="Search"
              variant="outlined"
              fullWidth
            />
          </div>
          <Divider />
          <div className="messenger__conv">
            {conversations.map((conv) => (
              <div
                onClick={() => setCurrentConversation(conv)}
                key={conv.id}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, conv)}
              >
                <Conversation conversation={conv} />
              </div>
            ))}
          </div>
        </div>
        <Divider />
        <Divider orientation="vertical" flexItem />
        <div className="messenger__chat">
          <List className="messenger__chat-area">
            {!currentConversation && (
              <p>Click one of the conversations to get started.</p>
            )}
            {messages &&
              messages.map((msg) => (
                <div ref={scrollToLatestMsgRef} key={msg.id}>
                  <Message message={msg} own={user === msg.sender} />
                </div>
              ))}
          </List>

          <Divider />
          <SendMessage
            message={message}
            handleSendMessage={handleSendMessage}
            handleMessageInputChange={handleMessageInputChange}
          />
        </div>
      </Paper>
    </>
  );
}

export default Messenger;
