module.exports = {
  message: 'NativeScript Plugins ~ made with ❤️  Choose a command to start...',
  pageSize: 32,
  scripts: {
    default: 'nps-i',
    nx: {
      script: 'nx',
      description: 'Execute any command with the @nrwl/cli',
    },
    format: {
      script: 'nx format:write',
      description: 'Format source code of the entire workspace (auto-run on precommit hook)',
    },
    '🔧': {
      script: `npx cowsay "NativeScript plugin demos make developers 😊"`,
      description: '_____________  Apps to demo plugins with  _____________',
    },
    // demos
    apps: {
      '...React Native...': {
        script: `npx cowsay "Let's get native ⚛️"`,
        description: ` 🔻 React Native`,
      },
      'demo-react-native': {
        clean: {
          script: 'nx run demo-react-native:clean',
          description: '⚆  Clean  🧹',
        },
        ios: {
          script: 'nx run demo-react-native:ios',
          description: '⚆  Run iOS  ',
        },
        android: {
          script: 'nx run demo-react-native:android',
          description: '⚆  Run Android  🤖',
        },
      },
      '...Vanilla...': {
        script: `npx cowsay "Nothing wrong with vanilla 🍦"`,
        description: ` 🔻 Vanilla`,
      },
      demo: {
        clean: {
          script: 'nx run demo:clean',
          description: '⚆  Clean  🧹',
        },
        ios: {
          script: 'nx run demo:ios',
          description: '⚆  Run iOS  ',
        },
        android: {
          script: 'nx run demo:android',
          description: '⚆  Run Android  🤖',
        },
      },
    },
    '⚙️': {
      script: `npx cowsay "@open-native/* packages will keep your ⚙️ cranking"`,
      description: '_____________  @open-native/*  _____________',
    },
    // packages
    // build output is always in dist/packages
    '@open-native': {
      // core
      core: {
        build: {
          script: 'nx run core:build.all',
          description: '@open-native/core: Build',
        },
      },
      // react-native-module-test
      'react-native-module-test': {
        build: {
          script: 'nx run react-native-module-test:build.all',
          description: 'react-native-module-test: Build',
        },
      },
      'build-all': {
        script: 'nx run-many --target=build.all --all',
        description: 'Build all packages',
      },
    },
    '⚡': {
      script: `npx cowsay "Focus only on source you care about for efficiency ⚡"`,
      description: '_____________  Focus (VS Code supported)  _____________',
    },
    focus: {
      core: {
        script: 'nx run core:focus',
        description: 'Focus on @open-native/core',
      },
      'react-native-module-test': {
        script: 'nx run react-native-module-test:focus',
        description: 'Focus on @react-native-module-test',
      },
      reset: {
        script: 'nx g @nativescript/plugin-tools:focus-packages',
        description: 'Reset Focus',
      },
    },
    '.....................': {
      script: `npx cowsay "That's all for now folks ~"`,
      description: '.....................',
    },
  },
};
