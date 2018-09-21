require 'rspec/core/rake_task'
RSpec::Core::RakeTask.new(:spec)

task :webspicy do
  require "webspicy"
  Webspicy::Tester.new(Path.dir/'webspicy').call
end
