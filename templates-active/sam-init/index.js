
const { qm }                  = require('quick-merge');

var configFileName;
var configFile;
var tDir;
// var samYamlFile;
var samJsonFile;
var packageJsonFile;
var lambdaJsFile;

var phases = {};

exports.boot = async function(jetpackA, argv, utils) {
  const { JetpackFile } = utils;
  tDir    = jetpackA.cwd(__dirname);

  // samYamlFile     = new JetpackFile(tDir, 'sam.yaml');
  samJsonFile     = new JetpackFile(tDir, 'sam.json.js');
  lambdaJsFile    = new JetpackFile(tDir, 'src/lambda.js');
  packageJsonFile = new JetpackFile(tDir, 'src/package.json.js');

  const dest      = jetpackA.cwd();

  const stage     = argv.stage || 'dev';

  configFileName  = argv.config || `${stage}.yaml` || 'config.json';
  configFile      = new JetpackFile(jetpackA, configFileName);

  return { dest };
}

phases.main = async function(jetpack, argv, phase, current, utils, config) {
  const { inspect } = utils;

  const samJson     = await samJsonFile.render(argv, config);
  const packageJson = await packageJsonFile.render(argv, config);

  // const samYamlJson = await samYamlFile.render(argv);
  const lambdaJs    = await lambdaJsFile.render(argv);

  await samJsonFile.dest(jetpack).commit(samJson);
  await packageJsonFile.dest(jetpack).commit(packageJson);
  // await samYamlFile.dest(jetpack).commit(samYamlJson);
  await lambdaJsFile.dest(jetpack).commit(lambdaJs);

  return qm(phase, {
    done: true
  });
};

exports.main = async function(jetpack, argv_, phase, current, utils) {

  const stage       = argv_.stage || 'dev';
  const STAGE       = stage.toUpperCase();

  var   config      = await configFile.render();

  config = qm(config, {
    acct: process.env[`AWS_${STAGE}_ACCOUNT`],
  });

  const argv = qm(argv_, {
    stage, STAGE,
  });

  // console.log(`config: ${configFileName}`, {config});

  const handler = utils.getPhaseHandler(phases, phase);
  return await handler(jetpack, argv, phase, current, utils, config);
};

