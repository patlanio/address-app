# frozen_string_literal: true

class V1::AddressesController < ApplicationController
  def index
    @addresses = Address.all
    render json: @addresses
  end

  def create
    permitted_params = params.permit(:street, :ext_num, :int_num, :neighborhood, :city, :state, :zipcode, :country)
    @country = Country.find_by_name(permitted_params[:country])

    address = Address.new(permitted_params.except(:country))
    address.country = @country

    if address.save!
      render json: address
    else
      render json: address.errors, status: :bad_request
    end
  end

  def neighborhoods
    permitted_params = params.permit(:country, :zipcode)
    neighborhoods = ::NeighborhoodsService.get(permitted_params[:country], permitted_params[:zipcode])
    render json: neighborhoods
  end
end
