const defaultExec = require('child_process').exec;

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

const exec = promisify(defaultExec);

const getPRBranches = async () => {
  const { baseRefName, headRefName } = JSON.parse(await exec(`gh pr view  --json baseRefName,headRefName`));
  return { to: baseRefName, from: headRefName }
}

const fetchBaseBranch = async (baseBranch) => {
  const addBaseRefs = `git config --add remote.origin.fetch +refs/heads/${baseBranch}:refs/remotes/origin/${baseBranch}`;
  const fetchBase = `git fetch --no-tags origin +refs/heads/${baseBranch}:refs/remotes/origin/${baseBranch}`;
  const command = `${addBaseRefs} && ${fetchBase}`;

  await exec(command);
}


const main = async() => {
  const token = process.argv[2];
  await exec(`echo ${token} | gh auth login --with-token`);

  const branches = await getPRBranches();
  await fetchBaseBranch(branches.to)

  console.log(`git merge-base ${branches.to} ${branches.from}`)
}

main()
  .then((chunks) => console.log(chunks))
  .catch((err) => {
    console.log(err, "??")
    process.exit(1)
  });
