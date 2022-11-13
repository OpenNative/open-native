Pod::Spec.new do |s|
  s.name         = "NativeScript"
  s.version      = '1.0.0'
  s.summary      = "description"
  s.license      = "MIT"

  s.authors      = "Facebook, Inc. and its affiliates", "Ammar Ahmed", "Jamie Birch"
  s.homepage     = "https://github.com/OpenNative/open-native"
  s.platforms    = { :ios => "12.4" }
  s.source       = { :git => "https://github.com/OpenNative/open-native.git", :tag => "v1.0.0" }
  s.preserve_paths         = "package.json", "LICENSE-react-native"
  s.cocoapods_version      = ">= 1.10.1"
  s.vendored_frameworks = "NativeScript.xcframework"

  s.subspec 'v8runtime' do |ss|
    ss.xcconfig = { 'USER_HEADER_SEARCH_PATHS' => '"${PODS_SRC_ROOT}/Headers/v8runtime/*.{h}' }
    ss.source_files               = "Headers/v8runtime/*.h"
    ss.header_dir = "v8runtime"
  end

  s.subspec 'jsi' do |ss|
    ss.xcconfig = { 'USER_HEADER_SEARCH_PATHS' => '"${PODS_SRC_ROOT}/Headers/jsi/*.{h}' }
    ss.source_files               = "Headers/jsi/*.h"
    ss.header_dir = "jsi"
  end

  s.subspec 'runtime' do |ss|
    ss.xcconfig = { 'USER_HEADER_SEARCH_PATHS' => '"${PODS_SRC_ROOT}/Headers/runtime/**/*.{h}' }
    ss.source_files               = "Headers/runtime/**/*.h"
    ss.header_dir = "runtime"
  end

  s.subspec 'include' do |ss|
    ss.xcconfig = { 'USER_HEADER_SEARCH_PATHS' => '"${PODS_SRC_ROOT}/Headers/include/**/*.{h}' }
    ss.source_files               = "Headers/include/*.h"
  end

  s.subspec 'cppgc' do |ss|
    ss.xcconfig = { 'USER_HEADER_SEARCH_PATHS' => '"${PODS_SRC_ROOT}/Headers/include/cppgc/*.{h}' }
    ss.source_files               = "Headers/include/cppgc/*.h"
    ss.header_dir = "cppgc"
  end

  s.subspec 'inspector' do |ss|
    ss.xcconfig = { 'USER_HEADER_SEARCH_PATHS' => '"${PODS_SRC_ROOT}/Headers/include/inspector/*.{h}' }
    ss.source_files               = "Headers/include/inspector/*.h"
    ss.header_dir = "inspector"
  end

  s.subspec 'libffi' do |ss|
    ss.xcconfig = { 'USER_HEADER_SEARCH_PATHS' => '"${PODS_SRC_ROOT}/Headers/include/libffi/*.{h}' }
    ss.source_files               = "Headers/include/libffi/*.h"
    ss.header_dir = "libffi"
  end

  s.subspec 'libplatform' do |ss|
    ss.xcconfig = { 'USER_HEADER_SEARCH_PATHS' => '"${PODS_SRC_ROOT}/Headers/include/libplatform/*.{h}' }
    ss.source_files               = "Headers/include/libplatform/*.h"
    ss.header_dir = "libplatform"
  end

end