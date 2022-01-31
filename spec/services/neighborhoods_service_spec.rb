require 'rails_helper'

RSpec.describe NeighborhoodsService, :vcr do
  describe '#get' do
    context 'when Mexico' do
      before do
        create(:country)
      end

      it 'returns neighborhoods, city and state data' do
        response = described_class.get(:mexico, '64000')

        expect(response).to eq({
          city: 'MONTERREY',
          neighborhoods: ['La Finca', 'Monterrey Centro'],
          state: 'NUEVO LEON'
        })
      end
    end

    context 'when Brasil' do
      before do
        create(:country, :brasil)
      end

      it 'returns neighborhoods, city and state data' do
        response = described_class.get(:brasil, '89010025')

        expect(response).to eq({
          city: 'Blumenau',
          neighborhoods: ['Centro'],
          state: 'SC'
        })
      end
    end

    context 'with unregistered country' do
      it 'does not raises an error' do
        expect { described_class.get(:hoenn, '64000') }.not_to raise_error
      end

      it 'returns default response' do
        response = described_class.get(:hoenn, '64000')
        expect(response).to eq({ city: '', state: '', neighborhoods: [] })
      end
    end

    context 'with invalid zipcode' do
      before do
        create(:country)
      end

      it 'does not raises an error' do
        expect { described_class.get(:mexico, 'INVALID_POSTAL_CODE') }.not_to raise_error
      end

      it 'returns default response' do
        response = described_class.get(:mexico, 'INVALID_POSTAL_CODE')
        expect(response).to eq({ city: '', state: '', neighborhoods: [] })
      end
    end
  end
end
