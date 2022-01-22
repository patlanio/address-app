Rails.application.routes.draw do
  root 'static#index'

  namespace :v1, defaults: { format: 'json'} do
    get 'countries', to: 'countries#index'
  end
end
