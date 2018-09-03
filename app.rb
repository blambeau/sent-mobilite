require 'sinatra'

get '/' do
  redirect '/sondage/'
end

get '/sondage/' do
  send_file File.join(settings.public_folder, 'sondage/index.html')
end
