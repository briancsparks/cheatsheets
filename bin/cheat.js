#!/usr/bin/env node

var sg              = require('sgsg');
var _               = sg._;
var ARGV            = sg.ARGV();
var path            = require('path');

sg.requireShellJsGlobal();

var templatesDir    = path.join(ARGV.templ_dir || __dirname, '..', 'templates');
var startDir        = process.cwd();

var fns   = {};
var mans  = {};

var main = function() {

  if (ARGV.it) {
    if (ARGV.it === 'react') {
      return fns.react();
    } else {
      return sg.die("Cheat: unknown command: "+ARGV.it);
    }
  } else if (ARGV.man) {
    if (ARGV.man === 'react') {
      return mans.react();
    } else {
      return sg.die("Cheat: unknown man entry: "+ARGV.man);
    }
  } else {
    return sg.die("Usage: cheat --it=name");
  }

};

var mkAndCpTemplDir = function(templName, srcRelDir, destRelDir) {
  var srcDir    = path.join(templatesDir, templName, srcRelDir);
  var destDir   = path.join(startDir, destRelDir);

  mkdir('-p', destDir);

  _.each(ls(srcDir), function(file) {
    cp('-f', path.join(srcDir, file), destDir);
  });
};

fns.react = function() {
  //console.log(ls(path.join(templatesDir, 'react', 'actions')));

  console.log("BEGIN--The following 'is a directory...' messages are ok.");
  mkAndCpTemplDir('react', '.',           '.');
  console.log("END--The following 'is a directory...' messages are ok.");

  mkAndCpTemplDir('react', 'actions',     'actions');
  mkAndCpTemplDir('react', 'components',  'components');
  mkAndCpTemplDir('react', 'containers',  'containers');
  mkAndCpTemplDir('react', 'reducers',    'reducers');
};

mans.react = function() {
  var readme = path.join(templatesDir, 'react-man', 'readme');
  console.log(cat(readme));
};


main();

