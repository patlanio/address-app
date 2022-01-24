class AddCodeAndZipLengthToCountry < ActiveRecord::Migration[6.1]
  def change
    add_column :countries, :code, :string
    add_column :countries, :ziplength, :integer
  end
end
