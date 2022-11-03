# Change directory to root of monorepo (where this file is)
cd "$(dirname "${BASH_SOURCE[0]}")"

cd apps/demo/ && ns typings android --aar ../../dist/packages/core/platforms/android/react.aar && rm -rf ../../packages/core/typings &&  cp -r typings ../../packages/core/ && cd ../../