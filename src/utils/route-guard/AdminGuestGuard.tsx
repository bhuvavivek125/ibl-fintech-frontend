import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// project imports
import useAdminAuth from 'hooks/useAdminAuth';
import { DASHBOARD_PATH } from 'config';
import { GuardProps } from 'types';
import Loader from 'ui-component/Loader';

// ==============================|| ADMIN GUEST GUARD ||============================== //

export default function AdminGuestGuard({ children }: GuardProps) {
  const { isLoggedIn, isInitialized } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && isLoggedIn) {
      navigate(DASHBOARD_PATH, { replace: true });
    }
  }, [isLoggedIn, isInitialized, navigate]);

  // Show loader while initializing
  if (!isInitialized) {
    return <Loader />;
  }

  // Redirect if logged in
  if (isLoggedIn) {
    return null;
  }

  return children;
}
