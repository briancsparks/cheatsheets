#!/usr/bin/env node

var sg              = require('sgsg');
var _               = sg._;
var ARGV            = sg.ARGV();
var sh              = sg.extlibs.shelljs;
var util            = require('util');
var path            = require('path');
var fs              = require('fs');

sg.requireShellJsGlobal();

var   projectsDir     = path.join(sg.argvGet(ARGV, 'proj-dir,projects,p')        || __dirname, '..', 'projects');
var   templatesDir    = path.join(sg.argvGet(ARGV, 'templ-dir,template,templ,t') || __dirname, '..', 'templates');
var   snipsDir        = path.join(sg.argvGet(ARGV, 'snips-dir,snips,s') || __dirname, '..', 'snips');
var   startDir        = process.cwd();
const projects        = directory(projectsDir);
const templates       = directory(templatesDir);
const snips           = directory(snipsDir);
const metaWords       = 'foo,bar,baz,quxx';

var   fns   = {};
var   mans  = {};

const showUsage = function() {
  return sg.die(`Usage: cheat [${_.keys(fns)}] --filename=<rel-path>`);
};

/**
 *  Parses args and generates a snippet or a file from a template.
 *
 *  cheat templ_or_snip __filename__ __foo__ __baz__ __quxx__ --foo=foo --bar=bar --baz=baz --quxx=quxx
 */
var main = function() {

  if (ARGV.v || ARGV.verbose) {
    sh.config.verbose = true;
  }

  // `it` is the template or snip name (from the dir or filename)
  var   it  = ARGV.it   || ARGV.args.shift();

  // Need a template
  if (!it) {
    return showUsage();
  }

  // Does the template match the name of a template/name or snips/name
  if (it && fns[it]) {
    return fns[it](ARGV, it);

  // Does it match one of the hard-coded templates?
  } else if (it) {
    if (it === 'react')              { return fns.react(); }
    else if (it === 'react-native')  { return fns.react_native(); }
    else if (it === 'sg')            { return fns.sg(ARGV); }

    else {
      return sg.die("Cheat: unknown command: "+it);
    }

  // Does it match a man entry?
  } else if (ARGV.man) {
    if (ARGV.man === 'react')             { return mans.react(); }
    else {
      return sg.die("Cheat: unknown man entry: "+ARGV.man);
    }
  } else {
    return showUsage();
  }

};

//const cpAndMatchExt = function(src, dest_) {
//  var   dest    = dest_;
//  const srcExt  = path.extname(src);
//
//  if (path.extname(dest) !== srcExt) {
//    dest += srcExt;
//  }
//
//  return cp(src, dest);
//};

/**
 *  Copies template file and matches the mode of the file and the extension (so the user does not need to specify ext.)
 */
const cpAndMatchExt2 = function(src, dest_, argv) {
  var   dest    = dest_;
  const srcExt  = path.extname(src);

  if (path.extname(dest) !== srcExt) {
    dest += srcExt;
  }

  var stats     = fs.lstatSync(src);
  var mode      = +('0o'+stats.mode.toString(8).split("").reverse().join("").substr(0,3).split("").reverse().join(""));

  var contents  = ""+fs.readFileSync(src);
  _.each(metaWords.split(','), function(word) {
    if (argv[word]) {
      contents = contents.replace(new RegExp(word, 'gi'), argv[word]);
    }
  });

  fs.writeFileSync(dest, contents);
  fs.chmodSync(dest, mode);
};

/**
 *  Does a man page.
 */
fns.man = function(argv) {
  const entry     = argv.args.shift();

  const readme = ls(templates(entry+'-man', 'readme'));
  if (_.isArray(readme)) {
    console.log(cat(readme[0]));
  }
};

// Load up all the template dirs, and make functions out of them
_.each(ls(templates()), tDir => {
  if (test('-d', templates(tDir))) {
    fns[tDir] = function(argv, it) {
      const filename  = sg.argvGet(argv, 'filename,file,f') || ARGV.args.shift();
      if (!filename)  { return sg.die('Need --filename= (the new sg-skeleton file will be ./filename.js)'); }

      const srcDir    = directory(templates(tDir));
      const destDir   = directory(startDir, '.')(path.dirname(filename));
      const destFile  = directory(startDir, '.')(filename);

      parsePositionalArgs();

      //console.log(filename, destDir);

      mkdir('-p', destDir);

      _.each(',.js,.jsx,.cpp,.hpp,.h,.c,.java,.css,.less'.split(','), function(langExt) {

        const name = srcDir('_file'+langExt);
        if (!test('-f', name)) {
          return;
         }

        cpAndMatchExt2(name, destFile, argv);
      });
    }
  }
});

