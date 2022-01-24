# frozen_string_literal: true

class StaticController < ApplicationController
  def index
    @countries = Country.all
  end
end
