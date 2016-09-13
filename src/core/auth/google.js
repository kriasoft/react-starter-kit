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

const googleAuth = app => {
  app.get('/login/google',
    passport.authenticate('google', { scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read',
    ], session: false })
  );

  app.get('/login/google/return',
    passport.authenticate('google', {
      failureRedirect: '/login',
      session: false,
    }),
    (req, res) => {
      const user = {
        id: req.user.id,
        email: req.user.email,
      };
      // console.log('user:', req.user, user);
      const expiresIn = 60 * 60 * 24 * 180; // 180 days
      const token = jwt.sign(user, auth.jwt.secret, { expiresIn });
      res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
      res.redirect('/');
    }
  );
};

export default googleAuth;