// We are pre-processing. Look at all of the dirs immediately under the `projects` dir.
// For each one, create a function.  This function will get called if the user chooses
// a project type
_.each(ls(projects()), pDir => {

  // Skip non-directories
  if (!test('-d', projects(pDir)))    { return; }

  const srcDir    = directory(projects(pDir));

  // Load all the project templates
  fns[pDir] = function(argv, it) {
    const dirname  = sg.argvGet(argv, 'dirname,file,f') || ARGV.args.shift();
    if (!dirname)  { return sg.die('Need --dirname= (the new sg-skeleton file will be ./dirname)'); }

    const destDir   = directory(startDir, '.', dirname);

    parsePositionalArgs();

    _.each(sh.ls('-R', srcDir('.')), name => {

      if (test('-f', srcDir(name))) {
        //console.error('file:', srcDir(name), destDir(name));
        cpAndMatchExt2(srcDir(name), destDir(name), argv);
      } else if (test('-d', srcDir(name))) {
        //console.error('dir:', srcDir(name), destDir(name));
        sh.mkdir('-p', destDir(name));
      }
    });

  };
});

var cpRTemplDir = function(templName, destRelDir) {
  var src       = path.join(templatesDir, templName, '*');
  var destDir   = path.join(startDir, destRelDir, '');

  mkdir('-p', destDir);
  cp('-Rf', src, destDir);
};

fns.reactz = function() {
  cpRTemplDir('react', '.');
};

mans.reactz = function() {
  var readme = path.join(templatesDir, 'react-man', 'readme');
  console.log(cat(readme));
};

fns['react-nativez'] = function() {
  cpRTemplDir('react', '.');
  cpRTemplDir('react-native', '.');
};


// Load a snip, do the replacement and send to stdout
_.each(ls(snipsDir), snipName => {
  if (test('-f', snips(snipName))) {
    fns[path.basename(snips(snipName), '.js')] = function(argv, it) {
      const indent = ((ARGV.args.length > 0) && argIsNumber(ARGV.args[0]) && ARGV.args.shift()) || 2;

      parsePositionalArgs();

      var snip = cat_([snipsDir, snipName], indent);
      snip = sg.reduce(ARGV.flags, snip, function(m, value, key) {
        return (m = m.replace(new RegExp(key, 'gi'), value));
      });

      process.stdout.write(snip);
    };
  }
});

if (ARGV.glue_gun || ARGV.gg) {
  const cheatGG = require('./cheat-glue-gun');
  cheatGG.main(function(err, result) {
    // if (err)      { console.error(err); return process.exit(2); }
    // if (result)   { console.log(result); }
  });

} else if (ARGV.v2) {
  const cheat2 = require('./cheat2');
  cheat2.main();

} else if (ARGV.vActive) {
  const cheatActive = require('./cheat-active');
  const activeMain = util.promisify(cheatActive.main);

  activeMain(function(err, result) {
    if (err)      { console.error(err); return process.exit(2); }
    if (result)   { console.log(result); }
  });

} else {
  main();
}

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

/**
 *  Makes a function that will make a directory name.
 *
 *  So you can make a variable that is descriptive of what you need, and is very easy
 *  to use to create paths and other things that are relative to the dir. For example,
 *
 *  ````
 *  const projectRootStr    = process.args[1]
 *  const project           = directory(projectRootStr))
 *  const gitdir            = directory(project('.git/'))
 *  const public            = directory(project('public/'))
 *  const source            = directory(project('src/'))
 *  const actions           = directory(source('Actions/'))
 *
 *  ```
 */
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

/**
 *  Turns the remaining positional args into --foo=one style
 */
function parsePositionalArgs() {
  _.each(metaWords.split(','), function(word) {
    if (ARGV.args.length > 0 && !ARGV[word]) {
      ARGV.setFlag(word, ARGV.args.shift());
    }
  });
}

/**
 *  Returns if the arg (a string) would be parsed as a number.
 */
function argIsNumber(arg) {
  return /^[0-9]+/.exec(arg);
}

