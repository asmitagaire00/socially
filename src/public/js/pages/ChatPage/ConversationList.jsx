import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import Conversation from './Conversation';
import { setCurrentConversation } from '../../redux/ChatSlice';

function ConversationList({ conversations }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // set current conversation to null on mount
    dispatch(setCurrentConversation(null));
  }, [dispatch]);

  return (
    <>
      {conversations &&
        conversations.map((conv) => (
          <Conversation conversation={conv} key={conv.id} />
        ))}
    </>
  );
}

ConversationList.propTypes = {
  conversations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ConversationList;
