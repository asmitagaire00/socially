import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import { hideNotification } from '../../redux/NotificationSlice';

export default function Alert() {
  const isOpen = useSelector((state) => state.notification.isOpen);
  const isError = useSelector((state) => state.notification.isError);
  const message = useSelector((state) => state.notification.message);

  const dispatch = useDispatch();

  function handleClose() {
    dispatch(hideNotification());
  }

  return (
    <>
      {isOpen && message && (
        <Snackbar open={isOpen} autoHideDuration={5000} onClose={handleClose}>
          <MuiAlert
            variant="filled"
            onClose={handleClose}
            severity={isError ? 'error' : 'info'}
          >
            {message}
          </MuiAlert>
        </Snackbar>
      )}
    </>
  );
}
