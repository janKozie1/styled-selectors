const { exec } = require('child_process');
const { relative } = require('path');

const promisify = (fn) => (...args) => new Promise((resolve, reject) => {
  try {
    fn(...args, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  } catch (err) {
    reject(err);
  }
});

async function init() {
  const asyncExec = promisify(exec);

  const token = process.argv[2];
  await asyncExec(`echo ${token} | gh auth login --with-token`);

  const {baseRefName, headRefName} = JSON.parse(await asyncExec(`gh pr view  --json baseRefName,headRefName`));
  console.log("Base branch: ", baseRefName);
  console.log("Target branch: ", headRefName);
}

init()
  .then((chunks) => console.log(chunks))
  .catch((err) => {
    console.log(err, "??")
    process.exit(1)
  });
