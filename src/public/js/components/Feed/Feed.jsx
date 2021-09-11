import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../../redux/PostSlice';

import AddPost from '../AddPost';
import Post from '../Post';

export default function Feed() {
  const LIMIT = 7; // num of posts per request
  const skip = useRef(0);
  const dispatch = useDispatch();
  const { loading, posts, totalPostsCount } = useSelector(
    (state) => state.post,
  );

  const observer = useRef(null);

  const bottomRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          dispatch(getPosts({ skip: skip.current, limit: LIMIT }));
          skip.current += LIMIT;
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, dispatch],
  );

  return (
    <div className="feed">
      <AddPost />
      {posts &&
        posts.map((post) => {
          const {
            likes,
            comments,
            tags,
            caption,
            image,
            user,
            id: postId,
            createdAt,
            updatedAt,
          } = post;

          return (
            <Post
              key={postId}
              likes={likes}
              comments={comments}
              tags={tags}
              caption={caption}
              image={image}
              user={user}
              postId={postId}
              createdAt={createdAt}
              updatedAt={updatedAt}
            />
          );
        })}
      {posts.length === totalPostsCount ? (
        <></>
      ) : (
        <div ref={bottomRef}>Loading...</div>
      )}
    </div>
  );
}
