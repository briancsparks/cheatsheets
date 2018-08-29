
/**
 *
 */
const sg                      = require('sgsg');
const _                       = sg._;
const { qm }                  = require('quick-merge');
const sh                      = sg.extlibs.shelljs;
const jetpackA                = require('fs-jetpack');
const pathLib                 = require('path');
const tempy                   = require('tempy');

const ARGV                    = sg.ARGV();
const argvGet                 = sg.argvGet;
const argvExtract             = sg.argvExtract;
const setOnn                  = sg.setOnn;
const deref                   = sg.deref;

var   jetpack;

const showUsage = function(msg) {
  return sg.die(`Usage: cheat ${msg || ''}`);
};

var templateLibs = {};
var lib = {};

exports.main = async function() {

  const jpRoot      = jetpackA.cwd(__dirname, '..');
  const jpTemplates = jpRoot.cwd('templates-active');

  if (ARGV.v || ARGV.verbose) {
    sh.config.verbose = true;
  }

  // `it` is the template or snip name (from the dir or filename)
  var   it  = ARGV.it   || ARGV.args.shift();

  // Need a template
  if (!it) {
    return showUsage();
  }

  const userFullname = ARGV.name || ARGV.args.shift();

  var   userParts       = userFullname.split(pathLib.sep);
  const userName        = userParts.pop();
  const itPath          = pathLib.join(...userParts);
  const [itName, itExt] = userName.split('.');

  const jpTemplate  = jpTemplates.cwd(it);

  var   argv        = _.omit(ARGV.getParams({skipArgs:true}), 'verbose', 'it');

  const utils       = require('../lib/utils');
  const mod         = require(jpTemplate.cwd()) || {};

  var   root        = {};
  const boot        = mod.boot;
  if (typeof boot === 'function') {
    root = await boot(jetpackA, argv, utils);
  }

  const destRoot    = root.dest || jetpackA.cwd();
  jetpack           = jetpackA.cwd(destRoot);

  var   current     = {};

  const main          = mod.main;

  if (typeof main !== 'function') { return showUsage(`${jpTemplate.cwd()} missing main()`); }

  var next;
  var phase = {phase: 'start', iteration: 0};
  while (!phase.done) {
    current = updateCurrentFiles(current);
    phase = await main(jetpack, argv, phase, current, utils);
  }

  function updateCurrentFiles(current) {
    const result = qm(current, {
      destFiles: jetpack.find({matching:'*'})
    });

    return result;
  }


  // const files       = jpTemplate.find({matching:'*'});

  // var count = 0;
  // _.each(files, fullname => {
  //   var   parts     = fullname.split(pathLib.sep);
  //   const filename  = parts.pop();
  //   const path      = pathLib.join(...parts);

  //   const [
  //     name_,
  //     tExt,
  //     ...rest]      = filename.split('.');
  //   const name      = ((name_ === '_file') ? itName || 'index' : name_);
  //   const ext       = ((name_ === '_file' && itExt) ? itExt : tExt);
  //   const stat = jpTemplate.inspect(fullname);

  //   const dest      = pathLib.join(itPath, path, `${name}.${ext}`);
  //   const src       = fullname;

  //   // We have src, dest, ext
  //   process(jpTemplate, src, dest, tExt, rest);

  //   count += 1;
  // });

  // if (count === 0) {
  //   showUsage("no files processed");
  // }

};

// ---------------------------------------------------------

// The processors
var processors = {};

// Read a file, and do foo-style processing
const readFile = processors.file = function(jpTempl, src_, dest_X, ext) {
  const src0 = jpTempl.cwd(src_).cwd();
  const src  = fooify(src0, _.omit(ARGV.getParams({skipArgs:true}), 'verbose', 'it'));

  if (ext === 'json') {
    return jetpack.read(src, 'jsonWithDates');
  }
  return jetpack.read(src);
};

/**
 *  Require the file, and pass in ARGS; the file will return the
 *  built-out content.
 */
processors.js = function(jpTempl, src_, dest, ext) {
  const src = jpTempl.cwd(src_).cwd();
  const mod = require(src) || {};
  const fn  = mod[ext] || function(){};

  const argv  = sg.reduce(ARGV.getParams({skipArgs:true}), {}, (m, value, key) => {
    return sg.kv(m, key, sg.smartValue(value));
  });

  return fn(argv) || '';
};

/**
 *  Process one file.
 */
function process(jpTempl, src_, dest, ext, procs) {
  const src   = jpTempl.cwd(src_).cwd();
  const proc  = procs.pop() || 'file';

  var   content = processors[proc](jpTempl, src_, dest, ext);

  //console.log(`${src_} --> ${dest}`);

  // Append strings to the end of files (the original file is almost always empty)
  if (typeof content === 'string') {
    jetpack.append(dest, content);

  // Merge contents of JSON files
  } else if (typeof content === 'object') {
    const orig = jetpack.read(dest, 'jsonWithDates') || {};

    content = qm(orig, content);
    jetpack.write(dest, content);
  }
}

/**
 *  Do foo-style processing on a file.
 *
 */
function fooify(src, argv) {
  var dest  = tempy.file();

  sh.cat(src).to(dest);

  _.each(argv, (value, key) => {
    if (typeof value === 'string') {
      sh.sed('-i', snakeRex(key), sg.toSnakeCase(value), dest);
      sh.sed('-i', camelRex(key), sg.toCamelCase(value), dest);
      sh.sed('-i', capitalRex(key), sg.toCapitalCase(value), dest);
    }
  });

  return dest;
}

function snakeRex(str) {
  return RegExp(sg.toSnakeCase(str), 'g');
}

function camelRex(str) {
  return RegExp(sg.toCamelCase(str), 'g');
}

function capitalRex(str) {
  return RegExp(sg.toCapitalCase(str), 'g');
}

