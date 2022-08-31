# demo-react-native

A simple React Native demo app to help develop the React Native native modules used in this monorepo.

## Getting started

Instructions assume that your working directory is this directory.

```sh
# Prerequisite, if you're running iOS and haven't installed the pods yet:
npx pod-install

# Run iOS or Android via nx:
nx run demo-react-native:run-ios
nx run demo-react-native:run-android

# Or run Android via yarn:
yarn ios
yarn android
```

See `project.json` for the full set of available commands.

## About the dependencies

Hoisting dependencies is ideal in a monorepo where possible, so you'll see a lot of packages referenced by `file:` paths in `package.json`.

However, I was unable to hoist `react-native`. This is because `react-native/scripts/packager.sh` ends up setting PROJECT_ROOT as the monorepo, not this app itself. This is because it climbs up from node_modules/react-native to whichever holds the node_modules.

Thus, when `@react-community/cli` is run, its CWD becomes that PROJECT_ROOT, and it starts bundling using all the wrong paths (e.g. it digs through both `dist/packages` and `packages` at the same time, getting confused by their duplicate package names and the fact that we have a package also named `react-native`).

We could work around this by putting a `metro.config.js` in the root of our monorepo to amend the paths, or using our own modified `packager.sh` instead, but the most self-contained way to do it is simply to give up on hoisting the `react-native` dependency.
