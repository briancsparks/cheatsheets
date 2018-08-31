
exports.json = function(argv, config) {
  const projectName = argv.project || argv.project_name || (config.project && config.project.name) || 'hello_world';

  return {
    name:         projectName,
    version:      '1.0.0',
    description:  `${projectName} Lambda`,
    main:         'src/lambda.js',
    dependencies: {
      "aws-json": "*",
      "quick-merge": "*",
      "run-anywhere": "*",
      "sgsg": "*"
    }
  }
};

