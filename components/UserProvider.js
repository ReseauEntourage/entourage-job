/* eslint-disable max-classes-per-file */

// store/UserProvider.js
import { createContext, Component } from 'react';
import Api from '../Axios';

/**
 * On ajoute la propriété `setName` à notre contexte
 */

export const UserContext = createContext({
  user: undefined,
  isAuthentificated: false,
  checkUserTokens: () => {},
  logout: () => {},
  login: () => {},
});

export default class UserProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      isAuthentificated: false,
      checkUserTokens: () => this.checkUserTokens(),
      logout: () => this.logout(),
      login: (email, password) => this.login(email, password),
    };
  }

  checkUserTokens() {
    return new Promise((resolve, reject) => {
      // Control if user is connected and always available
      if (localStorage.getItem('access-token')) {
        Api.get('/api/users/validate_token')
          .then((res) => {
            // console.log("Validating tokens");
            if (res.status === 401) {
              console.log('Tokens are not valid');
              this.logout();
              reject('Tokens are not valid');
            }
            if (res.status === 200) {
              // console.log("Valid tokens !");
              this.setState({ isAuthentificated: true, user: res.data.data });
              console.log('Connected user: ', res.data.data);
              resolve();
            }
          })
          .catch((error) => {
            console.log('UserService error (checkUserTokens) : ', error);
            reject(error);
          });
      } else {
        reject();
      }
    });
  }

  logout() {
    console.log('Start logout');
    Api.delete('/auth/logout')
      .then((res) => {
        console.log('Logout completed : ', res);
        console.log('Removed tokens and deauth!');
      })
      .catch((error) => {
        if (error.response.status === 404) {
          console.log('Expired or wrong token removed and deAuth');
        } else {
          console.log('UserService error (logout) : ', error.response);
        }
      })
      .finally(() => {
        console.log('Delete localStorage');
        // localStorage.removeItem('access-token');
        // localStorage.removeItem('client');
        // localStorage.removeItem('uid');
        // localStorage.removeItem('userId');
        localStorage.removeItem('access-token');
        localStorage.removeItem('email');
        localStorage.removeItem('uid');
        console.log('Delete user connected');
        this.setState({
          isAuthentificated: false,
          user: undefined,
          error: undefined,
        });
      });
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      console.log('Start login');
      Api.post('/auth/login', {
        email,
        password,
      })
        .then((res) => {
          // localStorage.setItem(
          //   'access-token',
          //   res.headers[Object.keys(res.headers)[0]]
          // );
          // localStorage.setItem('uid', res.headers.uid);
          // localStorage.setItem('client', res.headers.client);
          // localStorage.setItem('userId', res.data.data.id);
          localStorage.setItem('access-token', res.data.user.token);
          localStorage.setItem('email', res.data.user.email);
          localStorage.setItem('uid', res.data.user._id);
          this.setState({
            isAuthentificated: true,
            user: res.data.data,
          });
          resolve();
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response);
          console.log(error.response.data);
          console.log(error.response.data.errors);
          const errors = error.response.data.errors[0]
            ? error.response.data.errors[0]
            : error;
          this.setState({ error: errors });
          reject(errors);
        });
    });
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
// export const UserContext = createContext({
//   user: null,
//   isAuthentificated: false,
//   writeUser(user) {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('session', JSON.stringify(user));
//       this.user = user;
//       this.isAuthentificated = true;
//     }
//   },
//   loadUser() {
//     if (typeof window !== 'undefined') {
//       try {
//         this.user = JSON.parse(localStorage.getItem('session'));
//         this.isAuthentificated = true;
//       } catch (er) {
//         this.isAuthentificated = false;
//       }
//     }
//   },
//   removeUser() {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('session');
//       this.isAuthentificated = false;
//       this.user = null;
//     }
//   },
// });
