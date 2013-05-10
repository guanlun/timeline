class TimelineEvent < ActiveRecord::Base
  attr_accessible :date, :description, :title
end
