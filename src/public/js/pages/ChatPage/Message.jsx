import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function Message({ message, own }) {
  return (
    <ListItem key="1">
      <Grid container>
        <Grid item xs={12}>
          <ListItemText align={own ? 'right' : 'left'} primary={message.text} />
        </Grid>
        <Grid item xs={12}>
          <ListItemText
            align={own ? 'right' : 'left'}
            secondary={message.createdAt}
          />
        </Grid>
      </Grid>
    </ListItem>
  );
}

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    conversation: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
  own: PropTypes.bool.isRequired,
};

export default Message;
