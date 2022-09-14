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

  s.source       = { :git => "https://github.com/ammarahm-ed/nativescript-magic-spells.git", :tag => "v#{s.version}" }
  s.source_files  = "lib/**/*.h"

  s.pod_target_xcconfig    = {
    "DEFINES_MODULE" => "YES",
  }
  s.user_target_xcconfig   = {
    "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/Headers/Private/React-Native-Podspecs\"",
  }
  s.dependency 'React-Core'
end
