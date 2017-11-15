
/**
 *
 */
const sg                      = require('sgsg');
const _                       = sg._;

const argvGet                 = sg.argvGet;
const argvExtract             = sg.argvExtract;
const setOnn                  = sg.setOnn;
const deref                   = sg.deref;

var lib = {};


lib.myFavoriteFunction = function() {

  return sg.__run([function(next) {
  }, function(next) {
  }], function() {
  });
};



_.each(lib, (value, key) => {
  exports[key] = value;
});

