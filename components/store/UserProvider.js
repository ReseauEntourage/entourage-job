/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-state */

// store/UserProvider.js
import React, { createContext, Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Api from '../../Axios';

/**
 * On ajoute la propriété `setName` à notre contexte
 */

export const UserContext = createContext();

export default class UserProvider extends Component {
  static get propTypes() {
    return {
      children: PropTypes.element.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthentificated: false,
      logout: () => this.logout(),
      login: (email, password) => this.login(email, password),
    };
  }

  // Control if user is connected and always available
  componentDidMount() {
    const accessToken = localStorage.getItem('access-token');
    console.log(accessToken);
    if (accessToken) {
      console.log('token found');
      Api.get('/api/v1/auth/current')
        .then((res) => {
          localStorage.setItem('access-token', res.data.user.token);
          this.setState({
            isAuthentificated: true,
            user: res.data.user,
          });
          // Router.push('/backoffice/cv/edit');
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem('access-token');
          Router.push('/login');
        });
    } else {
      console.log('no token');
    }
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      console.log('Start login');
      Api.post('/api/v1/auth/login', {
        email,
        password,
      })
        .then((res) => {
          localStorage.setItem('access-token', res.data.user.token);
          console.log('login success');
          console.log(res.data.user);
          this.setState({
            isAuthentificated: true,
            user: res.data.user,
          });
          Router.push('/backoffice/cv/edit');
          resolve();
        })
        .catch((error) => {
          console.error(error);
          this.setState({
            error: "Une erreur s'est produite",
          });
          reject("Une erreur s'est produite");
        });
    });
  }

  logout() {
    const { user } = this.state;

    if (user) {
      console.log('logout: start', user);
      Api.post('/api/v1/auth/logout')
        .catch(console.error)
        .finally((res) => {
          console.log('logout: completed ', res);
          localStorage.removeItem('access-token');
          this.setState({
            isAuthentificated: false,
            user: null,
            error: null,
          });
          Router.push('/login');
        });
    } else {
      console.error('logout: no user');
    }
  }

  render() {
    const { children } = this.props;
    return (
      <UserContext.Provider value={this.state}>{children}</UserContext.Provider>
    );
  }
}
