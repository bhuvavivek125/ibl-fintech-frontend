import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import useAuth from 'hooks/useAuth';
import Loader from 'ui-component/Loader';
import { DASHBOARD_PATH } from 'config';
import { GuardProps } from 'types';

// Guest guard for routes having no auth required

export default function GuestGuard({ children }: GuardProps) {
  const { isLoggedIn, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && isLoggedIn) {
      navigate(DASHBOARD_PATH, { replace: true });
    }
  }, [isLoggedIn, isInitialized, navigate]);

  if (!isInitialized) {
    return <Loader />;
  }

  if (isLoggedIn) {
    return null;
  }

  return children;
}

