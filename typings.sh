# Change directory to root of monorepo (where this file is)
cd "$(dirname "${BASH_SOURCE[0]}")"

cd apps/demo/ && ns typings android --aar ../../packages/core/platforms/android/react.aar && rm -rf ../../packages/core/typings/android &&  cp -r typings/android ../../packages/core/typings && cd ../../