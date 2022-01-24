# frozen_string_literal: true

class NeighborhoodsService
  def self.get(country, zipcode)
    public_send(country.to_s.downcase, zipcode)
  rescue StandardError
    []
  end

  def self.mexico(zipcode)
    mx = Country.find_by_name('Mexico')
    params = { cp: zipcode }
    res = get_request(mx.postalApiUrl, params)
    JSON.parse(res.parsed_response).dig('codigo_postal', 'colonias').map { |c| c['colonia'] }
  end

  def self.get_request(url, query)
    HTTParty.get(
      url,
      {
        query: query,
        headers: {
          apiKey: ''
        }
      }
    )
  end
end
