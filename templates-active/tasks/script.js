
const util                    = require('util');
const { promisify, inspect }  = util;
const exec                    = promisify(require('child_process').exec);
const chalk                   = require('chalk');

exports.ScriptRunner = function(startOptions = {}) {
  var   self    = this;
  var   options = {...startOptions};

  options.cwd   = options.cwd || process.cwd();
  options.env   = options.env || {...process.env};

  var dirs = [];
  self.pushd = function(dir) {
    dirs.push(process.cwd());
    process.chdir(dir);
  };

  self.popd = function() {
    process.chdir(dirs.pop());
  };

  self.exec = async function(commandStr) {

    console.log(`---------------------------------------------------`);
    console.log(`----- ${chalk.yellow(commandStr)}`);
    const {error, stdout, stderr } = await exec(commandStr);

    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.log(chalk.red(stderr));
    }

    self.error  = error;
    self.stdout = stdout;
    self.stderr = stderr;

    return stdout;
  };


  self.json = async function(commandStr) {

    console.log(`---------------------------------------------------`);
    console.log(`----- ${chalk.yellow(commandStr)}`);
    const {error, stdout, stderr } = await exec(commandStr);

    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.log(chalk.red(stderr));
    }

    self.error  = error;
    self.stdout = stdout;
    self.stderr = stderr;

    return stdout;
  };


  self.json = async function(commandStr) {

    console.log(`     0:  ${commandStr}`);
    const {error, stdout, stderr } = await exec(commandStr);

    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.log(stderr);
    }

    self.error  = error;
    self.stdout = stdout;
    self.stderr = stderr;

    try {
      return JSON.parse(stdout);
    } catch(e) {
      // Dont care that stdout didnt parse as JSON
    }

    return false;
  };

};

const main = async function() {
};


