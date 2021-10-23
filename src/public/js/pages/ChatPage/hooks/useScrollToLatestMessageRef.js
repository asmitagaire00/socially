import { useRef, useEffect } from 'react';

function useScrollToLatestMessageRef({ messages }) {
  const scrollToLatestMsgRef = useRef();

  useEffect(() => {
    scrollToLatestMsgRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return scrollToLatestMsgRef;
}

export default useScrollToLatestMessageRef;
