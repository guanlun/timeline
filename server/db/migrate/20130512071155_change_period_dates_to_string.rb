class ChangePeriodDatesToString < ActiveRecord::Migration
  def up
    remove_column :timeline_periods, :date

    remove_column :timeline_periods, :start_date
    add_column :timeline_periods, :start_date, :string
    remove_column :timeline_periods, :end_date
    add_column :timeline_periods, :end_date, :string
  end

  def down
    remove_column :timeline_periods, :start_date
    add_column :timeline_periods, :start_date, :date
    remove_column :timeline_periods, :end_date
    add_column :timeline_periods, :end_date, :date
  end
end
