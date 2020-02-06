/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-state */

// store/UserProvider.js
import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Api from '../../Axios';

/**
 * On ajoute la propriété `setName` à notre contexte
 */

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthentificated, setIsAuthentificated] = useState(false);

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

    setUser(data.user);
    setIsAuthentificated(true);
    Router.push('/backoffice/cv/edit');
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    if (accessToken) {
      console.log('token found: ', accessToken);
      Api.get('/api/v1/auth/current')
        .then(({ data }) => {
          localStorage.setItem('access-token', data.user.token);

          setUser(data.user);
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem('access-token');
          Router.push('/login');
        });
    } else {
      console.log('no token');
    }
  }, []);

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
