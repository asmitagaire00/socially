import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Redirect } from 'react-router-dom';

import SvgIcon from '@material-ui/core/SvgIcon';

import Login from '../../components/Login';
import Register from '../../components/Register';
import routes from '../../config/routes';
import { autoLogin } from '../../redux/AuthSlice';
import TokenService from '../../services/TokenService';
import LandingImage from '../../../assets/img/landing-image.svg';
import Logo from '../../../assets/img/logo.svg';

function useAutoLogin() {
  const { account } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { state: locationState } = useLocation();
  const { from } = locationState || { from: { pathname: routes.home } };

  const isAuthenticated = !!account;

  useEffect(() => {
    const jwtToken = TokenService.getToken();
    if (!account && jwtToken) dispatch(autoLogin(jwtToken));
  }, [dispatch, account]);

  return {
    from,
    isAuthenticated,
  };
}

function LandingPage() {
  const { from, isAuthenticated } = useAutoLogin();
  const [registration, setRegistration] = useState(false);

  function handleAuthClick() {
    setRegistration(!registration);
  }

  // keyboard support a11y
  function handleKeyDown(e) {
    if (e.keyCode === 13) handleAuthClick();
  }

  return (
    <>
      {isAuthenticated ? (
        <Redirect to={from} />
      ) : (
        <div className="landing">
          <div className="landing__auth">
            <div className="landing__logo-wrapper">
              <Logo className="landing__logo" />
            </div>
            {registration ? (
              <div className="landing__auth-area">
                <h1>Sign Up</h1>

                <Register />
                <p>
                  Already a member?{' '}
                  <b
                    role="button"
                    tabIndex={0}
                    onClick={handleAuthClick}
                    onKeyDown={handleKeyDown}
                    className="landing__auth-link"
                  >
                    Log in
                  </b>
                </p>
              </div>
            ) : (
              <div className="landing__auth-area">
                <h1>Log In</h1>
                <Login />
                <p>
                  New to Socially?{' '}
                  <b
                    role="button"
                    tabIndex={0}
                    onClick={handleAuthClick}
                    onKeyDown={handleKeyDown}
                    className="landing__auth-link"
                  >
                    Sign up
                  </b>
                </p>
              </div>
            )}
          </div>
          <div className="landing__hero">
            <div className="landing__hero-img">
              <SvgIcon
                component={LandingImage}
                viewBox="0 0 1082 530.8387"
                className="landing__svg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LandingPage;
