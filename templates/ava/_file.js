
/**
 *
 */
const sg                      = require('sgsg');
const _                       = sg._;

const test                    = require('ava');

// Unconditional:
// t.pass('[message]');
// t.fail('[message]');
//
// Assertions:
// t.truthy(data, '[message]');
// t.falsy(data, '[message]');
// t.true(data, '[message]');
// t.false(data, '[message]');
// t.is(data, expected, '[message]');
// t.not(data, expected, '[message]');
// t.deepEqual(data, expected, '[message]');
// t.notDeepEqual(data, expected, '[message]');
// t.throws(function|promise, [error, '[message]']);
// t.notThrows(function|promise, '[message]');
// t.regex(data, regex, '[message]');
// t.notRegex(data, regex, '[message]');
// t.ifError(error, '[message]');         /* assert that error is falsy */
//
// t.skip.is(foo(), 5);

// Normal node-cc async
test.cb('bar', t => {
  t.plan(1);

  t.log('starting');
  return baz({}, function(err, data) {
    t.log('in callback');
    t.pass();
    t.end();
  });
});

// Normal, sync
xtest('foo', t => {
  t.pass();
});

// Async / await
xtest('bar', async t => {
  const bar = Promise.resolve('bar');

  t.is(await bar, 'bar');
});

// Promisified
xtest(t => {
  t.plan(1);

  return Promise.resolve(3).then(n => {
    t.is(n, 3);
  });
});

function xtest(){}

