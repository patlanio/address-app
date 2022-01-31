# frozen_string_literal: true

class Address < ApplicationRecord
  belongs_to :country

  validates :street, :ext_num, :zipcode, :neighborhood, :city, :state, presence: true, allow_nil: false, allow_blank: false
  validates :zipcode, length: { is: 5 }, if: :mexico?
  validates :zipcode, length: { is: 8 }, if: :brasil?

  def mexico?
    country.present? && country.code == 'MX'
  end

  def brasil?
    country.present? && country.code == 'BR'
  end
end
