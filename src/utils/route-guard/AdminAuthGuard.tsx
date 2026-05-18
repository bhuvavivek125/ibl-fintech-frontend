import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// project imports
import useAdminAuth from 'hooks/useAdminAuth';
import { GuardProps } from 'types';
import Loader from 'ui-component/Loader';

// ==============================|| ADMIN AUTH GUARD ||============================== //

export default function AdminAuthGuard({ children }: GuardProps) {
  const { isLoggedIn, isInitialized } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, isInitialized, navigate]);

  // Show loader while initializing
  if (!isInitialized) {
    return <Loader />;
  }

  // Redirect if not logged in
  if (!isLoggedIn) {
    return null;
  }

  return children;
}
