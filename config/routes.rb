Rails.application.routes.draw do
  namespace :v1, defaults: { format: 'json'} do
    get 'countries', to: 'countries#index'
    resources :addresses do
      get :neighborhoods, on: :collection
    end
  end

  get '*page', to: 'static#index', constrains: ->(req) do
    !req.xhr? && req.format.html?
  end

  root 'static#index'
end
