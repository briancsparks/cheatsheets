
sg.reduce(obj, {}, function(m, value, key) {
  return sg.kv(m, key, value);
});
