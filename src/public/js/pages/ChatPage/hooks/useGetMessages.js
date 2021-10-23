import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import messageService from '../../../services/MessageService';
import { setNotification } from '../../../redux/NotificationSlice';

function useGetMessages({ currentConvId }) {
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const id = currentConvId;
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
  }, [currentConvId, dispatch]);

  return [messages, setMessages];
}

export default useGetMessages;
