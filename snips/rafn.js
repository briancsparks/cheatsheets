lib.foo = function() {
  var   u               = sg.prepUsage();

  var ra = raLib.adapt(arguments, (argv, context, callback) => {

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
