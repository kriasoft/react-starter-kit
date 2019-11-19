import assert from 'assert';
import path from 'path';
import { readFile, writeFile } from '../lib/fs';
import {
  killApp,
  waitApp,
  timeout,
  openBrowser,
  getUrl,
} from '../lib/test-fns';
import { spawn } from '../lib/cp';

const startApp = (cwd, port) =>
  spawn('yarn', ['start', '--silent'], {
    cwd,
    env: { PORT: String(port) },
  });

describe('yarn start', () => {
  const port = 3033;
  const cwd = path.resolve(__dirname, '../..');
  const app = startApp(cwd, port);
  let browser;
  let page;

  beforeAll(async () => {
    await waitApp(port);
    [browser, page] = await openBrowser(port);
  }, 60 * 1000);

  afterAll(async () => {
    await browser.close();
    await killApp(app);
  });

  it('launches the App', async () => {
    const expect = 'React.js News';
    const actual = await page.$$eval('h1', es => es[1].textContent);
    assert.deepStrictEqual(actual, expect);
  });

  it(
    'does Hot Module Reload',
    async () => {
      const sourcePath = 'src/routes/home/Home.js';
      const sourceAbsPath = path.join(cwd, sourcePath);
      const expect = 'HMR!!!';
      const defaultH1 = '<h1>React.js News</h1>';
      const modifiedH1 = `<h1>${expect}</h1>`;

      const modifySource = async () => {
        const content = await readFile(sourceAbsPath);
        if (!content.includes(defaultH1))
          throw new Error('This test cannot run. Check "defaultH1".');
        await writeFile(sourceAbsPath, content.replace(defaultH1, modifiedH1));
      };

      const resetSource = async () => {
        const content = await readFile(sourceAbsPath);
        await writeFile(sourceAbsPath, content.replace(modifiedH1, defaultH1));
      };

      await modifySource();
      await timeout(3 * 1000);
      const actual = await page.$$eval('h1', es => es[1].textContent);
      assert.deepStrictEqual(actual, expect);

      await resetSource();
    },
    30 * 1000,
  );

  it('starts GraphiQL', async () => {
    const expect = 'GraphiQL';
    await page.goto(`${getUrl(port)}/graphql`);
    const actual = await page.$eval('.title', e => e.textContent);
    assert.deepStrictEqual(actual, expect);
  });
});
