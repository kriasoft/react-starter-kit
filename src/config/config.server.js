/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

export const database = {
  url: process.env.DATABASE_URL || 'postgresql://postgres@localhost:5433/myapp',
};

export const facebook = {
  id: process.env.FACEBOOK_ID || '',
  secret: process.env.FACEBOOK_SECRET || '',
};

export const google = {
  id: process.env.GOOGLE_ID || '',
  secret: process.env.GOOGLE_SECRET || '',
};

export const twitter = {
  key: process.env.TWITTER_KEY || '',
  secret: process.env.TWITTER_SECRET || '',
};

// Re-export client settings that might be required on the server.
export { port, host, googleAnalyticsId } from './config.client';
