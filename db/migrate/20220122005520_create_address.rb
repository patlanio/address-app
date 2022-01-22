class CreateAddress < ActiveRecord::Migration[6.1]
  def change
    create_table :addresses do |t|
      t.string :street
      t.string :ext_num
      t.string :int_num
      t.string :zipcode
      t.string :neighborhood
      t.string :city
      t.string :state
      t.references :country, null: false, foreign_key: true

      t.timestamps
    end
  end
end
