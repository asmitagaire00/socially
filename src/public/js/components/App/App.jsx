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
  const { open, title, text } = useSelector((state) => state.alert);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!user && jwtToken) dispatch(autoLogin(jwtToken));
  }, []);

  return (
    <>
      <Alert open={open} title={title} text={text} />
      <BrowserRouter>
        <Switch>
          <Route path={routes.login}>
            <Login />
          </Route>
          <Route path={routes.register}>
            <Register />
          </Route>
          <ProtectedRoute path={routes.root} exact>
            <AppDashboard />
          </ProtectedRoute>
        </Switch>
      </BrowserRouter>
    </>
  );
}
