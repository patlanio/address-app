require 'rails_helper'

RSpec.describe V1::CountriesController, type: :controller do
  before do
    api_request_headers
  end

  describe 'GET #index' do
    before do
      create(:country)
      create(:country, :brasil)
      get :index
    end

    it 'responds with ok status' do
      expect(response).to have_http_status(:ok)
    end

    it 'returns 2 countries' do
      expect(json_response[:data].size).to eq(2)
    end

    it 'returns only serialized fields' do
      fields = json_response[:data].first[:attributes].keys
      expect(fields).to eq(%i[name code flagUrl])
    end
  end
end
