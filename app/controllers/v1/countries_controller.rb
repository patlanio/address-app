# frozen_string_literal: true

class V1::CountriesController < ApplicationController
  def index
    @countries = Country.all
    render json: @countries
  end
end
