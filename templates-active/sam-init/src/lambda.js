
const { qm }                  = require('quick-merge');

exports.api_handler = function(event, context, callback) {

  // Assume the worst
  var   result = _500({ok:false});

  try {
    result = _200({event});
  }
  catch (err) {
    console.error(err);
    callback(err, result);
  }

  return callback(null, result);
};


function mkResponse(code, json) {
  var body = json;
  if (typeof body !== 'string') {
    body = JSON.stringify(body);
  }

  return {
    statusCode: code,
    body
  };
}

function _200(json) { return mkResponse(200, qm(json, {ok:true})); }
function _201(json) { return mkResponse(201, qm(json, {ok:true})); }
function _301(json) { return mkResponse(301, qm(json, {ok:true})); }
function _302(json) { return mkResponse(302, qm(json, {ok:true})); }
function _400(json) { return mkResponse(400, qm(json, {ok:false})); }
function _403(json) { return mkResponse(403, qm(json, {ok:false})); }
function _404(json) { return mkResponse(404, qm(json, {ok:false})); }
function _500(json) { return mkResponse(500, qm(json, {ok:false})); }
function _503(json) { return mkResponse(503, qm(json, {ok:false})); }
