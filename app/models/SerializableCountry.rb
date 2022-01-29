# frozen_string_literal: true

class SerializableCountry < JSONAPI::Serializable::Resource
  type 'country'

  attributes :name, :code, :flagUrl
end
