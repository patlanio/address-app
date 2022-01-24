require 'rails_helper'

RSpec.describe Address, type: :model do
  let(:mexico) { Country.create!(name: 'Mexico', postalApiUrl: 'https://flag.com/mx.png', flagUrl: 'https://flag.com') }
  let(:address) do
    described_class.new(
      street: 'Juarez',
      ext_num: '123',
      int_num: 'A',
      zipcode: '64000',
      neighborhood: 'Centro',
      city: 'Monterrey',
      state: 'Nuevo Leon',
      country: mexico
    )
  end

  it 'is invalid without valid attributes' do
    expect(described_class.new).not_to be_valid
  end

  it 'is invalid with blank street' do
    address.street = ''
    address.valid?
    expect(address.errors[:street]).to eq(["can't be blank"])
  end

  it 'is invalid with blank ext_num' do
    address.ext_num = ''
    address.valid?
    expect(address.errors[:ext_num]).to eq(["can't be blank"])
  end

  it 'is invalid with blank zipcode' do
    address.zipcode = ''
    address.valid?
    expect(address.errors[:zipcode]).to eq(["can't be blank"])
  end

  it 'is invalid with blank neighborhood' do
    address.neighborhood = ''
    address.valid?
    expect(address.errors[:neighborhood]).to eq(["can't be blank"])
  end

  it 'is invalid with blank city' do
    address.city = ''
    address.valid?
    expect(address.errors[:city]).to eq(["can't be blank"])
  end

  it 'is invalid with blank state' do
    address.state = ''
    address.valid?
    expect(address.errors[:state]).to eq(["can't be blank"])
  end

  it 'is invalid without country' do
    address.country = nil
    address.valid?
    expect(address.errors[:country]).to eq(['must exist'])
  end

  it 'is valid with valid attributes' do
    expect(address).to be_valid
  end
end
