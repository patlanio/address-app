require 'rails_helper'

RSpec.describe V1::AddressesController, type: :controller do
  before(:each) do
    api_request_headers
  end

  describe 'GET #index' do
    before do
      create_list(:address, 2)
      get :index
    end

    it 'responds with ok status' do
      expect(response).to have_http_status(:ok)
    end

    it 'returns 2 addresses' do
      expect(json_response[:data].size).to eq(2)
    end

    it 'returns only serialized fields' do
      fields = json_response[:data].first[:attributes].keys
      expect(fields).to eq(%i[street ext_num int_num zipcode neighborhood city state country])
    end
  end

  describe 'GET #show' do
    context 'with valid id' do
      before do
        address = create(:address)
        get :show, params: { id: address.id }
      end

      it 'responds with ok status' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns only serialized fields' do
        fields = json_response[:data][:attributes].keys
        expect(fields).to eq(%i[street ext_num int_num zipcode neighborhood city state country])
      end
    end

    context 'with invalid id' do
      before do
        get :show, params: { id: 1 }
      end

      it 'returns not_found error' do
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'POST #create' do
    context 'with valid data' do
      before do
        create(:country)
        post :create, params: {
          street: 'Morelos',
          ext_num: '789',
          int_num: 'C',
          zipcode: '81200',
          neighborhood: 'Centro',
          city: 'Los Mochis',
          state: 'Sinaloa',
          country: 'MX'
        }
      end

      it 'responds with ok status' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns only serialized fields' do
        fields = json_response[:data][:attributes].keys
        expect(fields).to eq(%i[street ext_num int_num zipcode neighborhood city state country])
      end
    end

    context 'with invalid data' do
      before do
        create(:country)
        post :create, params: {
          street: '',
          ext_num: '',
          int_num: '',
          zipcode: '',
          neighborhood: '',
          city: '',
          state: '',
          country: ''
        }
      end

      it 'responds with unprocessable_entity status' do
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'return hash with errors by field' do
        expect(json_response).to eq({
          country: ['must exist'],
          street: ["can't be blank"],
          ext_num: ["can't be blank"],
          zipcode: ["can't be blank"],
          neighborhood: ["can't be blank"],
          city: ["can't be blank"],
          state: ["can't be blank"]
        })
      end
    end
  end

  describe 'PUT #update' do
    context 'with valid data' do
      before do
        create(:country)
        address = create(:address)
        put :update, params: { id: address.id, street: 'Independencia', zipcode: '33333' }
      end

      it 'responds with ok status' do
        expect(response).to have_http_status(:ok)
      end

      it 'updates address correctly' do
        expect(json_response[:data][:attributes].slice(:street, :zipcode)).to eq({ street: 'Independencia', zipcode: '33333' })
      end

      it 'returns only serialized fields' do
        fields = json_response[:data][:attributes].keys
        expect(fields).to eq(%i[street ext_num int_num zipcode neighborhood city state country])
      end
    end

    context 'with valid data' do
      before do
        create(:country)
        address = create(:address)
        put :update, params: {
          id: address.id,
          street: 'Revolucion',
          zipcode: ''
        }
      end

      it 'responds with bad_request status' do
        expect(response).to have_http_status(:bad_request)
      end

      it 'return hash with errors by field' do
        expect(json_response).to eq({
          zipcode: ["can't be blank", 'is the wrong length (should be 5 characters)']
        })
      end
    end

    context 'when country changes' do
      before do
        create(:country)
        create(:country, :brasil)
        address = create(:address)
        put :update, params: {
          id: address.id,
          country: 'BR'
        }
      end

      it 'validates zipcode length with new country number' do
        br = Country.find_by_code('BR')
        expect(json_response).to eq({
          zipcode: ["is the wrong length (should be #{br.ziplength} characters)"]
        })
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'with valid id' do
      it 'responds with no_content status' do
        address = create(:address)
        delete :destroy, params: { id: address.id }
        expect(response).to have_http_status(:no_content)
      end

      it 'deletes the address correctly' do
        address = create(:address)
        expect {
          delete :destroy, params: { id: address.id }
        }.to change(Address, :count).by(-1)
      end
    end

    context 'with invalid id' do
      before do
        delete :destroy, params: { id: 1 }
      end

      it 'returns not_found error' do
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
