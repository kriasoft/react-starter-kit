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

import passport from 'passport';
import expressJwt from 'express-jwt';
import { auth } from '../../config';

import * as passportFacebook from './facebook';
import * as passportCustom from '../../custom/passport';

const fs = require('fs');

const pathCustom = '../../custom/passport/';

let loadedPassportStrategies = [];

function detectCustomPassportStrategy(item, callbackNotFound) {
  const customPath = `${pathCustom}${item}.js`;

  fs.exists(customPath, (existsCustom) => {
    if (existsCustom) {
      return;
    }

    callbackNotFound();
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

export default function passportInit(app) {
  app.use(expressJwt({
    secret: auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token,
  }));

  app.use(passport.initialize());

  if (process.env.NODE_ENV !== 'production') {
    app.enable('trust proxy');
  }

  const usedAuth = auth.authConfig.usedAuth.split(',');

  const PASSPORT_STRATEGIES = {
    facebook: passportFacebook,
    // google: passportGoogle,
    // github: passportGithub,
  };

  usedAuth.forEach((passportStrategyName) => {
    if (passportStrategyName in PASSPORT_STRATEGIES) {
      // detect custom overwrite
      // use callback if not exists
      detectCustomPassportStrategy(passportStrategyName, () => {
        PASSPORT_STRATEGIES[passportStrategyName].passportInit(passport);
        PASSPORT_STRATEGIES[passportStrategyName].expressInit(app);
        addLoadedStrategy(passportStrategyName);
      });
    }
  });

  // load custom if exists
  passportCustom.passportInit(passport);
  passportCustom.expressInit(app);
}
