'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var glob = require('glob');

module.exports = yeoman.generators.Base.extend({

  prompting: function () {
    this.log(yosay(
      'Welcome to the primo ' + chalk.green('React Starter Kit') + ' generator!'
    ));
  },

  writing: function () {
    var done = this.async();
    glob('**/*', { cwd: this.sourceRoot(), dot: true }, function (err, files) {
      if (err) {
        this.log('Error:', err.message);
        return done();
      }
      files.forEach(function (file) {
        var dest = file;
        if (file === 'npmignore') {
          dest = '.' + file;
        }
        this.fs.copy(
          this.templatePath(file),
          this.destinationPath(dest)
        );
      }, this);
      done();
    }.bind(this));
  },

  install: function () {
    this.npmInstall();
  }

});
