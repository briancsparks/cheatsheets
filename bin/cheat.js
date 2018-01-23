#!/usr/bin/env node

var sg              = require('sgsg');
var _               = sg._;
var ARGV            = sg.ARGV();
var sh              = sg.extlibs.shelljs;
var path            = require('path');
var fs              = require('fs');

sg.requireShellJsGlobal();

var   templatesDir    = path.join(sg.argvGet(ARGV, 'templ-dir,template,templ,t') || __dirname, '..', 'templates');
var   snipsDir        = path.join(sg.argvGet(ARGV, 'snips-dir,snips,s') || __dirname, '..', 'snips');
var   startDir        = process.cwd();
const templates       = directory(templatesDir);
const snips           = directory(snipsDir);

var   fns   = {};
var   mans  = {};

const showUsage = function() {
  return sg.die(`Usage: cheat [${_.keys(fns)}] --filename=<rel-path>`);
};

var main = function() {

  if (ARGV.v || ARGV.verbose) {
    sh.config.verbose = true;
  }

  var   origIt  = ARGV.it   || ARGV.args.shift();
  var   it      = origIt;

  if (!it) {
    return showUsage();
  }

  if (it.startsWith('t-')) {
    it = it.substr(2);
  }

  if (it && fns[it]) {
    return fns[it](ARGV, origIt);

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
    return showUsage();
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

const cpAndMatchExt2 = function(src, dest_, argv) {
  var   dest    = dest_;
  const srcExt  = path.extname(src);

  if (path.extname(dest) !== srcExt) {
    dest += srcExt;
  }

  var stats     = fs.lstatSync(src);
  var mode      = +('0o'+stats.mode.toString(8).split("").reverse().join("").substr(0,3).split("").reverse().join(""));

  var contents  = ""+fs.readFileSync(src);
  _.each('foo,bar,baz,qux'.split(','), function(word) {
    if (argv[word]) {
      contents = contents.replace(new RegExp(word, 'gi'), argv[word]);
    }
  });

  fs.writeFileSync(dest, contents);
  fs.chmodSync(dest, mode);
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
    fns[tDir] = function(argv, it) {
      const filename  = sg.argvGet(argv, 'filename,file,f') || ARGV.args.shift();
      const srcDir    = directory(templates(tDir));
      const destDir   = directory(startDir, '.')(path.dirname(filename));
      const destFile  = directory(startDir, '.')(filename);

      if (!filename)  { return sg.die('Need --filename= (the new sg-skeleton file will be ./filename.js)'); }

      //console.log(filename, destDir);

      mkdir('-p', destDir);

      _.each(',.js,.cpp,.c,.java,.css,.less'.split(','), function(langExt) {

        const name = srcDir('_file'+langExt);
        if (!test('-f', name)) {
          return;
         }
        //console.log(name, destFile);

        if (it && it.startsWith('t-')) {
          //console.log('using ', it);
          cpAndMatchExt2(name, destFile, argv);
        } else {
          //console.log('using ', it);
          cpAndMatchExt(name, destFile);
        }
      });
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

fns['react-native'] = function() {
  cpRTemplDir('react', '.');
  cpRTemplDir('react-native', '.');
};

_.each(ls(snipsDir), snipName => {
  if (test('-f', snips(snipName))) {
    fns[path.basename(snips(snipName), '.js')] = function(argv, it) {
      const indent = ((ARGV.args.length > 0) && ARGV.args.shift()) || 2;

      process.stdout.write(cat_([snipsDir, snipName], indent));
    };
  }
});

main();

/**
 *  cats a file, indenting each line by padSize.
 *
 *  filename can be an array that will be joind.
 */
function cat_(filename, padSize) {
  if (_.isArray(filename)) {
    return cat_(path.join.apply(path, filename), padSize);
  }

  if (arguments.length === 1) { return cat(filename); }
  return indent(cat(filename), padSize);
}

function indent(str, num) {
  var padding = [ '',' ','  ',
    '   ',
    '    ',
    '     ',
    '      ',
    '       ',
    '        ',
  ];

  return str.split('\n').map(function(line) {
    if (line.length === 0) { return ''; }

    return padding[num]+line;
  }).join('\n');
}

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

