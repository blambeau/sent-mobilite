require 'webspicy'
require 'path'

Webspicy::Configuration.new(Path.dir) do |c|
  c.client = Webspicy::HttpClient
end
