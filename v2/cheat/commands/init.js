const util = require('util');
const path = require('path');

module.exports = {
  name: 'init',
  run: async toolbox => {
    const {
      filesystem,
      parameters,
      options,
      template: { generate }
    } = toolbox

    const cwd = filesystem.cwd();
    const info  = filesystem.inspectTree(path.join(__dirname, '..'));
console.log(inspect({cwd, info}));

    const name = parameters.first
    const location = parameters.second;

    // const content = await generate({
    //   template: `${name}.js.ejs`,
    //   target: `${location}.js`,
    //   props: { name, ...parameters.options }
    // })

    // return content;
  }
}

function inspect(x) {
  return util.inspect(x, {depth:null, colors: true});
}
