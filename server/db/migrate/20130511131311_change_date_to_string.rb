class ChangeDateToString < ActiveRecord::Migration
  def up
    remove_column :timeline_events, :date
    remove_column :timeline_periods, :date
    add_column :timeline_events, :date, :string
    add_column :timeline_periods, :date, :string
  end

  def down
    remove_column :timeline_events, :date
    remove_column :timeline_periods, :date
    add_column :timeline_events, :date, :date
    add_column :timeline_periods, :date, :date
  end
end
