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

/* eslint-disable no-unused-vars */
import passport from 'passport';
import jwt from 'jsonwebtoken';
// import { Strategy as TwitterStrategy } from 'passport-twitter';
import { User, UserLogin, UserClaim, UserProfile } from '../../data/models';
import { auth as config } from '../../config';
/* eslint-enable no-unused-vars */

// eslint-disable-next-line no-unused-vars
function passportInit(passportLib: passport) {
  // eslint-disable-next-line no-console
  console.log('twitter passport init need logic');
}

// eslint-disable-next-line no-unused-vars
function expressInit(app) {
  // eslint-disable-next-line no-console
  console.log('twitter express init need logic');
}

export { passportInit, expressInit };
