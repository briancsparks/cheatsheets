
/**
 *
 */
const sg                      = require('sgsg');
const _                       = sg._;
const sh                      = sg.extlibs.shelljs;

const ARGV                    = sg.ARGV();
const argvGet                 = sg.argvGet;
const argvExtract             = sg.argvExtract;
const setOnn                  = sg.setOnn;
const deref                   = sg.deref;

var lib = {};

const main = function(callback) {

  var result = {};
  return sg.iwrap('fn', callback, abort, function(eabort) {

    return sg.__run3([function(next, enext, enag, ewarn) {
      return next();

    // What is the diff between find and ls?
    }, function(next, enext, enag, ewarn) {
      const foundResult   = _.filter(sh.find('.'),     file => !file.startsWith('.git') && !file.startsWith('node_modules'));
      const lsResult      = _.filter(sh.ls('-R', '.'), file => !file.startsWith('.git') && !file.startsWith('node_modules'));

      console.log({foundResult, lsResult});

      const foundResult2  = _.filter(sh.find('templates'),     file => !file.startsWith('.git') && !file.startsWith('node_modules'));
      const lsResult2     = _.filter(sh.ls('-R', 'templates'), file => !file.startsWith('.git') && !file.startsWith('node_modules'));

      console.log({foundResult2, lsResult2});

      return next();

    }], function() {

      return callback(null, result);
    });
  });

  function abort(err, msg) {
    console.error(msg, err);
    return callback(err);
  }
};


//...
lib.myFavoriteFunction = function(argv, context, callback) {
  return callback();
};




_.each(lib, (value, key) => {
  exports[key] = value;
});

if (sg.callMain(ARGV, __filename)) {
  return main(function(err, result) {
    if (err)      { console.error(err); return process.exit(2); }
    if (result)   { console.log(result); }
  });
}

