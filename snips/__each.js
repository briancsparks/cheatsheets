return sg.__each(list, function(item, next) {
  return next();
}, function() {
  return next();
});

