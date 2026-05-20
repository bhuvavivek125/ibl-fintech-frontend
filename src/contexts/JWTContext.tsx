import { createContext, ReactElement, useEffect, useReducer } from 'react';

import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

import Loader from 'ui-component/Loader';
import axios from 'utils/axios';

import { KeyedObject } from 'types';
import { InitialLoginContextProps, JWTContextType } from 'types/auth';

const chance = new Chance();

// constant
const initialState: InitialLoginContextProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

function verifyToken(serviceToken: string): boolean {
  if (!serviceToken) {
    return false;
  }

  const decoded: KeyedObject = jwtDecode(serviceToken);

  // Ensure 'exp' exists and compare it to the current timestamp
  if (!decoded.exp) {
    throw new Error("Token does not contain 'exp' property.");
  }

  return decoded.exp > Date.now() / 1000;
}

function setSession(serviceToken?: string | null): void {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
}


const JWTContext = createContext<JWTContextType | null>(null);

export function JWTProvider({ children }: { children: ReactElement }) {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          const response = await axios.get('/auth/me');
          const { user } = response.data.data;
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/auth/login', { email, password });
    const { token, user } = response.data.data;
    setSession(token);
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user
      }
    });
  };


  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    await axios.post('/auth/register', {
      email,
      password,
      name: `${firstName} ${lastName}`,
      role: 'user'
    });
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (email: string) => { };

  const updateProfile = () => { };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext>;
}

export default JWTContext;
