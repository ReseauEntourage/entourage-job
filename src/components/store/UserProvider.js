/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-state */

// store/UserProvider.js
import React, { createContext, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Api from 'src/Axios';
import { USER_ROLES, STORAGE_KEYS } from 'src/constants';
import { usePrevious } from 'src/hooks/utils';

/**
 * On ajoute la propriété `setName` à notre contexte
 */

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthentificated, setIsAuthentificated] = useState(false);

  const previousUser = usePrevious(user);
  const previousChildren = usePrevious(children);

  const resetAndRedirect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    setIsAuthentificated(false);
    setUser(null);
    Router.push('/login');
  }, []);

  // la restriction devrait etre faite des le serveur !
  const restrictAccessByRole = useCallback((role) => {
    if (
      (Router.pathname.includes('/backoffice/admin') &&
        role !== USER_ROLES.ADMIN) ||
      (Router.pathname.includes('/backoffice/candidat') &&
        role !== USER_ROLES.CANDIDAT &&
        role !== USER_ROLES.COACH)
    ) {
      Router.push('/login');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await Api.post('/api/v1/auth/logout');
    } finally {
      resetAndRedirect();
    }
  }, [resetAndRedirect]);

  const login = useCallback(async (email, password) => {
    console.log('Start login');
    const { data } = await Api.post('/api/v1/auth/login', {
      email: email.toLowerCase(),
      password,
    });
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.user.token);
    console.log('login successful', data.user);

    setIsAuthentificated(true);
    setUser(data.user);
  }, []);

  useEffect(() => {
    if (children !== previousChildren) {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (accessToken) {
        Api.get('/api/v1/auth/current')
          .then(({ data }) => {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.user.token);
            setIsAuthentificated(true);
            if (user !== previousUser) setUser(data.user);
            restrictAccessByRole(data.user.role);
          })
          .catch((err) => {
            console.log(err);
            resetAndRedirect();
          });
      } else {
        console.log('no token');
        if (Router.pathname.includes('/backoffice')) {
          resetAndRedirect();
        }
      }
    }
  }, [
    children,
    previousChildren,
    previousUser,
    resetAndRedirect,
    restrictAccessByRole,
    user,
  ]);

  return (
    <UserContext.Provider
      value={{ user, setUser, isAuthentificated, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
export default UserProvider;
