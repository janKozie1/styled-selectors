const { exec } = require('child_process');

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

  asyncExec('pwd').then((result) => console.log(result))

  asyncExec('find ./src -name "*.spec.ts"')
    .then((result) => console.log(result))
    .catch((err) => console.log(err))
}

init();
