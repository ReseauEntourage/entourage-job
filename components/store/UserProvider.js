/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-state */

// store/UserProvider.js
import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Api from '../../Axios';
import {USER_ROLES} from "../../constants";

/**
 * On ajoute la propriété `setName` à notre contexte
 */

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthentificated, setIsAuthentificated] = useState(false);

  // la restriction devrait etre faite des le serveur !
  const restrictAccessByRole = (role) => {
    if (
      (Router.pathname.includes('/backoffice/admin') && role !== USER_ROLES.ADMIN) ||
      (Router.pathname.includes('/backoffice/candidat') &&
        role !== USER_ROLES.CANDIDAT &&
        role !== USER_ROLES.COACH)
    ) {
      Router.push('/login');
    }
  };

  const logout = async () => {
    try {
      await Api.post('/api/v1/auth/logout');
    } finally {
      localStorage.removeItem('access-token');
      setIsAuthentificated(false);
      setUser(null);
      Router.push('/login');
    }
  };

  const login = async (email, password) => {
    console.log('Start login');
    const { data } = await Api.post('/api/v1/auth/login', {
      email,
      password,
    });
    localStorage.setItem('access-token', data.user.token);
    console.log('login successful', data.user);

    setIsAuthentificated(true);
    setUser(data.user);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    if (accessToken) {
      Api.get('/api/v1/auth/current')
        .then(({ data }) => {
          localStorage.setItem('access-token', data.user.token);
          setIsAuthentificated(true);
          setUser(data.user);
          restrictAccessByRole(data.user.role);
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem('access-token');
          Router.push('/login');
        });
    } else {
      console.log('no token');
      if (Router.pathname.includes('/backoffice')) {
        Router.push('/login');
      }
    }
  }, [children]);

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
