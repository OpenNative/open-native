# Change directory to root of monorepo (where this file is)
cd "$(dirname "${BASH_SOURCE[0]}")"

cd apps/demo/ && ns typings android --aar ../../packages/react-native/platforms/android/react.aar && rm -rf ../../packages/react-native/typings &&  cp -r typings ../../packages/react-native/ && cd ../../