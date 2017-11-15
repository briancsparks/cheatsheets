
/**
 *
 */
const sg                      = require('sgsg');
const _                       = sg._;
const AWS                     = require('aws-sdk');

const argvGet                 = sg.argvGet;
const argvExtract             = sg.argvExtract;
const setOnn                  = sg.setOnn;
const deref                   = sg.deref;

var   s3                      = new AWS.S3();

var lib = {};


lib.myFavoriteFunction = function(argv, context, callback) {

  return sg.__run2({}, callback, [function(result, next, last, abort) {

    const params = {};

    return s3.getObject(params, function(err, data) {
      if (err)        { return abort(err, 'functionname.calledfunctionname'); }
      return next();
    });

  }, function(result, next, last, abort) {
    return next();
  }], function abort(err, msg) {
    if (err && msg)        { return sg.die(err, callback, msg); }
    return callback();
  });
};



_.each(lib, (value, key) => {
  exports[key] = value;
});

