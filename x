name: GitHub Actions Demo
on: [push]
jobs:
  Lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version-file: '.nvmrc'
      - run: yarn install
      - run: yarn test