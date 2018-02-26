import express from 'express';
import fs from 'fs';
import { join } from 'path';
import Promise from 'bluebird';

// configure routes
const router = express.Router();

// A folder with JSON/Markdown/HTML content pages
const CONTENT_DIR = join(__dirname, `./content/pages`);

const readFile = Promise.promisify(fs.readFile);
const fileExists = async filename => {
  try {
    await fs.accessSync(filename);
    return true;
  } catch (e) {
    return false;
  }
};

const resolveExtension = async (path, extension) => {
  let fileNameBase = join(CONTENT_DIR, `${path === `/` ? `/index` : path}`);
  let ext = extension;
  let fileName = fileNameBase + ext;

  if (!ext.startsWith(`.`)) {
    ext = `.${extension}`;
  }

  if (!await fileExists(fileName)) {
    fileNameBase = join(CONTENT_DIR, `${path}/index`);
    fileName = fileNameBase + ext;
  }

  if (!await fileExists(fileName)) {
    return { success: false };
  }

  return { success: true, fileName };
};

const resolveFileName = async path => {
  const extensions = ['.json', '.md', '.html'];

  const fileSuccess = await Promise.all(
    extensions.map(async extension => {
      const maybeFileName = await resolveExtension(path, extension);
      if (maybeFileName.success) {
        return { success: true, fileName: maybeFileName.fileName, extension };
      }

      return {};
    }),
  );

  for (let i = 0; i < fileSuccess.length; i += 1) {
    const file = fileSuccess[i];
    if (file.success) {
      return file;
    }
  }

  return { success: false, fileName: null, extension: null };
};

router.route(`/content`).post(async (req, res) => {
  const { path } = req.body;
  const { success, fileName, extension } = await resolveFileName(path);

  if (!success) {
    return res.sendStatus(404);
  }

  const source = await readFile(fileName, { encoding: `utf8` });

  return res.json({
    success,
    message: `Content fetched`,
    path,
    source,
    extension,
  });
});

export default router;
