FactoryBot.define do
  factory :address do
    street { 'Juarez' }
    ext_num { '123' }
    int_num { 'A' }
    zipcode { '64000' }
    neighborhood { 'Centro' }
    city { 'Monterrey' }
    state { 'Nuevo Leon' }
    association :country

    trait :brasil do
      street { 'Ronaldinho' }
      ext_num { '456' }
      int_num { 'B' }
      zipcode { '89010025' }
      neighborhood { 'Centro' }
      city { 'Blumenau' }
      state { 'SC' }

      association :country, factory: %i[brasil]
    end
  end
end
