/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */

/* eslint-disable no-unused-vars */
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User, UserLogin, UserClaim, UserProfile } from '../../data/models';
import { auth as config } from '../../config';
/* eslint-enable no-unused-vars */

// eslint-disable-next-line no-unused-vars
function passportInit(passportLib: passport) {
  passportLib.use(new GitHubStrategy({
    clientID: config.github.id,
    clientSecret: config.github.secret,
    callbackURL: 'http://localhost:3000/login/github/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOrCreate({ githubId: profile.id },
      (err, user) => {
        done(err, user);
      });
  },
));
}

// eslint-disable-next-line no-unused-vars
function expressInit(app) {
  // eslint-disable-next-line no-console
  console.log('github express init need logic');

  app.get('/github',
    passport.authenticate('github', { scope: ['user:email'] }),
  );

  app.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res, next) => {
      // Successful authentication, redirect home.
      res.redirect('/');
      next();
    });
}

export { passportInit, expressInit };
