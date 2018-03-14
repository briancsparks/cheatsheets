return request.get(foo).end((err, result) => {
  if (sg.ok(err, result) && result.ok && result.body) { /* text, body, header, type, charset */
  }
});
