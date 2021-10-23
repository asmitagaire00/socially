import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, useLocation } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

import ChatArea from './ChatArea';
import { getFollowingsById } from '../../redux/UserSlice';
import messageService from '../../services/MessageService';
import { setNotification } from '../../redux/NotificationSlice';

import {
  useSocketChat,
  useGetMessages,
  useGetConversations,
  useScrollToLatestMessageRef,
} from './hooks';
import ConversationList from './ConversationList';
import routes from '../../config/routes';

function Messenger() {
  const { user } = useSelector((state) => state.auth.account);
  const conversations = useGetConversations({
    userId: user,
  });
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useGetMessages({
    currentConvId: currentConversation?.id,
  });
  const [message, setMessage] = useState('');
  const [liveMessage, setLiveMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();
  const { followingDetails } = useSelector((state) => state.user);
  const scrollToLatestMsgRef = useScrollToLatestMessageRef({ messages });
  const socket = useSocketChat();
  const { pathname } = useLocation();

  useEffect(() => {
    // get conversation id from path /messages/convid
    const splitPathname = pathname.split('/');
    const convid = splitPathname[splitPathname.length - 1];
    const conv = conversations?.find((c) => c.id === convid);
    if (conv) setCurrentConversation(conv);
  }, [conversations, pathname]);

  useEffect(() => {
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
  }, [dispatch, socket, user]);

  useEffect(() => {
    if (
      liveMessage &&
      currentConversation?.users.includes(liveMessage.sender)
    ) {
      setMessages((prev) => [...prev, liveMessage]);
    }
  }, [currentConversation?.users, liveMessage, setMessages]);

  useEffect(() => {
    socket.current.emit('add-user', user, currentConversation?.id);
    socket.current.on('get-users', (users) => {
      setOnlineUsers(
        followingDetails?.followings.filter((f) =>
          users.some((u) => u.userId === f?.user?.id),
        ),
      );
    });
  }, [currentConversation?.id, followingDetails?.followings, socket, user]);

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
          <div
            className={
              pathname !== routes.messages
                ? 'messenger__conv--hidden'
                : 'messenger__conv'
            }
          >
            <ConversationList
              conversations={conversations}
              setCurrentConversation={setCurrentConversation}
            />
          </div>
        </div>
        <Divider />
        <Divider orientation="vertical" flexItem />
        <div className="messenger__chat">
          {!currentConversation && (
            <p>You have x new messages.Click conversation to read.</p>
          )}
          <Route path={routes.messageTemplate} exact>
            <ChatArea
              user={user}
              message={message}
              messages={messages}
              scrollToLatestMsgRef={scrollToLatestMsgRef}
              handleSendMessage={handleSendMessage}
              handleMessageInputChange={handleMessageInputChange}
            />
          </Route>
        </div>
      </Paper>
    </>
  );
}

export default Messenger;
