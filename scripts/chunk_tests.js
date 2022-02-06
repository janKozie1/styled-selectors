const { exec } = require('child_process');
const { } = require('path')

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
  console.log(process.argv);

  const asyncExec = promisify(exec);
  const testFiles = await Promise.all((await asyncExec('yarn test:list'))
    .split('\n')
    .filter((filePath) => filePath.includes("src"))
    .map(async (filePath) => {
      console.log({filePath})
      const amountOfAwaits = await asyncExec(`grep -c " await " ${filePath}`);
      console.log({filePath, amountOfAwaits})
    }))
}

init()
  .then((chunks) => console.log(chunks))
  .catch((err) => {
    console.log(err, "??")
    process.exit(1)
  });
