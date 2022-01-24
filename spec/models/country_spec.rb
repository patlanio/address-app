require 'rails_helper'

RSpec.describe Country, type: :model do
  let(:country) do
    described_class.new(
      name: 'Mexico',
      flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/200px-Flag_of_Mexico.svg.png',
      postalApiUrl: 'https://api-sepomex.hckdrk.mx'
    )
  end

  it 'is invalid without valid attributes' do
    expect(described_class.new).not_to be_valid
  end

  it 'is invalid with blank name' do
    country.name = ''
    country.valid?
    expect(country.errors[:name]).to eq(["can't be blank"])
  end

  it 'is invalid with blank postal api url' do
    country.postalApiUrl = ''
    country.valid?
    expect(country.errors[:postalApiUrl]).to eq(['is invalid', "can't be blank"])
  end

  it 'is invalid with bad formatted postal api url' do
    country.postalApiUrl = 'sepomex.com/api'
    country.valid?
    expect(country.errors[:postalApiUrl]).to eq(['is invalid'])
  end

  it 'is invalid with blank flag url' do
    country.flagUrl = ''
    country.valid?
    expect(country.errors[:flagUrl]).to eq(['is invalid', "can't be blank"])
  end

  it 'is invalid with bad formatted flag url' do
    country.flagUrl = 'flag.png'
    country.valid?
    expect(country.errors[:flagUrl]).to eq(['is invalid'])
  end

  it 'is valid with valid attributes' do
    expect(country).to be_valid
  end
end
