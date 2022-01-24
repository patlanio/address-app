# frozen_string_literal: true

class V1::AddressesController < ApplicationController
  def index
    @addresses = Address.all
    render json: @addresses
  end

  def neighborhoods
    permitted_params = params.permit(:country, :zipcode)
    neighborhoods = ::NeighborhoodsService.get(permitted_params[:country], permitted_params[:zipcode])
    render json: neighborhoods
  end
end
