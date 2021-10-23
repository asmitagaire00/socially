import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import Message from './Message';
import SendMessage from './SendMessage';

function ChatArea({
  user,
  message,
  messages,
  handleSendMessage,
  scrollToLatestMsgRef,
  handleMessageInputChange,
}) {
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

      <Divider />
      <SendMessage
        message={message}
        handleSendMessage={handleSendMessage}
        handleMessageInputChange={handleMessageInputChange}
      />
    </div>
  );
}

ChatArea.propTypes = {
  user: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSendMessage: PropTypes.func.isRequired,
  scrollToLatestMsgRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  handleMessageInputChange: PropTypes.func.isRequired,
};

export default ChatArea;
