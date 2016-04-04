/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fs from './lib/fs';

const type = process.argv[3];
const name = process.argv[4];
const stateless = process.argv.includes('--stateless');

function lowercaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

const headerTemplate = [
  '/**',
  ' * React Starter Kit (https://www.reactstarterkit.com/)',
  ' *',
  ' * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.',
  ' *',
  ' * This source code is licensed under the MIT license found in the',
  ' * LICENSE.txt file in the root directory of this source tree.',
  ' */',
  '',
];

const componentTemplate = [
  ...headerTemplate,
  "import React, { Component, PropTypes } from 'react';",
  "import withStyles from 'isomorphic-style-loader/lib/withStyles';",
  `import s from './${name}.scss';`,
  '',
  `class ${name} extends Component {`,
  '',
  '  static propTypes = {};',
  '',
  '  static contextTypes = {};',
  '',
  '  componentWillMount() {}',
  '',
  '  render() {',
  '    return (<div className={s.root}></div>);',
  '  }',
  '',
  '}',
  '',
  `export default withStyles(${name}, s);`,
  '',
];

const componentStatelessTemplate = [
  ...headerTemplate,
  "import React from 'react';",
  "import withStyles from 'isomorphic-style-loader/lib/withStyles';",
  `import s from './${name}.scss';`,
  '',
  `function ${name}() {`,
  '  return (<div className={s.root}></div>);',
  '}',
  '',
  `export default withStyles(${name}, s);`,
  '',
];

const componentStyleTemplate = [
  ...headerTemplate,
  "@import '../variables.scss';",
  '',
  '.root {}',
  '',
];

const componentPackageTemplate = [
  '{',
  `  "name": "${name}",`,
  '  "version": "0.0.0",',
  '  "private": true,',
  `  "main": "./${name}.js"`,
  '}',
];

const routeName = lowercaseFirstLetter(name);

const routeStyleTemplate = [
  ...headerTemplate,
  "@import '../../components/variables.scss';",
  '',
  '.root {}',
  '',
];

const routeIndexTemplate = [
  ...headerTemplate,
  "import React from 'react';",
  `import ${name} from './${name}';`,
  '',
  `export const path = '/${routeName}';`,
  'export const action = async (state) => {',
  `  const title = '${name}';`,
  '  state.context.onSetTitle(title);',
  `  return <${name} title={title} />;`,
  '};',
  '',
];

const templates = {
  component: {
    path: './src/components',
    files: [
      {
        name: `${name}.js`,
        template: {
          default: componentTemplate.join('\n'),
          stateless: componentStatelessTemplate.join('\n'),
        },
      },
      {
        name: `${name}.scss`,
        template: componentStyleTemplate.join('\n'),
      },
      {
        name: 'package.json',
        template: componentPackageTemplate.join('\n'),
      },
    ],
  },
  route: {
    path: './src/routes',
    files: [
      {
        name: `${name}.js`,
        template: {
          default: componentTemplate.join('\n'),
          stateless: componentStatelessTemplate.join('\n'),
        },
      },
      {
        name: `${name}.scss`,
        template: routeStyleTemplate.join('\n'),
      },
      {
        name: 'index.js',
        template: routeIndexTemplate.join('\n'),
      },
    ],
  },
};

async function generate() {
  const template = templates[type];
  const pathName = template.path + ((type === 'component') ? `/${name}` : `/${routeName}`);

  await fs.makeDir(pathName);
  template.files.forEach(async (file) => {
    const content = (typeof file.template === 'string')
      ? file.template
      : file.template[(!stateless) ? 'default' : 'stateless'];
    await fs.writeFile(`${pathName}/${file.name}`, content);
  });
}

export default generate;
