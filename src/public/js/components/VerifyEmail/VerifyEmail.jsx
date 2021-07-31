import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { userService } from '../../services/userService';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function VerifyEmail() {
  const [verified, setVerified] = useState(false);

  const query = useQuery();
  const token = query.get('token');

  useEffect(() => {
    if (!token) return;

    userService
      .verifyEmail(token)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not verify email.');
        }
        return response.json();
      })
      .then(() => {
        setVerified(true);
      })
      .catch(() => {
        setVerified(false);
      });
  }, []);

  return (
    <>
      <div>token: {token}</div>
      <div>Email verification status: {JSON.stringify(verified)}</div>
    </>
  );
}

export default VerifyEmail;
