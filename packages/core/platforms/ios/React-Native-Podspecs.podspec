# This file will be updated automatically by hooks/before-prepareNativeApp.js.
require 'json'

package = JSON.parse(File.read(File.join(__dir__, '../../package.json')))

Pod::Spec.new do |s|
  s.name         = "React-Native-Podspecs"
  s.header_dir   = "ReactNativePodspecs"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platforms    = { :ios => "12.4" }

  s.source       = { :git => "https://github.com/OpenNative/open-native.git", :tag => "v#{s.version}" }
  s.source_files  = "lib_community/**/*.{h,m,mm,swift}"

  s.dependency 'React-Core'
  s.dependency 'React-RCTLinking'
  s.dependency 'react-native-module-test'
  s.dependency 'A0Auth0'
end
