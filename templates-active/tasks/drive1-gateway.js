
const util                    = require('util');
const { promisify, inspect }  = util;
const exec                    = promisify(require('child_process').exec);
const { ScriptRunner }        = require('./script');


const main = async function() {
  var res, r = new ScriptRunner({cwd:process.cwd(), env: process.env});

  res = await r.exec(`cheat --vActive sam-init --verb=put --fname=ingest`);
  res = await r.exec(`sam validate -t sam.json`);

  r.pushd('src');

  res = await r.exec(`npm install`);
  res = await r.exec(`npm ls -depth 0`);
  r.popd();

  res = await r.exec(`sam local generate-event api -p "/ingest" | sam local invoke -t sam.json`);

  res = await r.exec(`sam package --template-file sam.json --output-template-file packaged.yaml --s3-bucket netlab-dev`);
  res = await r.exec(`aws cloudformation deploy --template-file C:\\Users\\sparksb\\dev\\cli-scratch\\packaged.yaml --stack-name NetlabServer`);

  return {stdout: r.stdout};
};





main().then((...args) => {
//  console.log({args});
});

