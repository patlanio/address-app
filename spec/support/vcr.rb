require 'vcr'

VCR.configure do |c|
  c.cassette_library_dir = 'spec/fixtures/vcr_cassettes'
  c.configure_rspec_metadata!
  c.hook_into :webmock
  c.filter_sensitive_data('<MX_POSTALSERVICE_API_KEY>') { ENV['MX_POSTALSERVICE_API_KEY'] }
end
