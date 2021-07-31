import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import { hideNotification } from '../../redux/NotificationSlice';

export default function Alert() {
  const isOpen = useSelector((state) => state.notification.isOpen);
  const message = useSelector((state) => state.notification.message);

  const dispatch = useDispatch();

  function handleClose() {
    dispatch(hideNotification());
  }

  return (
    <>
      {isOpen && message && (
        <Dialog fullWidth open={isOpen} onClose={handleClose} data-test="alert">
          <DialogTitle data-test="alert__title">Error!</DialogTitle>
          <DialogContent>
            <DialogContentText data-test="alert__text">
              {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={handleClose}
              color="primary"
              autoFocus
              data-test="alert__button"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
