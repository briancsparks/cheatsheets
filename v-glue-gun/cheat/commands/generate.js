module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async toolbox => {
    const {
      parameters,
      options,
      template: { generate }
    } = toolbox

    const name = parameters.first
    const location = parameters.second;

    const content = await generate({
      template: `${name}.js.ejs`,
      target: `${location}.js`,
      props: { name, ...parameters.options }
    })

    return content;
  }
}
