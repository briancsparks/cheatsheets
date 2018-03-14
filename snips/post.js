return request.post(foo)
  .send(bar)
  .end((err, result) => {
    if (sg.ok(err, result) && result.ok && result.body) { /* text, body, header, type, charset */
    }
  });
