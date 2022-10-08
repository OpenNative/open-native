require 'json'

package = JSON.parse(File.read(File.join(__dir__, '../../package.json')))

Pod::Spec.new do |s|
  s.name         = "React-Core"
  s.header_dir   = "React"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platforms    = { :ios => "12.4" }

  s.source       = { :git => "https://github.com/ammarahm-ed/nativescript-magic-spells.git", :tag => "v#{s.version}" }
  s.source_files  = "lib_core/**/*.{h,m,mm,swift}"

  s.pod_target_xcconfig    = {
    "DEFINES_MODULE" => "YES",
  }
  s.user_target_xcconfig   = {
    "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/Headers/Private/React-Core\"",
  }
  s.default_subspec        = "Default"

  s.subspec "Default" do |ss|
    ss.source_files           = "React/**/*.{c,h,m,mm,S,cpp}"
  end
end
