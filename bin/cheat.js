#!/usr/bin/env node

var sg              = require('sgsg');
var _               = sg._;
var ARGV            = sg.ARGV();
var sh              = sg.extlibs.shelljs;
var path            = require('path');

sg.requireShellJsGlobal();

var   templatesDir    = path.join(sg.argvGet(ARGV, 'templ-dir,template,templ,t') || __dirname, '..', 'templates');
var   startDir        = process.cwd();
const templates       = directory(templatesDir);

var   fns   = {};
var   mans  = {};

var main = function() {

  if (ARGV.v || ARGV.verbose) {
    sh.config.verbose = true;
  }

  const it      = ARGV.it   || ARGV.args.shift();

  if (it && fns[it]) {
    return fns[it](ARGV);

  } else if (it) {
    if (it === 'react')              { return fns.react(); }
    else if (it === 'react-native')  { return fns.react_native(); }
    else if (it === 'sg')            { return fns.sg(ARGV); }

    else {
      return sg.die("Cheat: unknown command: "+it);
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

const cpAndMatchExt = function(src, dest_) {
  var   dest    = dest_;
  const srcExt  = path.extname(src);

  if (path.extname(dest) !== srcExt) {
    dest += srcExt;
  }

  return cp(src, dest);
};

fns.man = function(argv) {
  const entry     = argv.args.shift();

  const readme = ls(templates(entry+'-man', 'readme'));
  if (_.isArray(readme)) {
    console.log(cat(readme[0]));
  }
};

_.each(ls(templates()), tDir => {
  if (test('-d', templates(tDir))) {
    fns[tDir] = function(argv) {
      const filename  = sg.argvGet(argv, 'filename,file,f') || ARGV.args.shift();
      const srcDir    = directory(templates(tDir));
      const destDir   = directory(startDir, '.')(path.dirname(filename));
      const destFile  = directory(startDir, '.')(filename);

      if (!filename)  { return sg.die('Need --filename= (the new sg-skeleton file will be ./filename.js)'); }

      console.log(filename, destDir);

      mkdir('-p', destDir);
      cpAndMatchExt(srcDir('_file.js'), destFile);
      console.log(srcDir('_file.js'), destFile);
    }
  }
});

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

function directory(root_ /*, root2, ...*/) {
  var root;

  if (arguments.length === 1) {
    if (_.isArray(root_))           { root = root_.splice(); }
    else                            { root = [root_]; }
  } else                            { root = _.toArray(arguments); }

  return function() {
    const pathArgs = [...root, ...arguments];
    return path.join(...pathArgs);
  };
};

