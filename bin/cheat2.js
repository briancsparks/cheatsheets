
/**
 *
 */
const sg                      = require('sgsg');
const _                       = sg._;
const cheatCli                = require('../v2/cheat/cli');

const ARGV                    = sg.ARGV();
const argvGet                 = sg.argvGet;
const argvExtract             = sg.argvExtract;
const setOnn                  = sg.setOnn;
const deref                   = sg.deref;

var lib = {};

lib.main = async function(callback) {

  var result = {};
  result.main = 2;
  const cliResult = await cheatCli.run(process.argv);
  // result.cliResult = cliResult;
  callback(null, result);

  // return sg.iwrap('fn', callback, abort, function(eabort) {

  //   return sg.__run3([function(next, enext, enag, ewarn) {
  //     result.main = 2;
  //     return next();

  //   }, function(next, enext, enag, ewarn) {
  //     return next();

  //   }], function() {
  //     result.cliResult = await cheatCli.run(process.argv);
  //     return callback(null, result);
  //   });
  // });

  function abort(err, msg) {
    console.error(msg, err);
    return callback(err);
  }
};


_.each(lib, (value, key) => {
  exports[key] = value;
});


