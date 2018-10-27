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

import passport from 'passport';
import bcrypt from 'bcrypt-nodejs';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, UserLogin, UserClaim, UserProfile } from './data/models';
import config from './config';

/**
 * Sign in with Facebook.
 */
passport.use(
  new FacebookStrategy(
    {
      clientID: config.auth.facebook.id,
      clientSecret: config.auth.facebook.secret,
      callbackURL: '/login/facebook/return',
      profileFields: [
        'displayName',
        'name',
        'email',
        'link',
        'locale',
        'timezone',
      ],
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      const createFacebookUser = async params => {
        /* eslint-disable no-underscore-dangle */
        const user = await User.create(
          {
            ...params,
            profile: {
              displayName: profile.displayName,
              gender: profile._json.gender,
              picture: `https://graph.facebook.com/${
                profile.id
              }/picture?type=large`,
            },
          },
          {
            include: [
              { model: UserLogin, as: 'logins' },
              { model: UserClaim, as: 'claims' },
              { model: UserProfile, as: 'profile' },
            ],
          },
        );
        done(null, {
          id: user.id,
          email: user.email,
        });
      };
      const loginName = 'facebook';
      const claimType = 'urn:facebook:access_token';
      const fooBar = async () => {
        if (req.user) {
          const userLogin = await UserLogin.findOne({
            attributes: ['name', 'key'],
            where: { name: loginName, key: profile.id },
          });
          if (userLogin) {
            // There is already a Facebook account that belongs to you.
            // Sign in with that account or delete it, then link it with your current account.
            done();
          } else {
            createFacebookUser({
              id: req.user.id,
              email: profile._json.email,
              logins: [{ name: loginName, key: profile.id }],
              claims: [{ type: claimType, value: profile.id }],
            });
          }
        } else {
          const users = await User.findAll({
            attributes: ['id', 'email'],
            where: { '$logins.name$': loginName, '$logins.key$': profile.id },
            include: [
              {
                attributes: ['name', 'key'],
                model: UserLogin,
                as: 'logins',
                required: true,
              },
            ],
          });
          if (users.length) {
            const user = users[0].get({ plain: true });
            done(null, user);
          } else {
            const user = await User.findOne({
              where: { email: profile._json.email },
            });
            if (user) {
              // There is already an account using this email address. Sign in to
              // that account and link it with Facebook manually from Account Settings.
              done(null);
            } else {
              createFacebookUser({
                email: profile._json.email,
                emailConfirmed: true,
                logins: [{ name: loginName, key: profile.id }],
                claims: [{ type: claimType, value: accessToken }],
              });
            }
          }
        }
      };

      fooBar().catch(done);
    },
  ),
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'usernameOrEmail',
      passwordField: 'password',
    },
    async (email, password, done) => {
      const users = await User.findAll({
        attributes: ['id', 'email'],
        where: {
          '$logins.name$': 'local',
          '$logins.key$': email,
          '$claims.type$': 'local',
        },
        include: [
          {
            attributes: ['name', 'key'],
            model: UserLogin,
            as: 'logins',
            required: true,
          },
          {
            attributes: ['type', 'value'],
            model: UserClaim,
            as: 'claims',
            required: true,
          },
        ],
      });
      if (!users[0]) {
        return done(null, false);
      }
      if (!bcrypt.compareSync(password, users[0].claims[0].value))
        return done(null, false);
      return done(null, users[0]);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((err, user) => {
    done(err, user);
  });
});

export default passport;
