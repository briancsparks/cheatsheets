
const sg                      = require('sgsg');
const _                       = sg._;
const { qm }                  = require('quick-merge');
const yaml                    = require('js-yaml');
const tempy                   = require('tempy');
const sh                      = sg.extlibs.shelljs;

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
