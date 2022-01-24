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
    response = get_request(mx.postalApiUrl, params)
    data = JSON.parse(response.parsed_response)['codigo_postal']

    {
      city: data['municipio'],
      state: data['estado'],
      neighborhoods: data['colonias'].map { |c| c['colonia'] }
    }
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
