return sg.until(function(again, last, count, elapsed) {
  if (count < 7) {
    return again(250);
  }

  return last();
}, function done() {
});
