import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import { closeAlert } from './AlertSlice';

export default function Alert({ open, title, text }) {
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(closeAlert());
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} data-test="alert">
      <DialogTitle data-test="alert__title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText data-test="alert__text">{text}</DialogContentText>
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
  );
}

Alert.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  text: PropTypes.string,
};

Alert.defaultProps = {
  title: 'Error',
  text: 'Some error occurred',
};
