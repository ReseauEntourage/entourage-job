// The Passport require must be below all models

import * as UserController from 'src/backend/controllers/User';
import * as AuthController from 'src/backend/controllers/Auth';

import passport from 'passport';
import LocalStrategy from 'passport-local';

// configuring Passport
passport.serializeUser((user, done) => {
  return done(null, user);
});
passport.deserializeUser((user, done) => {
  return done(null, user);
});

export default {
  initialize() {
    passport.use(
      new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password',
        },
        (email, password, done) => {
          UserController.getUserByEmail(email)
            .then((user) => {
              if (
                !user ||
                !AuthController.validatePassword(
                  password,
                  user.dataValues.password,
                  user.dataValues.salt
                )
              ) {
                return done(null, false, {
                  error: `L'adresse email ou le mot de passe est invalide`,
                });
              }
              return done(null, user);
            })
            .catch((err) => {
              console.log('ERR', err);
              done(err);
            });
        }
      )
    );
    return passport.initialize();
  },
};
