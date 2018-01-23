return sg.__eachll(list, function(item, next) {
  return next();
}, function() {
  return next();
});
