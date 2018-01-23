return sg.__runll([function(next) {
  return next();
}, function(next) {
  return next();
}], function() {
  return next();
});

