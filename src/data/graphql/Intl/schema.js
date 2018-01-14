/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import fs from 'fs';
import { join } from 'path';
import Promise from 'bluebird';
import { locales } from '../../../config';

export const schema = [
  `
  type IntlMessage {
    id: String!
    defaultMessage: String!
    message: String
    description: String
    files: [String]
  }
`,
];

export const queries = [
  `
  # Supported locales: "${locales.join('", "')}"
  intl(locale: String!): [IntlMessage]
`,
];

const MESSAGES_DIR = process.env.MESSAGES_DIR || join(__dirname, './messages');

const readFile = Promise.promisify(fs.readFile);

export const resolvers = {
  RootQuery: {
    async intl(parent, { locale }) {
      if (!locales.includes(locale)) {
        throw new Error(`Locale '${locale}' not supported`);
      }

      let localeData;
      try {
        localeData = await readFile(join(MESSAGES_DIR, `${locale}.json`));
      } catch (err) {
        if (err.code === 'ENOENT') {
          throw new Error(`Locale '${locale}' not found`);
        }
      }

      return JSON.parse(localeData);
    },
  },
};
