import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { authService } from '../../services/AuthService';
import routes from '../../config/routes';
import { setNotification } from '../../redux/NotificationSlice';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function VerifyEmail() {
  const [verified, setVerified] = useState(false);
  const dispatch = useDispatch();

  const query = useQuery();
  const token = query.get('token');

  useEffect(() => {
    if (!token) return;

    authService
      .verifyEmail(token)
      .then(() => {
        setVerified(true);
        dispatch(
          setNotification({
            message: 'Email verified. You can login now.',
            isError: false,
          }),
        );
      })
      .catch(() => {
        setVerified(false);
      });
  }, [dispatch, token]);

  return (
    <>
      <div>Email verification status: {JSON.stringify(verified)}</div>
      <div>
        <Link to={`${routes.root}`}>Login</Link>
      </div>
    </>
  );
}

export default VerifyEmail;
