import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import CommentIcon from '@material-ui/icons/Comment';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import AvatarImg from '../../../assets/img/dennis.jpeg';
import DialogCustom from '../DialogCustom/DialogCustom';
import Comment from '../Comment/Comment';
import { createLike, removeLike } from '../../redux/PostSlice';
import routes from '../../config/routes';

export default function Post(props) {
  const { likes, comments, caption, image, user, createdAt, postId } = props;

  dayjs.extend(relativeTime);
  const parsedCreatedAt = dayjs(createdAt).fromNow();

  const [commentOpen, setCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const dispatch = useDispatch();
  const { firstName, lastName, userName } = user.account;
  const { id: userId } = user;
  const name = `${firstName} ${lastName}`;
  const likesCount = likes.length;
  const commentsCount = comments.length;

  const likeId = useRef(null);
  useEffect(() => {
    let likedAlready = false;

    likes.some((like) => {
      const likedByUserId = like.user;
      if (likedByUserId === userId) {
        likedAlready = true;
        likeId.current = like.id;
      }
      return true;
    });

    if (likedAlready) setLiked(true);
    else setLiked(false);
  }, [likes, userId]);

  function handleLikeClick(e) {
    e.preventDefault();
    if (liked) dispatch(removeLike({ likeId: likeId.current }));
    else dispatch(createLike({ postId }));
  }

  function handleCommentClick() {
    setCommentOpen(!commentOpen);
  }

  function handleCommentClose() {
    setCommentOpen(false);
  }

  return (
    <>
      <DialogCustom open={commentOpen} handleClose={handleCommentClose}>
        <Comment comments={comments} postId={postId} />
      </DialogCustom>
      <Card className="post" variant="outlined" square>
        <CardHeader
          avatar={<Avatar src={AvatarImg} className="post__avatar" />}
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <Link
              to={{
                pathname: routes.profile(userName),
                state: { userId, userName },
              }}
              className="link"
            >
              {name}
            </Link>
          }
          subheader={parsedCreatedAt}
        />
        {image && (
          <CardMedia className="post__image" image={image} title={caption} />
        )}
        <CardContent>
          <span>{caption && caption}</span>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            className={liked ? 'post__like--liked' : 'post__like--unliked'}
            onClick={handleLikeClick}
          >
            <FavoriteIcon />
          </IconButton>
          <IconButton onClick={handleCommentClick}>
            <CommentIcon />
          </IconButton>
          <IconButton>
            <ShareIcon />
          </IconButton>
          <div className="post__info">
            <span className="post__likes">
              {likesCount <= 1 ? `${likesCount} like` : `${likesCount} likes`}
            </span>
            <span className="post__comments">
              {commentsCount <= 1
                ? `${commentsCount} comment`
                : `${commentsCount} comments`}
            </span>
          </div>
        </CardActions>
      </Card>
    </>
  );
}

Post.defaultProps = {
  caption: '',
  image: '',
};

Post.propTypes = {
  likes: PropTypes.arrayOf(PropTypes.object).isRequired,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  postId: PropTypes.string.isRequired,
  caption: PropTypes.string,
  image: PropTypes.string,
  user: PropTypes.instanceOf(Object).isRequired,
  createdAt: PropTypes.string.isRequired,
};
