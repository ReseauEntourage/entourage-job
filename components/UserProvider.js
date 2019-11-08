/* eslint-disable max-classes-per-file */

// store/UserProvider.js
import { createContext } from 'react';

/**
 * On ajoute la propriété `setName` à notre contexte
 */
export default createContext({
  user: null,
  isAuthentificated: false,
  writeUser(user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('session', JSON.stringify(user));
      this.user = user;
      this.isAuthentificated = true;
    }
  },
  loadUser() {
    if (typeof window !== 'undefined') {
      this.user = JSON.parse(localStorage.getItem('session'));
      this.isAuthentificated = true;
    }
  },
  removeUser() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('session');
      this.isAuthentificated = false;
      this.user = null;
    }
  },
});
