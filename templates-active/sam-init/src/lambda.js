
const sg                      = require('sgsg');
const ra                      = (sg.include('run-anywhere') || require('run-anywhere')).v2;
//const ra                      = sg.include('run-anywhere').v2;
//const ra                      = require('run-anywhere').v2;
const { qm }                  = require('quick-merge');
const awsJson                 = require('aws-json');
const {
  apiResponse,
  _200,
  _500,
}                             = awsJson;

/**
 *  Just handles the input parameters and handing them off to other functions to do
 *  the real work. And handles formatting the result correctly.
 *
 *  Should not do any real processing outside parameter manipulation.
 */
exports.api_handler = ra.hook({runHost:'awsApiGateway',fname:'api_handler',wantEvent:true}, function(event, context, callback) {

  // Assume the worst
  var   result = _500({});

  try {
    result = _200({event});
  }
  catch (err) {
    console.error(err);
    callback(err, result);
  }

  return callback(null, result);
});



