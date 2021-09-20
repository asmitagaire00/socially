import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import CommentIcon from '@material-ui/icons/Comment';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import AvatarImg from '../../../assets/img/dennis.jpeg';
import DialogCustom from '../DialogCustom/DialogCustom';
import Comment from '../Comment/Comment';
import { createLike, removeLike } from '../../redux/PostSlice';

export default function Post(props) {
  const { likes, comments, caption, image, user, createdAt, postId } = props;

  const [commentOpen, setCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const dispatch = useDispatch();
  const { firstName, lastName } = user.account;
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
      {/* eslint-disable-next-line react/jsx-no-bind */}
      <DialogCustom open={commentOpen} handleClose={handleCommentClose}>
        <Comment comments={comments} postId={postId} />
      </DialogCustom>
      <Card className="post">
        <CardHeader
          avatar={
            <Avatar
              src={AvatarImg}
              aria-label="post"
              className="post__avatar"
            />
          }
          action={
            <IconButton aria-label="post options">
              <MoreVertIcon />
            </IconButton>
          }
          title={name}
          subheader={createdAt}
        />
        {image && (
          <CardMedia className="post__image" image={image} title={caption} />
        )}
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {caption && caption}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            aria-label="Like"
            className={liked ? 'like--liked' : 'like--unliked'}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={handleLikeClick}
          >
            <FavoriteIcon />
          </IconButton>
          {/* eslint-disable-next-line react/jsx-no-bind */}
          <IconButton aria-label="Comment" onClick={handleCommentClick}>
            <CommentIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <div className="post__info">
            <Typography
              className="post__likes"
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {likesCount <= 1 ? `${likesCount} like` : `${likesCount} likes`}
            </Typography>
            <Typography
              className="post__comments"
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {commentsCount <= 1
                ? `${commentsCount} comment`
                : `${commentsCount} comments`}
            </Typography>
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
