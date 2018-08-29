
const path                    = require('path');
const util                    = require('util');
const yaml                    = require('js-yaml');
const myJetpack               = require('fs-jetpack').cwd(__dirname);
const { qm }                  = require('quick-merge');
const res                     = myJetpack.cwd('res');

exports.main = async function(jetpack, argv, phase, current, utils) {

  return await utils.rmwYaml(jetpack, 'template.yaml', res, 'template.yaml', argv);

  // const templateYamlPart  = await utils.readFile(res, 'template.yaml', 'yaml', argv);
  // const existing          = await utils.readFile(jetpack, 'template.yaml', 'yaml');
  // const newTemplate       = qm(existing || {}, templateYamlPart);
  // const newTemplateYaml   = yaml.dump(newTemplate);
  // console.log(util.inspect({templateYamlPart, existing, newTemplate, newTemplateYaml}, {depth:null, color: true}));

  // jetpack.writeAsync('template.yaml', newTemplateYaml);
};
