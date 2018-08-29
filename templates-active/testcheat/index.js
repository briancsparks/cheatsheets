
const { qm }                  = require('quick-merge');

var tDir;
var booya;
var my_json;

exports.boot = async function(jetpackA, argv, utils) {
  tDir    = jetpackA.cwd(__dirname);
  booya   = {
    src:  utils.jetpackFile(tDir, 'dir1/booya.js')
  };
  my_json = {
    src:  utils.jetpackFile(tDir, 'dir1/my.json.js')
  };

  return {
    dest: jetpackA.cwd()
  };
}

exports.main = async function(jetpack, argv, phase, current, utils) {

  booya.dest    = booya.src.dest(jetpack);
  my_json.dest  = my_json.src.dest(jetpack);

  await booya.dest.commit(await booya.src.render(argv));
  await my_json.dest.commit(await my_json.src.render(argv));

  return qm(phase, {
    done: true
  });
};
