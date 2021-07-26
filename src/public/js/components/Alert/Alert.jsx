import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import { hideError } from '../../redux/ErrorNotificationSlice';

export default function Alert() {
  const isOpen = useSelector((state) => state.errorNotification.isOpen);
  const errorMessage = useSelector(
    (state) => state.errorNotification.errorMessage,
  );

  const dispatch = useDispatch();

  function handleClose() {
    dispatch(hideError());
  }

  return (
    <>
      {isOpen && errorMessage && (
        <Dialog fullWidth open={isOpen} onClose={handleClose} data-test="alert">
          <DialogTitle data-test="alert__title">Error!</DialogTitle>
          <DialogContent>
            <DialogContentText data-test="alert__text">
              {errorMessage}
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
