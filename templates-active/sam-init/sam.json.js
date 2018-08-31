

const sg                      = require('sgsg');
const {
  _,
  toCapitalCase,
  toCamelCase,
  toDashCase
}                             = sg;

/**
 *  Generates the SAM-style cf template.
 *
 *  @argv     Parameters specific for this call.
 *  @config   Project configuration
 */
exports.json = async function(argv, config) {
  // console.log(require('util').inspect({argv, config}, {depth:null,colors:true}));

  const configuration       = config.configuration || {};

  // Get parameters
  const projectName         = argv.project || argv.project_name || configuration.project_name || nag('hello_world');
  const fname               = argv.fname || nag('hello_world');
  const Path                = argv.path   || `/${cC(fname)}`;
  const awsApiProjectName   = `${C(projectName)}Api`;
  const awsFnName           = `${C(fname)}Function`;
  const awsApiName          = `${C(fname)}Api`;

  // Get the functions Arn, if enough info is provided
  const acct                = config.acct;
  const role                = toDashCase(argv.role   || `${projectName}-executor`);
  const fnRoleArn           = argv.arn    || (acct && role && `arn:aws:iam::${acct}:role/${role}`);


  // Here is te object that gets turned into the cf-template
  var result = {

    // Normal boilerplate for the template engine
    AWSTemplateFormatVersion:       '2010-09-09',
    Transform:                       'AWS::Serverless-2016-10-31',

    // Globals are used by all functions
    Globals: {
      Function: {
        Runtime:                    'nodejs8.10',
        Timeout:                    30,
        MemorySize:                 512,
        CodeUri:                    argv.src_dir || argv.code_uri || 'src/',

        // The subnets and security groups for the VPC that we will occupy
        VpcConfig:                  config.project && config.project.VpcConfig,
      }
    },

    // The AWS resources we are going to use
    Resources: {

      // An Api Gateway (the swagger template is simple and just forwards all requests to our fn
      [awsApiProjectName] : {
        Type:                       'AWS::Serverless::Api',
        Properties: {
          DefinitionUri:            argv.doc_dir || argv.definition_uri || './swagger.yaml',
          StageName:                argv.stage   || nag('dev'),
        }
      },

      // The Lambda function that handles the Api Gateway requests
      [awsFnName]: {
        Type:                       'AWS::Serverless::Function',
        Properties: {

          // The Lambda handler is in the file 'src/lambda.js', exported as 'api_handler' (it is generated from './src/lambda.js'
          Handler:                  'lambda.api_handler',

          // The IAM Role that the function will operate with (this line will 'fizzle' if fnRoleArn is undefined.
          Role:                     fnRoleArn,

          // This is what ties the Lambda function to the Api Gateway
          Events: {
            [awsApiName] : {
              Type: 'Api',
              Properties: {
                Path,
                Method:             argv.method || argv.verb || 'get',
                RestApiId: {
                  "Ref":            awsApiProjectName,
                }
              }
            }
          }

        }
      }
    },

    // Publish my objects in the Output
    Outputs: {

      // The Lambda function Arn
      [awsFnName]: {
        Description:                `${fname} Lambda Function ARN`,
        Value: {
          "Fn::GetAtt":             [awsFnName, 'Arn'],
        }
      },

      // The URL of the Api Gateway
      [awsApiName] : {
        Description:                `API Gateway endpoint URL for Prod stage for ${fname} function`,
        Value: {
          "Fn::Sub":                `https://\${NetlabServerApi}.execute-api.\${AWS::Region}.amazonaws.com/Prod${Path}/`
        }
      }
    }
  };

  return result;
};

function nag(def) {
  console.warn(`Warning: using default value ${def}`);
  return def;
}

function C(x) {
  return toCapitalCase(x);
}

function cC(x) {
  return toCamelCase(x);
}
