# frozen_string_literal: true

class V1::AddressesController < ApplicationController
  before_action :set_address, only: %i[show update destroy]

  def index
    @addresses = Address.all
    render jsonapi: @addresses
  end

  def show
    render jsonapi: @address
  end

  def create
    @country = Country.find_by_name(address_params[:country])

    address = Address.new(address_params.except(:country))
    address.country = @country

    if address.save!
      render json: address
    else
      render json: address.errors, status: :bad_request
    end
  end

  def update
    @country = Country.find_by_name(address_params[:country])
    @address.country = @country

    if @address.save!
      render json: @address
    else
      render json: @address.errors, status: :bad_request
    end
  end

  def destroy
    @address.destroy
    head :no_content
  end

  def neighborhoods
    permitted_params = params.permit(:country, :zipcode)
    neighborhoods = ::NeighborhoodsService.get(permitted_params[:country], permitted_params[:zipcode])
    render json: neighborhoods
  end

  private

  def address_params
    params.permit(:street, :ext_num, :int_num, :neighborhood, :city, :state, :zipcode, :country)
  end

  def set_address
    @address = Address.find(params[:id])
  end
end
