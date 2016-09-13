/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import passport from 'passport';
import jwt from 'jsonwebtoken';
import { auth } from '../../config';

const facebookAuth = app => {
  app.get('/login/facebook',
    passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false })
  );

  app.get('/login/facebook/return',
    passport.authenticate('facebook', {
      failureRedirect: '/login',
      session: false }),
    (req, res) => {
      const expiresIn = 60 * 60 * 24 * 180; // 180 days
      const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
      res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
      res.redirect('/');
    }
  );
};

export default facebookAuth;