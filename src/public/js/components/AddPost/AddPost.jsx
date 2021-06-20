import React from "react";

import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";

export default function AddPost() {
    return (
        <div className="add-post">
            <div>
                <textarea
                    name="add-post"
                    id=""
                    rows="3"
                    className="add-post__textarea"
                    placeholder="What's on your mind, Dennis?"
                />
            </div>
            <div className="add-post__btn-list">
                <div className="add-post__btn-list--left">
                    <Button
                        className="add-post__btn"
                        startIcon={<AddAPhotoIcon />}
                    >
                        Add photo
                    </Button>
                    <Button
                        className="add-post__btn"
                        startIcon={<LocationOnIcon />}
                    >
                        Location
                    </Button>
                    <Button
                        className="add-post__btn"
                        startIcon={<EmojiEmotionsIcon />}
                    >
                        Feelings
                    </Button>
                </div>
                <div className="add-post__btn-list--right">
                    <Button className="add-post__share-btn">Share</Button>
                </div>
            </div>
        </div>
    );
}
