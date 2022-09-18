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
  s.source_files  = "lib/**/*.{h,m,mm,swift}"

  s.dependency 'React-Core'
end
