const { exec } = require('child_process');

function init() {
  console.log(process.argv);

  console.log(exec('ls'))
}

init();
