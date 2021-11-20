/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-state */

// store/UserProvider.js
import React, { createContext, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Api from 'src/Axios';
import { STORAGE_KEYS, USER_ROLES } from 'src/constants';
import { usePrevious } from 'src/hooks/utils';

/**
 * On ajoute la propriété `setName` à notre contexte
 */

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { push, asPath, pathname } = useRouter();

  const [user, setUser] = useState(null);
  const [isAuthentificated, setIsAuthentificated] = useState(false);

  const previousUser = usePrevious(user);
  const previousPathname = usePrevious(pathname);

  const resetAndRedirect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    setIsAuthentificated(false);
    setUser(null);
    push('/login');
  }, [push]);

  // la restriction devrait etre faite des le serveur !
  const restrictAccessByRole = useCallback(
    (role) => {
      if (pathname.includes('/backoffice/admin') && role !== USER_ROLES.ADMIN) {
        push('/login');
      } else if (
        pathname.includes('/backoffice/candidat') &&
        role === USER_ROLES.ADMIN
      ) {
        push(
          pathname.replace('candidat', 'admin'),
          asPath.replace('candidat', 'admin')
        );
      }
    },
    [asPath, pathname, push]
  );

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
    if (pathname !== previousPathname) {
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
        if (pathname.includes('/backoffice')) {
          resetAndRedirect();
        }
      }
    }
  }, [
    pathname,
    previousPathname,
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
