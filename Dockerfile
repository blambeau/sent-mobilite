FROM ruby:2.5.1

WORKDIR /app
ADD Gemfile /app/Gemfile
ADD Gemfile.lock /app/Gemfile.lock
RUN bundle install --system

ADD . /app
RUN bundle install --system

EXPOSE 80

CMD ["bundle", "exec", "rackup", "-o", "0.0.0.0", "-p", "80"]
