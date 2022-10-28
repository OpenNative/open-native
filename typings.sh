# Change directory to root of monorepo (where this file is)
cd "$(dirname "${BASH_SOURCE[0]}")"

cd apps/demo/ && ns typings android --aar ../../dist/packages/open-native/platforms/android/react.aar && rm -rf ../../packages/open-native/typings &&  cp -r typings ../../packages/open-native/ && cd ../../