return sg.__run3([function(next, enext, enag, ewarn) {
  return next();
}, function(next, enext, enag, ewarn) {
  return next();
}], function() {
  return callback(err, result);
});

