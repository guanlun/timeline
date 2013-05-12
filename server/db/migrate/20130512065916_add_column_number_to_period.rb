class AddColumnNumberToPeriod < ActiveRecord::Migration
  def up
    add_column :timeline_periods, :col_no, :integer
  end

  def down
    remove_column :timeline_periods, :col_no
  end
end
