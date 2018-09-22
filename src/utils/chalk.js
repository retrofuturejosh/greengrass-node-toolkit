const chalk = require('chalk')

function logGreenDim(string) {
  console.log(chalk.green.dim(string));
}

function logRed(string) {
  console.log(chalk.red(string));
}

function logGreen(string) {
  console.log(chalk.green(string));
}

module.exports = {
  logGreenDim,
  logRed,
  logGreen
}
