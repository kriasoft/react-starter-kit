/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import gaze from 'gaze';
import Promise from 'bluebird';
import fs from './lib/fs';
import pkg from '../package.json';
import { transform } from 'babel-core';
import { locales } from '../src/config';

const GLOB_PATTERN = 'src/**/*.{js,jsx}';
const fileToMessages = {};
let messages = {};

async function writeMessages(fileName, msgs) {
  await fs.writeFile(fileName, `${JSON.stringify(msgs, null, 2)}\n`);
}

// merge messages to source files
async function mergeToFile(locale, toBuild) {
  const fileName = `src/messages/${locale}.json`;
  const originalMessages = {};
  try {
    const oldFile = await fs.readFile(fileName);

    let oldJson;
    try {
      oldJson = JSON.parse(oldFile);
    } catch (err) {
      throw new Error(`Error parsing messages JSON in file ${fileName}`);
    }

    oldJson.forEach(message => {
      originalMessages[message.id] = message;
      delete originalMessages[message.id].files;
    });
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  Object.keys(messages).forEach(id => {
    const newMsg = messages[id];
    originalMessages[id] = originalMessages[id] || { id };
    const msg = originalMessages[id];
    msg.description = newMsg.description || msg.description;
    msg.defaultMessage = newMsg.defaultMessage || msg.defaultMessage;
    msg.message = msg.message || '';
    msg.files = newMsg.files;
  });

  const result = Object.keys(originalMessages)
    .map(key => originalMessages[key])
    .filter(msg => msg.files || msg.message);

  await writeMessages(fileName, result);

  console.log(`Messages updated: ${fileName}`);

  if (toBuild && locale !== '_default') {
    const buildFileName = `build/messages/${locale}.json`;
    try {
      await writeMessages(buildFileName, result);
      console.log(`Build messages updated: ${buildFileName}`);
    } catch (err) {
      console.error(`Failed to update ${buildFileName}`);
    }
  }
}

// call everytime before updating file!
function mergeMessages() {
  messages = {};
  Object.keys(fileToMessages).forEach(fileName => {
    fileToMessages[fileName].forEach(newMsg => {
      const message = messages[newMsg.id] || {};
      messages[newMsg.id] = {
        description: newMsg.description || message.description,
        defaultMessage: newMsg.defaultMessage || message.defaultMessage,
        message: newMsg.message || message.message || '',
        files: message.files ? [...message.files, fileName] : [fileName],
      };
    });
  });
}

async function updateMessages(toBuild) {
  mergeMessages();
  await Promise.all(
    ['_default', ...locales].map(locale => mergeToFile(locale, toBuild))
  );
}

/**
 * Extract react-intl messages and write it to src/messages/_default.json
 * Also extends known localizations
 */
async function extractMessages({ watch } = {}) {
  const compare = (a, b) => {
    if (a === b) {
      return 0;
    }

    return a < b ? -1 : 1;
  };

  const compareMessages = (a, b) => compare(a.id, b.id);

  const processFile = async (fileName) => {
    try {
      const code = await fs.readFile(fileName);
      const result = transform(code, {
        presets: pkg.babel.presets,
        plugins: ['react-intl'],
      }).metadata['react-intl'];
      if (result.messages && result.messages.length) {
        fileToMessages[fileName] = result.messages.sort(compareMessages);
      } else {
        delete fileToMessages[fileName];
      }
    } catch (err) {
      console.error(`extractMessages: In ${fileName}:\n`, err.codeFrame || err);
    }
  };

  const files = await fs.glob(GLOB_PATTERN);

  await Promise.all(files.map(processFile));
  await updateMessages(false);

  if (watch) {
    const watcher = await new Promise((resolve, reject) => {
      gaze(GLOB_PATTERN, (err, val) => err ? reject(err) : resolve(val));
    });
    watcher.on('changed', async (file) => {
      const relPath = file.substr(path.join(__dirname, '../').length);
      await processFile(relPath);
      await updateMessages(true);
    });
  }
}

export default extractMessages;
