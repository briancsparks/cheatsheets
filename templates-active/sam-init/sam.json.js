

const sg                      = require('sgsg');
const {
  _,
  toCapitalCase,
  toCamelCase,
  toDashCase
}                             = sg;

exports.json = async function(argv, config) {
  // console.log(require('util').inspect({argv, config}, {depth:null,colors:true}));

  const configuration       = config.configuration || {};

  const projectName         = argv.project || argv.project_name || configuration.ProjectName || nag('hello_world');
  const fname               = argv.fname || nag('hello_world');
  const Path                = argv.path   || `/${cC(fname)}`;
  const awsApiProjectName   = `${C(projectName)}Api`;
  const awsFnName           = `${C(fname)}Function`;
  const awsApiName          = `${C(fname)}Api`;

  const acct                = config.acct;
  const role                = toDashCase(argv.role   || `${projectName}-executor`);
  const fnRoleArn           = argv.arn    || (acct && role && `arn:aws:iam::${acct}:role/${role}`);


  var result = {
    AWSTemplateFormatVersion:       '2010-09-09',
    Transform:                       'AWS::Serverless-2016-10-31',

    Globals: {
      Function: {
        Runtime:                    'nodejs8.10',
        Timeout:                    30,
        MemorySize:                 512,
        CodeUri:                    argv.src_dir || argv.code_uri || 'src/',
        VpcConfig:                  config.project && config.project.VpcConfig,
      }
    },

    Resources: {
      [awsApiProjectName] : {
        Type:                       'AWS::Serverless::Api',
        Properties: {
          DefinitionUri:            argv.doc_dir || argv.definition_uri || './swagger.yaml',
          StageName:                argv.stage   || nag('dev'),
        }
      },

      [awsFnName]: {
        Type:                       'AWS::Serverless::Function',
        Properties: {
          Handler:                  'lambda.api_handler',
          Role:                     fnRoleArn,

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

    Outputs: {
      [awsFnName]: {
        Description:                `${fname} Lambda Function ARN`,
        Value: {
          "Fn::GetAtt":             [awsFnName, 'Arn'],
        }
      },
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

// TODO: add back VpcConfig, Environment

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
