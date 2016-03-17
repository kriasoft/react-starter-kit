## Generate new component

You can generate new component from console via command:

```shell
$ npm run generate MyComponent
```
Or with a namespace

```shell
$ npm run generate Namespace/MyComponent
```

For example:

```shell
$ npm run generate todos/TodoItem
$ npm run generate todos/TodoList
$ npm run generate pages/HomePage
```

This command create dir 'Namespace/MyComponent' in 'src/component', and write files from component template (see 'tools/templates/component').

Basic structure:

```
MyComponent
│   ├── /MyComponent.js            # React components
│   ├── /MyComponent.scss          # styles for component
│   ├── /package.json              # package file
```
