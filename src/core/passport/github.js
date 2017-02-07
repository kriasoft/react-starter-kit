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
import jwt from 'jsonwebtoken';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User, UserLogin, UserClaim, UserProfile } from '../../data/models';
import { auth as config, host } from '../../config';

const loginName = 'github';
const claimType = 'urn:github:access_token';
const routeLogin = '/github';
const routeLoginCallback = '/github/callback';
const createUserModel = {
  include: [
    { model: UserLogin, as: 'logins' },
    { model: UserClaim, as: 'claims' },
    { model: UserProfile, as: 'profile' },
  ],
};

function buildAvatarUrl(profile) {
  return `https://avatars0.githubusercontent.com/u/${profile.id}?v=3`;
}

function getCreateUserOption(req, profile, accessToken) {
  /* eslint-disable no-underscore-dangle */
  const options = {
    email: profile._json.email,
    logins: [
      { name: loginName, key: profile.id },
    ],
    claims: [
    ],
    profile: {
      displayName: profile.displayName,
      gender: profile._json.gender,
      picture: buildAvatarUrl(profile),
    },
  };

  if (req.user && req.user.id) {
    options.id = req.user.id;
    options.claims.push({ type: claimType, value: profile.id });
  } else {
    options.emailConfirmed = true;
    options.claims.push({ type: claimType, value: accessToken });
  }
  return options;
  /* eslint-enable no-underscore-dangle */
}

async function handleCreateUser(profile, done, accessToken, req) {
  const user = await User.create(
    getCreateUserOption(req, profile, accessToken),
    createUserModel,
  );

  done(null, {
    id: user.id,
    email: user.email,
  });
}

async function handleRequestHasUserObject(profile, done, accessToken, req) {
  const userLogin = await UserLogin.findOne({
    attributes: ['name', 'key'],
    where: { name: loginName, key: profile.id },
  });
  if (userLogin) {
    // There is already a github account that belongs to you.
    // Sign in with that account or delete it, then link it with your current account.
    done();
    return;
  }

  handleCreateUser(profile, done, accessToken, req);
}

async function handleSearchUserByEmail(profile, done) {
  // eslint-disable-next-line no-underscore-dangle
  const user = await User.findOne({ where: { email: profile._json.email } });
  if (user) {
    // There is already an account using this email address. Sign in to
    // that account and link it with github manually from Account Settings.
    done(null);
    return true;
  }
  return false;
}

async function handleSearchUserByProfileId(profile, done) {
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
    done(null, users[0]);
    return true;
  }
  return false;
}

function passportInit(passportLib: passport) {
  passportLib.use(new GitHubStrategy({
    clientID: config.github.id,
    clientSecret: config.github.secret,
    callbackURL: `http://${host}/login${routeLoginCallback}`,
    profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, profile, done) => {
    /* eslint-disable no-underscore-dangle */

    if (req.user) {
      handleRequestHasUserObject(profile, done, accessToken, req);
      return;
    }

    /* eslint no-unused-expressions: ["error", { "allowShortCircuit": true }]*/
    handleSearchUserByProfileId(profile, done) ||
    handleSearchUserByEmail(profile, done) ||
    handleCreateUser(profile, done, accessToken, req);
  },
));
}

function expressInit(app) {
  app.get(routeLogin,
    passport.authenticate('github', { scope: ['user:email'], session: false }),
  );

  app.get(routeLoginCallback,
    passport.authenticate('github', { failureRedirect: '/login', session: false }),
    (req, res) => {
      const expiresIn = 60 * 60 * 24 * 180; // 180 days
      const token = jwt.sign(req.user, config.jwt.secret, { expiresIn });
      res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
      res.redirect('/');
    },
  );
}

export { passportInit, expressInit };
