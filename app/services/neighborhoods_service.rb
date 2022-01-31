# frozen_string_literal: true

class NeighborhoodsService
  def self.get(country, zipcode)
    public_send(country.to_s.downcase, zipcode)
  rescue StandardError
    { city: '', state: '', neighborhoods: [] }
  end

  def self.mexico(zipcode)
    response = mexico_request(zipcode)
    data = JSON.parse(response.parsed_response)['codigo_postal']

    {
      city: data['municipio'],
      state: data['estado'],
      neighborhoods: data['colonias'].map { |c| c['colonia'] }
    }
  end

  def self.brasil(zipcode)
    br = Country.find_by_name('Brasil')
    data = HTTParty.get("#{br.postalApiUrl}#{zipcode}").parsed_response

    {
      city: data['city'],
      state: data['state'],
      neighborhoods: [data['neighborhood']]
    }
  end

  def self.mexico_request(zipcode)
    mx = Country.find_by_name('Mexico')
    HTTParty.get(
      mx.postalApiUrl,
      {
        query: { cp: zipcode },
        headers: {
          apiKey: ENV['MX_POSTALSERVICE_API_KEY']
        }
      }
    )
  end

  singleton_class.send(:alias_method, :mx, :mexico)
  singleton_class.send(:alias_method, :br, :brasil)
end
