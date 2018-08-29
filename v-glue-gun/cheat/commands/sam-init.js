const util = require('util');
const path = require('path');

module.exports = {
  name: 'sam-init',
  run: async toolbox => {
    const {
      filesystem,
      parameters,
      options,
      template: { generate },
      patching: { update }
    } = toolbox

    const {
      exists,
      inspectTree
    } = filesystem;

    const cwd         = filesystem.cwd();
    const name        = parameters.second;
    const location    = path.join(cwd, parameters.first);
    const appLocation = path.join(location, name);

    const tDir  = path.join(__dirname, '..', 'templates', 'sam');
    const info  = inspectTree(tDir);

    const srcPackageJson    = path.join(tDir, 'app', 'package.json');
    const destPackageJson   = path.join(appLocation, 'package.json');
    if (exists(srcPackageJson)) {
      // console.log(`exists`, {parameters, location, appLocation,   srcPackageJson, destPackageJson, package: filesystem.inspect(srcPackageJson)});
      filesystem.copy(srcPackageJson, destPackageJson);
      await update(destPackageJson, (package) => {
        return {...package,
          name,
          description: `${name} app`
        }
      });
    }

    var src, dest;

    // ----------- app.js ----------
    src   = path.join('sam', 'app', 'app.js.ejs');
    dest  = path.join(appLocation, `${name}.js`);

    var gparams = {
      template: src,
      target: dest,
      props: { name, ...parameters.options}
    };

    var content = await generate(gparams);

    // ----------- test_app.js ----------
    src   = path.join('sam', 'app', 'tests', 'unit', 'test_app.js.ejs');
    dest  = path.join(appLocation, 'tests', 'unit', `test_${name}.js`);

    var gparams = {
      template: src,
      target: dest,
      props: { name, ...parameters.options}
    };

    content = await generate(gparams);

    // ----------- template.yaml ----------
    src   = path.join('sam', 'template.yaml.ejs');
    dest  = path.join(appLocation, '..', `template.yaml`);

    var gparams = {
      template: src,
      target: dest,
      props: { name, ...parameters.options}
    };

    var content = await generate(gparams);

    // return content;
  }
}

function inspect(x) {
  return util.inspect(x, {depth:null, colors: true});
}
