/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Route, useLocation } from 'react-router-dom';

import routes from '../../config/routes';

function ProtectedRoute({ children, ...rest }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const isAuthenticated = !!user;

  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: routes.root,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default ProtectedRoute;
