#!/usr/bin/env node

var sg              = require('sgsg');
var _               = sg._;
var ARGV            = sg.ARGV();
var sh              = sg.extlibs.shelljs;
var path            = require('path');

sg.requireShellJsGlobal();

var templatesDir    = path.join(sg.argvGet(ARGV, 'templ-dir,template,templ,t') || __dirname, '..', 'templates');
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
    else if (ARGV.it === 'sg')            { return fns.sg(ARGV); }

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

const directory = function(root_ /*, root2, ...*/) {
  var root;

  if (arguments.length === 1) {
    if (sg.isArray(root_))          { root = root_.splice(); }
    else                            { root = [root]; }
  } else                            { root = _.toArray(arguments); }

  return function() {
    const pathArgs = [...root, ...arguments];
    return path.join.apply(path, pathArgs);
  };
};

const cpAndMatchExt = function(src, dest_) {
  var   dest    = dest_;
  const srcExt  = path.extname(src);

  if (path.extname(dest) !== srcExt) {
    dest += srcExt;
  }

  return cp(src, dest);
};

fns.sg = function(argv) {
  const srcDir    = directory(templatesDir, 'sg');
  const destDir   = directory(startDir, '.');
  const filename  = sg.argvGet(argv, 'filename,file,f');

  if (!filename)  { return sg.die('Need --filename='); }

  mkdir('-p', destDir());
  cpAndMatchExt(srcDir('_file.js'), destDir(filename));
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

