import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import messageService from '../../../services/MessageService';
import { setNotification } from '../../../redux/NotificationSlice';

function useGetConversations({ userId }) {
  const [conversations, setConversations] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    messageService
      .getConversations({ userId })
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
  }, [dispatch, userId]);

  return conversations;
}

export default useGetConversations;
