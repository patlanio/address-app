# frozen_string_literal: true

class V1::HomeController < ApplicationController
  def index
    render json: {
      hola: :mundo
    }
  end
end
