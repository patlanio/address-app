FactoryBot.define do
  factory :country do
    name { 'Mexico' }
    code { 'MX' }
    flagUrl { 'https://flags.com/200px-Flag_of_Mexico.svg.png' }
    postalApiUrl { 'https://sepomex.razektheone.com/codigo_postal' }
    ziplength { 5 }
    initialize_with { Country.find_or_create_by(code: code) }

    trait :brasil do
      name { 'Brasil' }
      code { 'BR' }
      flagUrl { 'https://flags.com/200px-Brasil_flag_icon.png' }
      postalApiUrl { 'https://brasilapi.com.br/api/cep/v2/' }
      ziplength { 8 }
    end
  end
end
