import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { clearPosts, getPostsByUserName } from '../../redux/PostSlice';

function useFetchPosts() {
  const [postsClear, setPostsClear] = useState(false);
  const dispatch = useDispatch();
  const { loading, posts, totalPostsCount } = useSelector(
    (state) => state.post,
  );
  const LIMIT = 7; // num of posts per request
  const skip = useRef(0);
  const { userName } = useParams();

  const loadMorePosts = () => {
    dispatch(
      getPostsByUserName({ userName, skip: skip.current, limit: LIMIT }),
    );
    skip.current += LIMIT;
  };

  useEffect(() => {
    // clear posts array on mount as posts array might not be empty on route changes
    dispatch(clearPosts());
    setPostsClear(true);
  }, [dispatch]);

  return { postsClear, loading, posts, totalPostsCount, loadMorePosts };
}

export default useFetchPosts;
