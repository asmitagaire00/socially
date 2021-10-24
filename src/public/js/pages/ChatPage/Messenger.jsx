import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

import ChatArea from './ChatArea';
import { getFollowingsById } from '../../redux/UserSlice';

import routes from '../../config/routes';
import config from '../../config/config';
import { useGetConversations } from './hooks';
import ConversationList from './ConversationList';

function Messenger() {
  const { user } = useSelector((state) => state.auth.account);
  const conversations = useGetConversations({
    userId: user,
  });
  const [currentConversation, setCurrentConversation] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();
  const { followingDetails } = useSelector((state) => state.user);
  const socket = useRef();
  const { pathname } = useLocation();

  useEffect(() => {
    // init socket instance
    socket.current = io(config.apiUrl);
  }, []);

  useEffect(() => {
    // get conversation id from path /messages/convid
    const splitPathname = pathname.split('/');
    const convid = splitPathname[splitPathname.length - 1];
    const conv = conversations?.find((c) => c.id === convid);
    if (conv) setCurrentConversation(conv);
  }, [conversations, pathname]);

  useEffect(() => {
    dispatch(getFollowingsById({ userId: user }));
  }, [dispatch, user]);

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

  return (
    <>
      {/* {!onlineUsers && 'No online users!'}
      {onlineUsers && onlineUsers.map((u) => `${u?.user?.id}, `)} */}

      <Paper variant="outlined" square className="messenger">
        <div className="messenger__conversations">
          <div className="messenger__search">
            <TextField label="" variant="outlined" fullWidth />
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
            {currentConversation && (
              <ChatArea
                currentConversation={currentConversation}
                socket={socket}
              />
            )}
          </Route>
        </div>
      </Paper>
    </>
  );
}

export default Messenger;
