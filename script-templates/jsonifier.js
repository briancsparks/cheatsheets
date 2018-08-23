
/**
 *
 */
const sg                      = require('sgsg');
const _                       = sg._;
const fs                      = require('fs');

var   str;

const fname     = './sg-reduce.js';
const content   = fs.readFileSync(fname, 'utf8');
// str             = content;
// console.log(str);

str             = content.split('\n').filter(line => line);

var line;

const len = str.length;
for (var i = 0; i < len; ++i) {
  const line_ = str[i];
  if (line_) {
    line = `"${line_}"` + (i+1 === len ? '' : ',');
    console.log(line);
  }
}


// const body      = content.split('\n').filter(function(line) { return line; });
// str             = body;

// console.log(JSON.stringify(str));

module.exports = str;

// lib.myFavoriteFunction = function(argv, context, callback) {
//   return callback();
// };

// _.each(lib, (value, key) => {
//   exports[key] = value;
// });


