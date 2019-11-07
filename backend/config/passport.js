// The Passport require must be below all models

const passport = require('passport');
const LocalStrategy = require('passport-local');
// const db = require('../db/config/databaseConnect');
// const sequelize = require('sequelize');

// const Users = require('../../../db/models/user')(db, sequelize.DataTypes);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]',
    },
    (email, password, done) => {
      console.log(`lets found the user : ${email}`);

      // Users.findOne({ email })
      //   .then((user) => {
      //     if (!user || !user.validatePassword(password)) {
      //       return done(null, false, {
      //         errors: { 'email or password': 'is invalid' },
      //       });
      //     }

      //     return done(null, user);
      //   })
      //   .catch(done);
      done(null, false, {
        errors: { server: 'db is not called' },
      });
    }
  )
);
