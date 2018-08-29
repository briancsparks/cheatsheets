
const { qm }                  = require('quick-merge');

var tDir;
var samYamlFile;
var lambdaJsFile;

var phases = {};

exports.boot = async function(jetpackA, argv, utils) {
  const { JetpackFile } = utils;
  tDir    = jetpackA.cwd(__dirname);

  samYamlFile   = new JetpackFile(tDir, 'sam.yaml');
  lambdaJsFile  = new JetpackFile(tDir, 'src/lambda.js');

  return {
    dest: jetpackA.cwd()
  };
}

phases.main = async function(jetpack, argv, phase, current, utils) {
  const { inspect } = utils;

  const samJson     = await samYamlFile.render(argv);
  const lambdaJs    = await lambdaJsFile.render(argv);

  await samYamlFile.dest(jetpack).commit(samJson);
  await lambdaJsFile.dest(jetpack).commit(lambdaJs);

  return qm(phase, {
    done: true
  });
};

exports.main = async function(jetpack, argv, phase, current, utils) {
  // TODO: read/build a config object from env, setting file in project
  //       most argv params can be remembered, or fetched, or whatever
  const handler = utils.getPhaseHandler(phases, phase);
  return await handler(jetpack, argv, phase, current, utils);
};

