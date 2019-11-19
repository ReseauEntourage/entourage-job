/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-state */

// store/UserProvider.js
import React, { createContext, Component } from 'react';
import PropTypes from 'prop-types';
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
    if (accessToken) {
      console.log('token found');
      Api.get('/auth/current', {
        headers: { authorization: `Token ${accessToken}` },
      })
        .then((res) => {
          localStorage.setItem('access-token', res.data.user.token);
          this.setState({
            isAuthentificated: true,
            user: res.data.user,
          });
        })
        .catch(console.log);
    } else {
      console.log('no token');
    }
  }

  logout() {
    const { user } = this.state;

    if (user) {
      console.log('logout: start', user);
      Api.post('/auth/logout', {
        headers: { authorization: `Token ${user.token}` },
      })
        .then((res) => {
          console.log('logout: completed ', res);
          localStorage.removeItem('access-token');
          this.setState({
            isAuthentificated: false,
            user: null,
            error: null,
          });
        })
        .catch(console.error);
    } else {
      console.error('logout: no user');
    }
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      console.log('Start login');
      Api.post('/auth/login', {
        email,
        password,
      })
        .then((res) => {
          localStorage.setItem('access-token', res.data.user.token);
          this.setState({
            isAuthentificated: true,
            user: res.data.data,
          });
          resolve();
        })
        .catch((error) => {
          const myError = error.response.data.errors[0]
            ? error.response.data.errors[0]
            : error;
          console.log(error);
          this.setState({
            error: myError,
          });
          reject(myError);
        });
    });
  }

  render() {
    const { children } = this.props;
    return (
      <UserContext.Provider value={this.state}>{children}</UserContext.Provider>
    );
  }
}
