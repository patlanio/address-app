Rails.application.routes.draw do
  namespace :v1, defaults: { format: 'json'} do
    get 'home', to: 'home#index'
  end
end
