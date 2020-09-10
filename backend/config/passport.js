// The Passport require must be below all models

const passport = require('passport');
const LocalStrategy = require('passport-local');

const UserController = require('../controllers/User');
const AuthController = require('../controllers/Auth');

// configuring Passport
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = {
  initialize() {
    passport.use(
      new LocalStrategy({
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
              done(err)
            });
        }
      )
    );
    return passport.initialize();
  }
};
