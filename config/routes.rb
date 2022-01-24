Rails.application.routes.draw do
  root 'static#index'

  namespace :v1, defaults: { format: 'json'} do
    get 'countries', to: 'countries#index'
    resources :addresses do
      get :neighborhoods, on: :collection
    end
  end
end
