import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import TextAreaResize from '@material-ui/core/TextareaAutosize';

import AddAPhotoSharp from '@material-ui/icons/AddAPhotoSharp';

import { createPost } from '../../redux/PostSlice';

export default function AddPost() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.post);
  const { firstName } = useSelector((state) => state.auth.account);

  function handleFileSelect(e) {
    const selectedImage = e.target.files[0];
    const imageUrl = URL.createObjectURL(selectedImage);
    setImage(selectedImage);
    setPreviewImageUrl(imageUrl);
  }

  function handleCaptionChange(e) {
    setCaption(e.target.value);
  }

  function handlePostSubmit(e) {
    e.preventDefault();
    setCaption('');
    setImage(null);
    setPreviewImageUrl(null);
    if (caption || image) dispatch(createPost({ caption, image }));
  }

  return (
    <Paper className="add-post" variant="outlined" square>
      <div>
        <TextAreaResize
          name="add-post"
          className="add-post__textarea"
          placeholder={`What's on your mind, ${firstName}?`}
          onChange={handleCaptionChange}
          value={caption}
          rows={2}
        />
        {previewImageUrl && (
          <img
            src={previewImageUrl}
            alt="post-preview"
            className={
              previewImageUrl
                ? 'add-post__preview--visible'
                : 'add-post__preview--hidden'
            }
            height="100px"
            width="100px"
          />
        )}
      </div>
      <div className="add-post__btn-list">
        <div className="add-post__btn-list--left">
          <label htmlFor="addPostImgSelect">
            <input
              type="file"
              id="addPostImgSelect"
              accept="image/*"
              className="add-post__file-select--hidden"
              onChange={handleFileSelect}
            />
            <Tooltip title="Add photo">
              <IconButton
                size="small"
                component="span"
                aria-label="Add photo"
                className="add-post__btn"
              >
                <AddAPhotoSharp />
              </IconButton>
            </Tooltip>
          </label>
        </div>
        <div className="add-post__btn-list--right">
          <Button onClick={handlePostSubmit} disabled={loading}>
            Post
          </Button>
        </div>
      </div>
    </Paper>
  );
}
