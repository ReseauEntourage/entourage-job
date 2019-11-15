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
      new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password',
          session: false,
        },
        (email, password, done) => {
          console.log(`lets found the user : ${email}`);
          UserController.getUserByEmail(email)
            .then((user) => {
              if (
                !user ||
                !AuthController.validatePassword(password, user.hash, user.salt)
              ) {
                return done(null, false, {
                  errors: { 'email or password': 'is invalid' },
                });
              }
              return done(null, user);
            })
            .catch(done);
        }
      )
    );
    return passport.initialize();
  },
  session() {
    return passport.session();
  },
};
