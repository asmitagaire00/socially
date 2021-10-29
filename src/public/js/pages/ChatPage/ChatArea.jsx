import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import Message from './Message';
import SendMessage from './SendMessage';

import { useScrollToLatestMessageRef } from './hooks';
import { getMessages, setCurrentConversationSeen } from '../../redux/ChatSlice';

function ChatArea({ socket }) {
  const { user } = useSelector((state) => state.auth.account);
  const { messages, typing, currentConversation } = useSelector(
    (state) => state.chat,
  );

  const scrollToLatestMsgRef = useScrollToLatestMessageRef({
    messages: messages?.messages,
  });
  const dispatch = useDispatch();

  // const { current } = socket;

  useEffect(() => {
    dispatch(getMessages({ convId: currentConversation?.id }));
  }, [currentConversation?.id, dispatch]);

  useEffect(() => {
    // mark conversation read on mount
    if (currentConversation?.seenBy?.includes(user))
      setCurrentConversationSeen(true);
    else setCurrentConversationSeen(false);
  }, [currentConversation?.seenBy, user]);

  return (
    <div>
      <List className="messenger__chat-area">
        {messages?.messages &&
          messages?.messages.map((msg) => (
            <div ref={scrollToLatestMsgRef} key={msg.id}>
              <Message message={msg} own={user === msg.sender} />
            </div>
          ))}
      </List>
      {typing && 'Typing...'}
      <Divider />
      <SendMessage socket={socket} />
    </div>
  );
}

ChatArea.propTypes = {
  socket: PropTypes.shape({ current: PropTypes.instanceOf(Socket) }).isRequired,
};

export default ChatArea;
