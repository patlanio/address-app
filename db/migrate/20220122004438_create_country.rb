class CreateCountry < ActiveRecord::Migration[6.1]
  def change
    create_table :countries do |t|
      t.string :name
      t.string :flagUrl
      t.string :postalApiUrl

      t.timestamps
    end
  end
end
