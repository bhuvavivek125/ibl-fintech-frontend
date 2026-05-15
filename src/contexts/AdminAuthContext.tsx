import { createContext, ReactElement, useEffect, useReducer, useState } from 'react';

// third party
import { jwtDecode } from 'jwt-decode';

// project imports
import Loader from 'ui-component/Loader';
import { adminLogin, AdminLoginResponse } from 'api/admin-auth';
import { fetchUserPermissions } from 'api/user-permissions';

// types
import { KeyedObject } from 'types';
import { AdminContextType, AdminInitialLoginContextProps } from 'types/admin-auth';

// Initial state
const initialState: AdminInitialLoginContextProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  permissions: null
};

// Action types
const ADMIN_LOGIN = 'ADMIN_LOGIN';
const ADMIN_LOGOUT = 'ADMIN_LOGOUT';
const ADMIN_INIT = 'ADMIN_INIT';
const ADMIN_SET_PERMISSIONS = 'ADMIN_SET_PERMISSIONS';

interface AdminReducerAction {
  type: string;
  payload?: any;
}

// Reducer function
function adminReducer(state = initialState, action: AdminReducerAction): AdminInitialLoginContextProps {
  switch (action.type) {
    case ADMIN_LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user: action.payload.user,
        permissions: null
      };
    case ADMIN_SET_PERMISSIONS:
      return {
        ...state,
        permissions: action.payload.permissions
      };
    case ADMIN_LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        isInitialized: true,
        user: null,
        permissions: null
      };
    case ADMIN_INIT:
      return {
        ...state,
        isInitialized: true
      };
    default:
      return state;
  }
}

// Token verification
function verifyAdminToken(token: string): boolean {
  if (!token) {
    return false;
  }

  try {
    const decoded: KeyedObject = jwtDecode(token);
    if (!decoded.exp) {
      return false;
    }
    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
}

// Set session
function setAdminSession(token?: string | null): void {
  if (token) {
    localStorage.setItem('adminAccessToken', token);
  } else {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminUser');
  }
}

// ==============================|| ADMIN AUTH CONTEXT ||============================== //

const AdminAuthContext = createContext<(AdminContextType & { isLoading?: boolean; error?: string | null }) | null>(null);

export function AdminAuthProvider({ children }: { children: ReactElement }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize on mount - check if admin is already logged in
  useEffect(() => {
    const init = async () => {
      try {
        const adminToken = window.localStorage.getItem('adminAccessToken');
        const adminUserData = window.localStorage.getItem('adminUser');
        const adminPermissions = window.localStorage.getItem('adminPermissions');

        if (adminToken && verifyAdminToken(adminToken) && adminUserData) {
          setAdminSession(adminToken);
          const user = JSON.parse(adminUserData);
          
          dispatch({
            type: ADMIN_LOGIN,
            payload: {
              user
            }
          });

          // Load stored permissions if available
          if (adminPermissions) {
            try {
              const permissions = JSON.parse(adminPermissions);
              dispatch({
                type: ADMIN_SET_PERMISSIONS,
                payload: {
                  permissions
                }
              });
            } catch (parseErr) {
              console.error('Failed to parse stored permissions:', parseErr);
            }
          }

          // Try to refresh permissions in background
          try {
            const permissionsResponse = await fetchUserPermissions(user.id);
            if (permissionsResponse.success) {
              dispatch({
                type: ADMIN_SET_PERMISSIONS,
                payload: {
                  permissions: permissionsResponse
                }
              });
              localStorage.setItem('adminPermissions', JSON.stringify(permissionsResponse));
            }
          } catch (permErr) {
            console.error('Failed to refresh user permissions:', permErr);
            // Don't fail initialization if permissions refresh fails
          }
        } else {
          // Clear invalid token
          setAdminSession(null);
          dispatch({
            type: ADMIN_LOGOUT
          });
        }
      } catch (err) {
        console.error('Admin auth initialization error:', err);
        setAdminSession(null);
        dispatch({
          type: ADMIN_LOGOUT
        });
      }
    };

    init();
  }, []);

  // Admin login function
  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response: AdminLoginResponse = await adminLogin({ username, password });

      if (response.success && response.data.accessToken) {
        const { accessToken, user } = response.data;

        // Store token and user in localStorage
        setAdminSession(accessToken);
        localStorage.setItem('adminUser', JSON.stringify(user));

        dispatch({
          type: ADMIN_LOGIN,
          payload: {
            user
          }
        });

        // Fetch user permissions after successful login
        try {
          const permissionsResponse = await fetchUserPermissions(user.id);
          if (permissionsResponse.success) {
            dispatch({
              type: ADMIN_SET_PERMISSIONS,
              payload: {
                permissions: permissionsResponse
              }
            });
            localStorage.setItem('adminPermissions', JSON.stringify(permissionsResponse));
          }
        } catch (permErr) {
          console.error('Failed to fetch user permissions:', permErr);
          // Don't throw error here, allow login to succeed even if permissions fetch fails
        }

        setError(null);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err?.response?.data?.message || err.message || 'Login failed');
      setAdminSession(null);
      dispatch({
        type: ADMIN_LOGOUT
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Admin logout function
  const logout = (): void => {
    setAdminSession(null);
    dispatch({
      type: ADMIN_LOGOUT
    });
  };

  // Show loader while initializing
  if (state.isInitialized === false) {
    return <Loader />;
  }

  return (
    <AdminAuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isLoading: isLoading,
        error: error
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export default AdminAuthContext;
