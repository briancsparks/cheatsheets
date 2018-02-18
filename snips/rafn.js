lib.fn = function() {
  var   u               = sg.prepUsage();

  var ra = raLib.adapt(arguments, (argv, context, callback) => {

    const foo           = argvGet(argv, u('foo',  '=foo', 'The foo.'));
    if (!foo)           { return u.sage('foo', 'Need foo.', callback); }

    return sg.iwrap('fn', callback, function(eabort) {

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
