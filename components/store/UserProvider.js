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
    const fetchUser = async () => {
      const accessToken = localStorage.getItem('access-token');
      if (accessToken) {
        try {
          console.log('token found', accessToken);
          const { data } = await Api.get('/api/v1/auth/current');
          localStorage.setItem('access-token', data.token);
          setUser(data);
          setIsAuthentificated(true);
        } catch (err) {
          console.error(err);
          localStorage.removeItem('access-token');
          setUser(null);
          setIsAuthentificated(false);
          Router.push('/login');
        }
      } else {
        console.log('token not found');
        setUser(null);
        setIsAuthentificated(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isAuthentificated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
export default UserProvider;
