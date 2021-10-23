import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Conversation from './Conversation';

function ConversationList({ conversations, setCurrentConversation }) {
  // keyboard support a11y
  function handleKeyDown(e, conv) {
    if (e.keyCode === 13) setCurrentConversation(conv);
  }

  return (
    <>
      {conversations &&
        conversations.map((conv) => (
          <div
            onClick={() => setCurrentConversation(conv)}
            key={conv.id}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, conv)}
          >
            <Link to={`/messages/${conv.id}`}>
              <Conversation conversation={conv} />
            </Link>
          </div>
        ))}
    </>
  );
}

ConversationList.propTypes = {
  conversations: PropTypes.arrayOf(PropTypes.object).isRequired,
  setCurrentConversation: PropTypes.func.isRequired,
};

export default ConversationList;
