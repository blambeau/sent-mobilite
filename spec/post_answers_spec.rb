require 'spec_helper'
describe Sinatra::Application, "POST /answers" do
  include Rack::Test::Methods
  include Mail::Matchers

  let (:app){ Sinatra::Application }

  before(:each) do
    Mail::TestMailer.deliveries.clear
  end

  it 'works and sends an email' do
    post '/answers/', { main: { hello: "World" } }.to_json
    expect(last_response.status).to eql(200)
    expect(app).to have_sent_email.from('info@sombreffe-en-transition.be')
    expect(app).to have_sent_email.to('mobilite@sombreffe-en-transition.be')
    expect(app).to have_sent_email.matching_body(/World/)
  end

end
