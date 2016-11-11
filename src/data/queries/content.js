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
import fm from 'front-matter';
import MarkdownIt from 'markdown-it';

import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import ContentType from '../types/ContentType';

const md = new MarkdownIt();

// A folder with Markdown/HTML content pages
const CONTENT_DIR = join(__dirname, './content');

// Extract 'front matter' metadata and generate HTML
const parseContent = (path, fileContent, extension) => {
  const fmContent = fm(fileContent);
  let htmlContent;
  switch (extension) {
    case '.md':
      htmlContent = md.render(fmContent.body);
      break;
    case '.html':
      htmlContent = fmContent.body;
      break;
    default:
      return null;
  }
  return Object.assign({ path, content: htmlContent }, fmContent.attributes);
};

const readFile = Promise.promisify(fs.readFile);
const fileExists = filename => new Promise(resolve => {
  fs.exists(filename, resolve);
});

async function resolveExtension(path, locale, extension) {
  let fileNameBase = join(CONTENT_DIR, `${path === '/' ? '/index' : path}`);
  let ext = extension;
  if (!ext.startsWith('.')) {
    ext = `.${extension}`;
  }
  // detect locale-specific files
  // e.g. about.en.md
  let fileName = `${fileNameBase}.${locale}${ext}`;

  if (!(await fileExists(fileName))) {
    // e.g. about.md
    fileName = fileNameBase + ext;
  }

  if (!(await fileExists(fileName))) {
    fileNameBase = join(CONTENT_DIR, `${path}/${locale}`);
    // e.g. about/en.md
    fileName = fileNameBase + ext;
  }

  if (!(await fileExists(fileName))) {
    fileNameBase = join(CONTENT_DIR, `${path}/index`);
    // e.g. about/index.md
    fileName = fileNameBase + ext;
  }

  if (!(await fileExists(fileName))) {
    return { success: false };
  }

  return { success: true, fileName };
}

async function resolveFileName(path, locale) {
  const extensions = ['.md', '.html'];

  for (let i = 0; i < extensions.length; i += 1) {
    const extension = extensions[i];
    const maybeFileName = await resolveExtension(path, locale, extension);
    if (maybeFileName.success) {
      return { success: true, fileName: maybeFileName.fileName, extension };
    }
  }

  return { success: false, fileName: null, extension: null };
}

const content = {
  type: ContentType,
  args: {
    path: { type: new NonNull(StringType) },
    locale: { type: StringType },
  },
  async resolve({ request }, { path, locale }) {
    const { success, fileName, extension } = await resolveFileName(path, locale);
    if (!success) {
      return null;
    }

    const source = await readFile(fileName, { encoding: 'utf8' });
    return parseContent(path, source, extension);
  },
};

export default content;
