
const { qm }                  = require('quick-merge');

const srcMod                  = require('./src');

exports.boot = async function(jetpackA, argv, utils) {
  return {
    dest: jetpackA.cwd()
  };
}

exports.main = async function(jetpack, argv, phase, current, utils) {
  const srcResult = await srcMod.main(jetpack, argv, phase, current, utils);

  return qm(phase, {
    done: true
  });
};
