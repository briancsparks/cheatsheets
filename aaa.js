#!/usr/bin/env node

return sg.__run2({}, callback, [function(result, next, last, abort) {
  return next();
}, function(result, next, last, abort) {
  return next();
}], function abort(err, message) {
  if (message) { return sg.die(err, callback, message); }
  return callback(err);
});


