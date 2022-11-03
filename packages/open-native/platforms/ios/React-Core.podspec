require 'json'

package = JSON.parse(File.read(File.join(__dir__, '../../package.json')))
version = package['version']
header_subspecs = {
  'RCTLinkingHeaders'           => 'lib_core/Libraries/LinkingIOS/*.h',
}

Pod::Spec.new do |s|
  s.name         = "React-Core"
  s.header_dir   = "React"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = "MIT"
  s.authors      = "Facebook, Inc. and its affiliates", "Ammar Ahmed", "Jamie Birch"
  s.homepage     = package['homepage']
  s.platforms    = { :ios => "12.4" }
  s.source       = { :git => "https://github.com/OpenNative/open-native.git", :tag => "v#{s.version}" }
  
  s.dependency "ReactCommon", version

  s.pod_target_xcconfig    = {
    "DEFINES_MODULE" => "YES",
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++17",
  }
  s.user_target_xcconfig   = {
    "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/Headers/Private/React-Core\"",
  }
  s.default_subspec        = "Default"

  s.subspec "Default" do |ss|
    ss.source_files           = "lib_core/React/**/*.{c,h,m,mm,S,cpp}"
  end

  # Add a subspec containing just the headers for each
  # pod that should live under <React/*.h>
  header_subspecs.each do |name, headers|
    s.subspec name do |ss|
      ss.source_files = headers
      ss.dependency "React-Core/Default"
    end
  end
end
