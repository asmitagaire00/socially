import React from 'react';
import PropTypes from 'prop-types';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

function DrawerCustom({ open, handleToggleDrawer, children }) {
  return (
    <div
      role="presentation"
      onClick={handleToggleDrawer}
      onKeyDown={handleToggleDrawer}
    >
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={handleToggleDrawer}
        onOpen={handleToggleDrawer}
      >
        {children}
      </SwipeableDrawer>
    </div>
  );
}

DrawerCustom.propTypes = {
  open: PropTypes.bool.isRequired,
  handleToggleDrawer: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default DrawerCustom;
