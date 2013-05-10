class CreateTimelinePeriods < ActiveRecord::Migration
  def change
    create_table :timeline_periods do |t|
      t.date :start_date
      t.date :end_date
      t.string :title
      t.string :description

      t.timestamps
    end
  end
end
