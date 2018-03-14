
/**
 *
 */
const sg                      = require('sgsg');
const _                       = sg._;
const raLib                   = sg.include('run-anywhere') || require('run-anywhere');

const argvGet                 = sg.argvGet;
const argvExtract             = sg.argvExtract;
const setOnn                  = sg.setOnn;
const deref                   = sg.deref;


var lib = {};

lib.foo = function() {
  var   u               = sg.prepUsage();

  var ra = raLib.adapt(arguments, (argv, context, callback) => {
    const baz           = ra.wrap(lib.baz);

    const bar           = argvGet(argv, u('bar',  '=bar', 'The bar.'));
    if (!bar)           { return u.sage('bar', 'Need bar.', callback); }

    var   result        = {};

    return sg.iwrap('foo', callback, function(eabort) {

      return sg.__run3([function(next, enext, enag, ewarn) {
        return next();

      }, function(next, enext, enag, ewarn) {
        return next();

      }], function() {

        return callback(err, result);
      });
    });

  });
};

lib.baz = function(argv, context, callback) {
  return callback();
};

_.each(lib, (value, key) => {
  exports[key] = value;
});

