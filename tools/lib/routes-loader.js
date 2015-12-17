import glob from 'glob';
import { join, basename, extname } from 'path';

export default function(source) {
  this.cacheable();
  const target = this.target;
  const callback = this.async();

  glob('./*',{cwd: join(__dirname, '../../src/content')}, (err, files) => {
    if (err) {
      return callback(err);
    }
    const lines = files.map(file => {
      let path = '/' + basename(file, extname(file));

      if (path === '/index') {
        path = '/'
      }

      return `  '${path}': () => new Promise(resolve => require(['./content/${file}'], resolve)),`;
    });

    if (lines.length) {
      return callback(null, source.replace(' routes = {', ' routes = {\n' + lines.join('')));
    }
    return callback(new Error('Cannot find any routes.'));
  })
}
