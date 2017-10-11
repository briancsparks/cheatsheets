
/**
 *
 */
const sg                      = require('sgsg');
const _                       = sg._;
const raLib                   = sg.include('run-anywhere') || require('run-anywhere');

const argvGet                 = sg.argvGet;

var lib = {};

lib.foo = function() {
  var   u               = sg.prepUsage();

  return raLib.adapt(arguments, (argv, context, callback) => {
    const bar           = ra.wrap(lib.bar);

    const xyz           = argvGet(argv, u('xyz',  '=abc', 'The xyzabc.'));

    if (!xyz)           { return u.sage('xyz', 'Need XYZ.', callback); }

    return sg.__run2({}, callback, [function(result, next, last, abort) {

      return next();

    }], function abort(err, msg) {
      if (msg)  { return sg.die(err, callback, msg); }
      return callback(err);
    });
  });
};

_.each(lib, (value, key) => {
  exports[key] = value;
});

