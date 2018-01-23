lib.foo = function() {
  var   u               = sg.prepUsage();

  var ra = raLib.adapt(arguments, (argv, context, callback) => {
    const baz           = ra.wrap(lib.baz);

    const bar           = argvGet(argv, u('bar',  '=bar', 'The bar.'));

    if (!bar)           { return u.sage('bar', 'Need bar.', callback); }

    return sg.__run2({}, callback, [function(result, next, last, abort) {
      return next();

    }, function(result, next, last, abort) {
      return next();

    }], function abort(err, msg) {
      if (msg)  { return sg.die(err, callback, msg); }
      return callback(err);
    });
  });
};
