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


  const help = await asyncExec("ls")
  console.log({help})

  const wd = await asyncExec("pwd");
  console.log({wd})

  const g = await asyncExec(`cat ./package.json`);
  console.log({wd})
  // const testFiles = await Promise.all((await asyncExec('find ./src -name "*.spec.ts"'))
  //   .split('\n')
  //   .filter((filePath) => filePath.includes("src"))
  //   .map(async (filePath) => {
  //     const parsedPath = relative(wd, filePath);
  //     console.log({filePath, parsedPath})

  //     const amountOfAwaits = await asyncExec(`grep -c "hehe" ${filePath}`)
  //       .catch((err) => console.log({err}));
  //     console.log({filePath, amountOfAwaits})
  //   }))
}

init()
  .then((chunks) => console.log(chunks))
  .catch((err) => {
    console.log(err, "??")
    process.exit(1)
  });
