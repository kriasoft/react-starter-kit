/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */

import Promise from 'bluebird';
import passport from 'passport';
import expressJwt from 'express-jwt';
import { auth } from '../../config';

import * as passportFacebook from './facebook';
import * as passportGoogle from './google';
import * as passportGithub from './github';
import * as passportTwitter from './twitter';
import * as passportCustom from '../../custom/passport';

const fs = require('fs');

const pathCustom = '../../custom/passport/';
let loadedPassportStrategies;

function detectCustomPassportStrategy(item) {
  const customPath = `${pathCustom}${item}.js`;

  return new Promise((fulfilledHandler) => {
    fs.exists(customPath, (existsCustom) => {
      fulfilledHandler(existsCustom);
    });
  });
}

function addLoadedStrategy(strategyName) {
  loadedPassportStrategies.push(strategyName);
}

export function getLoadedStrategies() {
  return loadedPassportStrategies;
}

export function strategyIsLoaded(strategyName) {
  return strategyName in loadedPassportStrategies;
}

export function passportInit(app) {
  app.use(expressJwt({
    secret: auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token,
  }));

  app.use(passport.initialize());
  loadedPassportStrategies = [];

  if (process.env.NODE_ENV !== 'production') {
    app.enable('trust proxy');
  }

  const usedAuth = auth.authConfig.usedAuth.split(',');

  const PASSPORT_STRATEGIES = {
    facebook: passportFacebook,
    google: passportGoogle,
    github: passportGithub,
    twitter: passportTwitter,
  };


  Promise.map(usedAuth, (passportStrategyName) => {
    // check wanted strategy is a core
    if (passportStrategyName in PASSPORT_STRATEGIES === false) {
      return;
    }

    // detect custom overwrite
    // use callback if not exists
    detectCustomPassportStrategy(passportStrategyName)
      .then((customExists) => {
        if (customExists) {
          return null;
        }

        PASSPORT_STRATEGIES[passportStrategyName].passportInit(passport);
        PASSPORT_STRATEGIES[passportStrategyName].expressInit(app);
        addLoadedStrategy(passportStrategyName);
        console.log('PassportStrategyLoader: load', passportStrategyName);// eslint-disable-line no-console
        return null;
      });
  })
  .then(() => {
    // load custom if exists
    passportCustom.passportInit(passport);
    passportCustom.expressInit(app);
    console.log('PassportStrategyLoader: load', 'custom');// eslint-disable-line no-console
    return null;
  });
}
