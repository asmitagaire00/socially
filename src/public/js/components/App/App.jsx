import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import '../../../css/main.css'; // css entry point

import routes from '../../config/routes';
import Alert from '../Alert';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import VerifyEmail from '../VerifyEmail';
import HomePage from '../../pages/HomePage';
import ProfilePage from '../../pages/ProfilePage/ProfilePage';
import LandingPage from '../../pages/LandingPage/LandingPage';
import axiosSetup from '../../helpers/axiosSetup';
import ChatPage from '../../pages/ChatPage';

export default function App() {
  // setup axios interceptors
  axiosSetup();

  return (
    <>
      <Alert />
      <BrowserRouter>
        <Switch>
          <ProtectedRoute path={routes.home} exact>
            <HomePage />
          </ProtectedRoute>
          <Route path={routes.root} exact>
            <LandingPage />
          </Route>
          <ProtectedRoute path={routes.messages}>
            <ChatPage />
          </ProtectedRoute>
          <Route path={routes.verifyEmail} exact>
            <VerifyEmail />
          </Route>
          <ProtectedRoute path={routes.profileTemplate} exact>
            <ProfilePage />
          </ProtectedRoute>
        </Switch>
      </BrowserRouter>
    </>
  );
}
