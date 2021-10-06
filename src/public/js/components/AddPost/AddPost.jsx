import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import AddAPhotoSharp from '@material-ui/icons/AddAPhotoSharp';

import { createPost } from '../../redux/PostSlice';

export default function AddPost() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.post);

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
    <div className="add-post">
      <div>
        <textarea
          name="add-post"
          id=""
          rows="5"
          className="add-post__textarea"
          placeholder="What's on your mind, Dennis?"
          onChange={handleCaptionChange}
          value={caption}
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
            <Fab
              size="small"
              component="span"
              aria-label="add"
              className="add-post__btn"
            >
              <AddAPhotoSharp />
            </Fab>
          </label>
        </div>
        <div className="add-post__btn-list--right">
          <Button onClick={handlePostSubmit} disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>
    </div>
  );
}
