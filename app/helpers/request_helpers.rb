# frozen_string_literal: true

module RequestHelpers
  def api_response_format(format = Mime[:json])
    request.headers['Accept'] = "#{request.headers['Accept']},#{format}"
    request.headers['Content-Type'] = format.to_s
  end

  def api_request_headers
    api_response_format
    # https://github.com/rails/rails/blob/c60be72c5243c21303b067c9c5cc398111cf48c8/actionpack/lib/action_controller/metal/request_forgery_protection.rb#L194
    request.headers['X-CSRF-Token'] = SecureRandom.base64(32)
  end
end
