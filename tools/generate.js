
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';

/**
 * All files in dir
 */
const fileList = function getFileList(dir) {
  return fs.readdirSync(dir).reduce((list, file) => {
    const name = path.join(dir, file);
    const isDir = fs.statSync(name).isDirectory();
    if (isDir) return list;
    list.push(file);
    return list;
  }, []);
};

/**
 * Create component folder in src/components
 */
async function generate() {
  let componentPath = process.argv[3] || '';
  if (componentPath.length === 0) {
    console.error('Error: Specify component name, for example: npm run generate todo');
    return;
  }

  const paths = componentPath.split('/');
  let componentName = paths[paths.length - 1];

  // Capitalize component name
  componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
  paths[paths.length - 1] = componentName;

  componentPath = path.join('src/components', paths.join('/'));
  const variablePath = path.relative(componentPath, 'src/components/variables.scss');

  fs.exists(componentPath, (isDirExist) => {
    if (isDirExist) {
      console.error(`Error: Component "${componentPath}" already exist.`,
        'Choose another component name');
      return;
    }

    mkdirp(componentPath, {}, () => {
      const templatePath = path.join('tools', 'templates', 'component');

      // foreach template
      fileList(templatePath).forEach((fileName) => {
        fs.readFile(path.join(templatePath, fileName), 'utf-8', (err, data) => {
          const newFileName = fileName.replace(/\.js\.template/, '.js')
            .replace('Component', componentName);
          fs.writeFile(
            path.join(componentPath, newFileName),
            data
              .replace(/##Component##/g, componentName)
              .replace(/##VariablePath##/g, variablePath)
          );
        });
      });
    });
  });
}

export default generate;
