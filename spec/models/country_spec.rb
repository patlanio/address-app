require 'rails_helper'

RSpec.describe Country, type: :model do
  let(:country) { create(:country) }

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

  it 'is uniq through name' do
    new_country = described_class.new(name: country.name, code: 'ZZ')
    new_country.valid?
    expect(new_country.errors[:name]).to eq(['has already been taken'])
  end

  it 'is uniq through code' do
    new_country = described_class.new(code: country.code, name: 'Hoenn')
    new_country.valid?
    expect(new_country.errors[:code]).to eq(['has already been taken'])
  end

  it 'is invalid when code length is not 2' do
    country.code = 'USA'
    country.valid?
    expect(country.errors[:code]).to eq(['is the wrong length (should be 2 characters)'])
  end
end
