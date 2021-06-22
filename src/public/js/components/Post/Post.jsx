import React from "react";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import CommentIcon from "@material-ui/icons/Comment";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import PostImg1 from "../../../assets/img/mountain.jpg";
import AvatarImg from "../../../assets/img/dennis.jpeg";

export default function Post() {
    return (
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
                title="Dennis Ritchie"
                subheader="10 mins ago"
            />
            <CardMedia
                className="post__image"
                image={PostImg1}
                title="Look at the scene"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    This was such a nice hike and would love to go there again.
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="Like">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="show more">
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
                        7 likes
                    </Typography>
                    <Typography
                        className="post__comments"
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        3 comments
                    </Typography>
                </div>
            </CardActions>
        </Card>
    );
}
