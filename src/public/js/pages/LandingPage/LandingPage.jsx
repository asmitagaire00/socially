import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Redirect } from 'react-router';

import Login from '../../components/Login';
import Register from '../../components/Register';
import routes from '../../config/routes';
import { autoLogin } from '../../redux/AuthSlice';
import TokenService from '../../services/TokenService';

function LandingPage() {
  const { account } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { state: locationState } = useLocation();
  const { from } = locationState || { from: { pathname: routes.home } };

  const isAuthenticated = !!account;

  useEffect(() => {
    const jwtToken = TokenService.getToken();
    if (!account && jwtToken) dispatch(autoLogin(jwtToken));
  }, [dispatch, account]);

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
