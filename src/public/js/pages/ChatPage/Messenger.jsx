import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

import ChatArea from './ChatArea';
import routes from '../../config/routes';
import config from '../../config/config';
import ConversationList from './ConversationList';
import {
  getConversations,
  setCurrentConversation,
} from '../../redux/ChatSlice';
import { getFollowingsById, setOnlineFriends } from '../../redux/UserSlice';

function Messenger() {
  const { user } = useSelector((state) => state.auth.account);
  const { conversations, currentConversation } = useSelector(
    (state) => state.chat,
  );
  const { followingDetails } = useSelector((state) => state.user);
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    // init socket instance
    socket.current = io(config.apiUrl);
  }, []);

  useEffect(() => {
    // fetch conversations
    dispatch(getConversations({ userId: user }));
  }, [dispatch, user]);

  useEffect(() => {
    // get conversation id from path /messages/:convId
    if (conversations?.conversations) {
      const splitPathname = pathname.split('/');
      const convid = splitPathname[splitPathname.length - 1];
      const conv = conversations?.conversations.find((c) => c.id === convid);
      if (conv) dispatch(setCurrentConversation(conv));
    }
  }, [conversations?.conversations, dispatch, pathname]);

  useEffect(() => {
    dispatch(getFollowingsById({ userId: user }));
  }, [dispatch, user]);

  useEffect(() => {
    socket.current.emit('add-user', user, currentConversation?.id);
    socket.current.on('get-users', (users) => {
      const onlineFrnds = followingDetails?.followings.filter((f) =>
        users.some((u) => u.userId === f?.user?.id),
      );

      dispatch(setOnlineFriends(onlineFrnds));
    });
  }, [
    currentConversation?.id,
    dispatch,
    followingDetails?.followings,
    user,
    socket,
  ]);

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
            {conversations?.conversations && (
              <ConversationList conversations={conversations?.conversations} />
            )}
          </div>
        </div>
        <Divider />
        <Divider orientation="vertical" flexItem />
        <div className="messenger__chat">
          {!currentConversation && (
            <p>You have x new messages.Click conversation to read.</p>
          )}
          <Route path={routes.messageTemplate} exact>
            {currentConversation && <ChatArea socket={socket} />}
          </Route>
        </div>
      </Paper>
    </>
  );
}

export default Messenger;
