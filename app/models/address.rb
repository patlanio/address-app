# frozen_string_literal: true

class Address < ApplicationRecord
  belongs_to :country

  validates :street, :ext_num, :zipcode, :neighborhood, :city, :state, presence: true, allow_nil: false, allow_blank: false
end
