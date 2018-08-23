
/**
 *
 */
const sg                      = require('sgsg');
const _                       = sg._;

exports.generate = function(argv, context, callback) {
  return frozen();
};

const name    = 'sg-reduce';
const prefix  = 'sgr';

const pic     = exports.generate();
const body    = pic.split('\n');
const snip    = {
  [name]:{
    prefix,
    body
  }
};

var str = JSON.stringify(snip, null, 2).split('\n');
const len = str.length;
str = str.join('\n');
// str.pop();
// str.unshift();

console.log(str, typeof str, len);


function frozen() {
  return `sg.reduce(obj, {}, function(m, value, key) {
});`;
};



