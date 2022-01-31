# frozen_string_literal: true

class Country < ApplicationRecord
  has_many :address

  # tricky but works just fine: https://stackoverflow.com/questions/7167895/rails-whats-a-good-way-to-validate-links-urls
  validates :postalApiUrl, :flagUrl, format: URI::DEFAULT_PARSER.make_regexp(%w[http https])
  validates :name, :postalApiUrl, :flagUrl, presence: true, allow_nil: false, allow_blank: false
  validates :name, uniqueness: true
  validates :code, uniqueness: true
  validates :code, length: { is: 2 }
end
