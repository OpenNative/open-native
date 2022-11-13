require 'json'

package = JSON.parse(File.read(File.join(__dir__, '../../package.json')))
version = package['version']

Pod::Spec.new do |s|
  s.name         = "ReactCommon"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = "MIT"

  s.authors      = "Facebook, Inc. and its affiliates", "Ammar Ahmed", "Jamie Birch"
  s.homepage     = package['homepage']
  s.platforms    = { :ios => "12.4" }

  s.source       = { :git => "https://github.com/OpenNative/open-native.git", :tag => "v#{s.version}" }
  s.preserve_paths         = "package.json", "LICENSE-react-native"
  s.cocoapods_version      = ">= 1.10.1"
  s.source_files  = "lib_common/**/*.{h,m,mm,swift}"

  s.dependency "NativeScript"
  
end