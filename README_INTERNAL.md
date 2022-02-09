# Releasing

1. Merge feature branches, bug fixes, and whatever changes into `master` after CI passes and PRs are approved
1. Create a new branch off `master` when you're ready to release a new version
1. On this branch run `npm version [...]` (see `npm-version` [docs](https://docs.npmjs.com/cli/v7/commands/npm-version) for more info) which will bump the version in `package.json` and make a tag (for example `npm version patch -m "Bump for 3.1.2"`). Follow [SemVer rules](https://semver.org/) for patch/minor/major.
1. Push the version commit and the tag `git push && git push --tags origin`
1. Open Pull Request, "Rebase and merge" after approved
1. Create a new release in the Github UI, give the release a name and add release notes (creating the release will kick off npm publish)
1. Checkout the `master` branch and pull the latest by running `git checkout master && git pull`
1. Publish the new version to npmjs.com using the `npm publish` command
