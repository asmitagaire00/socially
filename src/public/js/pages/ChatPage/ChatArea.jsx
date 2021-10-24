import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import Message from './Message';
import SendMessage from './SendMessage';

import { useGetMessages, useScrollToLatestMessageRef } from './hooks';

function ChatArea({ currentConversation, socket }) {
  // const socket = useSocket();
  const [typing, setTyping] = useState(false);
  const { user } = useSelector((state) => state.auth.account);
  const [messages, setMessages] = useGetMessages({
    currentConvId: currentConversation?.id,
  });
  const [liveMessage, setLiveMessage] = useState('');
  const scrollToLatestMsgRef = useScrollToLatestMessageRef({ messages });

  useEffect(() => {
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
  }, [socket]);

  useEffect(() => {
    if (
      liveMessage &&
      currentConversation?.users.includes(liveMessage.sender)
    ) {
      setMessages((prev) => [...prev, liveMessage]);
    }
  }, [currentConversation?.users, liveMessage, setMessages]);

  function updateMessagesFromChild(data) {
    setMessages([...messages, data]);
  }

  function updateTypingFromChild(isTyping) {
    setTyping(isTyping);
  }

  return (
    <div>
      <List className="messenger__chat-area">
        {messages &&
          messages.map((msg) => (
            <div ref={scrollToLatestMsgRef} key={msg.id}>
              <Message message={msg} own={user === msg.sender} />
            </div>
          ))}
      </List>
      {typing && 'Typing...'}
      <Divider />
      <SendMessage
        currentConversation={currentConversation}
        updateMessages={updateMessagesFromChild}
        updateTyping={updateTypingFromChild}
        socket={socket}
      />
    </div>
  );
}

ChatArea.propTypes = {
  currentConversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  socket: PropTypes.shape({ current: PropTypes.instanceOf(Socket) }).isRequired,
};

export default ChatArea;
