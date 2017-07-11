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
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import IntlMessageType from '../types/IntlMessageType';
import { locales } from '../../config';

// A folder with messages
// In development, source dir will be used
const MESSAGES_DIR = process.env.MESSAGES_DIR || join(__dirname, './messages');

const readFile = Promise.promisify(fs.readFile);

const intl = {
  type: new List(IntlMessageType),
  args: {
    locale: { type: new NonNull(StringType) },
  },
  async resolve({ request }, { locale }) {
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
};

export default intl;
