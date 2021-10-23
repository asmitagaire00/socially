import { useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

import config from '../../../config/config';

function useSocketChat() {
  const socket = useRef();

  useEffect(() => {
    // init socket
    socket.current = io(config.apiUrl);
  }, []);

  return socket;
}

export default useSocketChat;
