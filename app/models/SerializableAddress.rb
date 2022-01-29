# frozen_string_literal: true

class SerializableAddress < JSONAPI::Serializable::Resource
  type 'address'

  attributes :street, :ext_num, :int_num, :zipcode, :neighborhood, :city, :state

  attribute :country do
    @object.country.code
  end
end
