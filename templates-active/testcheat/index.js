
const { qm }                  = require('quick-merge');

var tDir;
var booya;
var my_json;

var phases = {};

exports.boot = async function(jetpackA, argv, utils) {
  const { JetpackFile } = utils;
  tDir    = jetpackA.cwd(__dirname);

  booya   = new JetpackFile(tDir, 'dir1/booya.js');
  my_json = new JetpackFile(tDir, 'dir1/my.json.js');

  return {
    dest: jetpackA.cwd()
  };
}

phases.main = async function(jetpack, argv, phase, current, utils) {

  const booyaJs     = await booya.render(argv);
  const booyaDest   = booya.dest(jetpack);
  await booyaDest.commit(booyaJs);

  const my_jsonJson = await my_json.render(argv);
  const my_jsonDest = my_json.dest(jetpack);
  await my_jsonDest.commit(my_jsonJson);

  return qm(phase, {
    done: true
  });
};

exports.main = async function(jetpack, argv, phase, current, utils) {
  const handler = utils.getPhaseHandler(phases, phase);
  return await handler(jetpack, argv, phase, current, utils);
};

