import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

function SendMessage({ message, handleSendMessage, handleMessageInputChange }) {
  return (
    <form onSubmit={handleSendMessage}>
      <Grid container style={{ padding: '20px' }}>
        <Grid item xs={11}>
          <TextField
            id="sendMessageInput"
            label=""
            fullWidth
            onChange={handleMessageInputChange}
            value={message}
          />
        </Grid>
        <Grid item xs={1} align="right">
          <IconButton type="submit" color="primary" aria-label="send message">
            <SendIcon />
          </IconButton>
        </Grid>
      </Grid>
    </form>
  );
}

SendMessage.propTypes = {
  message: PropTypes.string.isRequired,
  handleMessageInputChange: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
};

export default SendMessage;
