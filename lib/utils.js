
const sg                      = require('sgsg');
const _                       = sg._;
const { qm }                  = require('quick-merge');
const yaml                    = require('js-yaml');
const tempy                   = require('tempy');
const sh                      = sg.extlibs.shelljs;

/**
 *  Will split the path, irrespective of the OSs desired separator.
 */
const splitPath = exports.splitPath = function(str) {
  if (typeof str !== 'string')    { return str; }   /* hopefully, already split */

  return sg.reduce(str.split('/'), [], (m0, part0) => {
    return sg.reduce(part0.split('\\'), m0, (m, part) => {
      return [...m, part];
    });
  });
};

const modify = exports.modify = async function(dest, src, updateFn) {
};

const readFile = exports.readFile = async function(jpTempl, src_, ext, argv) {
  const src0 = jpTempl.cwd(src_).cwd();
  const {
    file,
    remove }    = fooify(src0, argv);

  var result;

  if (ext === 'json') {
    result = await jpTempl.readAsync(file, 'jsonWithDates');
  } else if (ext === 'yaml') {
    result = await jpTempl.readAsync(file);
    if (result) {
      result = yaml.load(result);
    }
  } else {
    result = await jpTempl.readAsync(file);
  }

  if (remove) {
    await jpTempl.removeAsync(file);
  }

  return result;
};

const rmwYaml = exports.rmwYaml = async function(jetpack, dest, jpTempl, src, argv) {
  const templateYamlPart  = await readFile(jpTempl, src, 'yaml', argv);
  const existing          = await readFile(jetpack, dest, 'yaml');
  const newTemplate       = qm(existing || {}, templateYamlPart);
  const newTemplateYaml   = yaml.dump(newTemplate);
  //console.log(util.inspect({templateYamlPart, existing, newTemplate, newTemplateYaml}, {depth:null, color: true}));

  await jetpack.writeAsync(dest, newTemplateYaml);
};

const getPhaseName = function(phase) {
  switch (phase.iteration) {
  case 1:                           return `${phase.phase}`;
  default:                          return `${phase.phase}${phase.iteration}`;
  }
}

var defPhaseHandlers = {
  start0:     function(_, __, phase) { return qm(phase, {iteration:1}); },
  start:     function(_, __, phase) { return qm(phase, {iteration:2}); },
  start2:     function(_, __, phase) { return qm(phase, {iteration:0, phase:'main'}); },

  main0:      function(_, __, phase) { return qm(phase, {iteration:1}); },
  main:      function(_, __, phase) { return qm(phase, {iteration:2}); },
  main2:      function(_, __, phase) { return qm(phase, {iteration:0, phase:'cleanup'}); },

  cleanup0:   function(_, __, phase) { return qm(phase, {iteration:1}); },
  cleanup:   function(_, __, phase) { return qm(phase, {iteration:2}); },
  cleanup2:   function(_, __, phase) { return qm(phase, {done:true}); },
};

exports.getPhaseHandler = function(phases, phase) {

  const name = getPhaseName(phase);
  return phases[name] || defPhaseHandlers[name] || function(){};
}

/**
 *  Do foo-style processing on a file.
 *
 */
const fooify = exports.fooify = function(src, argv) {
  if (!argv)    { return {file: src, remove: false}; }

  var dest  = tempy.file();

  sh.cat(src).to(dest);

  _.each(argv, (value, key) => {
    if (typeof value === 'string') {
      sh.sed('-i', snakeRex(key), sg.toSnakeCase(value), dest);
      sh.sed('-i', camelRex(key), sg.toCamelCase(value), dest);
      sh.sed('-i', capitalRex(key), sg.toCapitalCase(value), dest);
    }
  });

  return {file: dest, remove: true};
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
