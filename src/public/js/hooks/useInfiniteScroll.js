import { useCallback } from 'react';

function useInfiniteScroll(loading, loadMore) {
  const infiniteScrollRef = useCallback(
    (node) => {
      if (!node || loading) return;

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      observer.observe(node);
    },
    [loading, loadMore],
  );

  return infiniteScrollRef;
}

export default useInfiniteScroll;
