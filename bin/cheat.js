#!/usr/bin/env node

var sg              = require('sgsg');
var _               = sg._;
var ARGV            = sg.ARGV();
var sh              = sg.extlibs.shelljs;
var path            = require('path');

sg.requireShellJsGlobal();

var templatesDir    = path.join(ARGV.templ_dir || __dirname, '..', 'templates');
var startDir        = process.cwd();

var fns   = {};
var mans  = {};

var main = function() {

  if (ARGV.v || ARGV.verbose) {
    sh.config.verbose = true;
  }

  if (ARGV.it) {
    if (ARGV.it === 'react')              { return fns.react(); }
    else if (ARGV.it === 'react-native')  { return fns.react_native(); }

    else {
      return sg.die("Cheat: unknown command: "+ARGV.it);
    }

  } else if (ARGV.man) {
    if (ARGV.man === 'react')             { return mans.react(); }
    else {
      return sg.die("Cheat: unknown man entry: "+ARGV.man);
    }
  } else {
    return sg.die("Usage: cheat --it=name");
  }

};

var cpRTemplDir = function(templName, destRelDir) {
  var src       = path.join(templatesDir, templName, '*');
  var destDir   = path.join(startDir, destRelDir, '');

  mkdir('-p', destDir);
  cp('-Rf', src, destDir);
};

fns.react = function() {
  cpRTemplDir('react', '.');
};

mans.react = function() {
  var readme = path.join(templatesDir, 'react-man', 'readme');
  console.log(cat(readme));
};

fns.react_native = function() {
  cpRTemplDir('react', '.');
  cpRTemplDir('react-native', '.');
};


main();

