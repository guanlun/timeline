class CreateTimelineEvents < ActiveRecord::Migration
  def change
    create_table :timeline_events do |t|
      t.string :title
      t.string :description
      t.date :date

      t.timestamps
    end
  end
end
