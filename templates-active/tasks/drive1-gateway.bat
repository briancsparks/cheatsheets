
@node %~dp0\drive1-gateway.js

exit



cd \Users\sparksb\dev\cli-scratch

cheat --vActive sam-init --verb=put --fname=ingest --s3fname=normalize-input
sam validate -t sam.json

cd src
npm i
npm ls -depth 0
cd ..

sam local generate-event api -p "/ingest" | sam local invoke -t sam.json


sam package --template-file sam.json --output-template-file packaged.yaml --s3-bucket netlab-dev
aws cloudformation deploy --template-file C:\Users\sparksb\dev\cli-scratch\packaged.yaml --stack-name NetlabServer


