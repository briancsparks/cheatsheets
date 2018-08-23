
/**
 *
 */
const sg                      = require('sgsg');
const _                       = sg._;
const fs                      = require('fs');

var   str;

const fname     = './sg-reduce.js';
const content   = fs.readFileSync(fname, 'utf8');
str             = content.split('\n').filter(line => line);

var body        = dquote('body');

console.log(kv('prefix', 'sgr', ','));

console.log(`${body}: [`);


var line;

const len = str.length;
for (var i = 0; i < len; ++i) {
  const line_ = str[i];
  if (line_) {
    line = `"${line_}"` + (i+1 === len ? '' : ',');
    console.log(line);
  }
}

console.log(']');
console.log('}');


function kv(key, value, delim_) {
  const delim = delim_ || '';

  return `"${key}":"${value}${delim}"`;
}

function dquote(x) {
  return `"${x}"`;
}
