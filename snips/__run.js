return sg.__run([function(next) {
  return next();
}, function(next) {
  return next();
}], function done() {
  return callback();
});
