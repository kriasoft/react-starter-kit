## How to do Basic Operations with the React Starter Kit

 * [Step 1: Start Up and Explore](#step-1-start-and-explore)
 * [Step 2: Add a "Hello, World" page](#step-2-hello-world)

### Step 1: Start and Explore

Welcome!  You should start by reading the [main README](/README.md) file.  For 
the extra busy, here's the summary:

#### clone the repo


```shell
$ git clone -o react-starter-kit -b master --single-branch \
      https://github.com/kriasoft/react-starter-kit.git MyApp
$ cd MyApp
```

#### build and run


```shell
$ npm install                   # Install Node.js components listed in ./package.json
$ npm run build                 # or, `npm run build -- --release`
$ npm start                     # start development server, or, `npm start -- --release`
```

and maybe

```shell
$ npm test                      # run Jest tests on all __tests__/*-test.js
$ npm run deploy                # or, `npm run deploy -- --production`
```

The development server should launch on [port 3000](http://localhost:3000) and the 
Browsersync monitor on [port 3001](http://localhost:3001).  Source files will be 
watched for changes and will automatically rebuild on changes.

### Step 2:  Add a "Hello, World" page

#### Add a link to home page

Edit the file `./src/content/index.jade` to add a new subject section.  Right before the
line `h3 Runtime Components` add these lines:

```jade
  h3 Things I Added
    dl
      dt <a href="/hello">Hello World</a>
      dd A page to print "Hello World"
```

You should see the new link on the home page ([port 3000](http://localhost:3000)).  The changes to
the file `./src/content/index.jade` triggers the rebuilding of `./build/content/index.jade` if the
developer server is running (`npm start`).

#### Create the new Hello World Page

Create the file `./src/content/hello.jade`:

```jade
---
title: Hello
component: ContentPage
---
p.
  Hello, World!
```

#### Bask in glory

This small change   is the first step. 
  
  * Changes are generally made to the `./src` directory and built into the `./build` directory.  
    Sometimes building is only copying the file to the new location.
  * The development server watches the `./src` directory for changes.  Messages like
    `[BS] File changed: build/content/index.jade` will appear as output from `npm start`.
  * This example uses [Jade:  the Node templating engine](http://jade-lang.com).  Jade is a terse 
    template language supporting dynamic code and reusability to generate HTML.
  * The `ContentPage` mentioned in the Jade template is the package `./src/components/ContentPage/`.
  
  