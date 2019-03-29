require 'sinatra'
require 'mail'
require 'json'

set :raise_errors, true
set :show_exceptions, false

Mail.defaults do
  if ENV['MAILER_HOST']
    delivery_method :smtp, {
      address: ENV['MAILER_HOST'],
      port: ENV['MAILER_PORT'],
      domain: ENV['MAILER_DOMAIN'],
      user_name: ENV['MAILER_USER'],
      password: ENV['MAILER_PASSWORD']
    }
  else
    delivery_method :test
  end
end

## Mobilite

get '/' do
  redirect "/sondage/"
end

get '/sondage' do
  redirect "/sondage/"
end

get '/sondage/' do
  send_file File.join(settings.public_folder, 'sondage/index.html')
end

post '/sondage/answers/' do
  data = JSON.parse(request.body.read)
  mail = Mail.new do
    from    'blambeau@enspirit.be'
    to      'mobilite@sombreffe-en-transition.be'
    subject 'Réponse au sondage'
    body    JSON.pretty_generate(data)
  end
  mail.deliver
  200
end

## ICS

get '/inscription' do
  redirect "/inscription/"
end

get '/inscription/' do
  send_file File.join(settings.public_folder, 'ics/index.html')
end

post '/inscription/inscriptions/' do
  data = JSON.parse(request.body.read)
  mail = Mail.new do
    from    'blambeau@enspirit.be'
    to      'incroyables-comestibles@sombreffe-en-transition.be'
    subject 'Fiche ICS remplie en ligne'
    body    JSON.pretty_generate(data)
  end
  mail.deliver
  204
end
