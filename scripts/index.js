const { exec } = require('child_process');
const { relative } = require('path')

const promisify = (fn) => {
  return (...args) => new Promise((resolve, reject) => {
    try {
      fn(...args, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

async function init() {
  const asyncExec = promisify(exec);

  const token = process.argv[2];

  const login = await asyncExec(`echo ${token} | gh auth login --with-token`);
  const info = await asyncExec(`gh pr view`);
  console.log({info, login})
}

init()
  .then((chunks) => console.log(chunks))
  .catch((err) => {
    console.log(err, "??")
    process.exit(1)
  });
