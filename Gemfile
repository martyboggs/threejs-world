source 'https://rubygems.org'
#gem 'github-pages', group: :jekyll_plugins
gem 'wdm', '>= 0.1.0' if Gem.win_platform?

require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'github-pages', versions['github-pages']
gem 'tzinfo-data'
