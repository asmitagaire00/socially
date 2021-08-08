import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import '../../../css/main.css'; // css entry point

import routes from '../../config/routes';
import Alert from '../Alert';
import Feed from '../Feed/Feed';
import Header from '../Header';
import Sidebar from '../Sidebar';
import SidebarRight from '../SidebarRight/SidebarRight';
import Login from '../Login';
import Register from '../Register';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { autoLogin } from '../../redux/AuthSlice';
import VerifyEmail from '../VerifyEmail';
import axiosSetup from '../../helpers/axiosSetup';

function AppDashboard() {
  return (
    <div className="app">
      <Header />
      <div className="app__main">
        <Sidebar />
        <Feed />
        <SidebarRight />
      </div>
    </div>
  );
}

export default function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // setup axios interceptors
    axiosSetup();

    const jwtToken = localStorage.getItem('jwtToken');
    if (!user && jwtToken) dispatch(autoLogin(jwtToken));
  }, []);

  return (
    <>
      <Alert />
      <BrowserRouter>
        <Switch>
          <Route path={routes.login}>
            <Login />
          </Route>
          <Route path={routes.register}>
            <Register />
          </Route>
          <Route path="/account/verify-email">
            <VerifyEmail />
          </Route>
          <ProtectedRoute path={routes.root} exact>
            <AppDashboard />
          </ProtectedRoute>
        </Switch>
      </BrowserRouter>
    </>
  );
}
