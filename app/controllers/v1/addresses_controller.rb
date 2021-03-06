# frozen_string_literal: true

class V1::AddressesController < ApplicationController
  before_action :set_address, only: %i[show update destroy]
  before_action :set_country, only: %i[update], if: :country_changed?

  def index
    @addresses = Address.all
    render jsonapi: @addresses
  end

  def show
    render jsonapi: @address
  end

  def create
    @address = Address.new(address_params.except(:country))
    set_country

    if @address.save!
      render jsonapi: @address
    else
      render json: @address.errors, status: :bad_request
    end
  end

  def update
    if @address.update(address_params.except(:country))
      render jsonapi: @address
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

  def set_country
    @country = Country.find_by_code(address_params[:country])
    @address.country = @country
  end

  def country_changed?
    country = address_params[:country]
    country.present? && @address.country.code != country
  end
end
