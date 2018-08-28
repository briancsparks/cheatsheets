
/**
 *
 */
const sg                      = require('sgsg');
const _                       = sg._;
const fs                      = require('fs');

const name    = 'sg-reduce';
const params  = {
  prefix: 'sgr',
  description: '_.reduce, but with the function at the end, where it should be.'
};
const fname     = './sg-reduce.js';


console.log(stringifyit(name, params, fname));

function stringifyit(name, params, body) {
  var line;
  var out = '';

  const content   = fs.readFileSync(fname, 'utf8');
  const str       = content.split('\n').filter(line => line);

  out     += mkline(',');
  out     += mkline(`${dquote(name)}: {`);

  out  = sg.reduce(params, out, (m, value, key) => {
    return (m + mkline(kv(key, value, ',')));
  });

  var body     = dquote('body');
  out         += mkline(`${body}: [`);

  const len = str.length;
  for (var i = 0; i < len; ++i) {
    const line_ = str[i];
    if (line_) {
      line = `"${line_}"` + (i+1 === len ? '' : ',');
      out += mkline(line);
    }
  }

  out += mkline(']');
  out += mkline('}');

  return out;
}




function mkline(str) {
  return str + '\n';
}

function kv(key, value, delim_) {
  const delim = delim_ || '';

  return `"${key}":"${value}"${delim}`;
}

function dquote(x) {
  return `"${x}"`;
}
