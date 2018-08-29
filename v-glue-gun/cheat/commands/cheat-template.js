module.exports = {
  name: 'cheat-template',
  run: async toolbox => {
    const { print } = toolbox;

    print.info(`welcome to cheat cli`);
  }
}
