import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Redirect } from 'react-router';

import Login from '../../components/Login';
import Register from '../../components/Register';
import routes from '../../config/routes';
import { autoLogin } from '../../redux/AuthSlice';

function LandingPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { state: locationState } = useLocation();
  const { from } = locationState || { from: { pathname: routes.home } };

  const isAuthenticated = !!user;

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!user && jwtToken) dispatch(autoLogin(jwtToken));
  }, [dispatch, user]);

  return (
    <>
      {isAuthenticated ? (
        <Redirect to={from} />
      ) : (
        <div>
          <Login />
          <div style={{ marginBottom: '50px' }} />
          <Register />
        </div>
      )}
    </>
  );
}

export default LandingPage;
