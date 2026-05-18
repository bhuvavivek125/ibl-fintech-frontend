import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// project imports
import useAuth from 'hooks/useAuth';
import Loader from 'ui-component/Loader';
import { GuardProps } from 'types';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
export default function AuthGuard({ children }: GuardProps) {
  const { isLoggedIn, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, isInitialized, navigate]);

  if (!isInitialized) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return null;
  }

  return children;
}

