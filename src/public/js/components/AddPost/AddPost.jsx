import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';

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
          <label htmlFor="add-post__file-select">
            Add photo
            <input
              type="file"
              id="add-post__file-select"
              accept="image/*"
              className="add-post__file-select--hidden"
              onChange={handleFileSelect}
            />
          </label>
          <Button className="add-post__btn" startIcon={<AddAPhotoIcon />}>
            Add photo
          </Button>
          <Button className="add-post__btn" startIcon={<LocationOnIcon />}>
            Location
          </Button>
          <Button className="add-post__btn" startIcon={<EmojiEmotionsIcon />}>
            Feelings
          </Button>
        </div>
        <div className="add-post__btn-list--right">
          <Button
            className="add-post__share-btn"
            onClick={handlePostSubmit}
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>
    </div>
  );
}
