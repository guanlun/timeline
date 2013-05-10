class TimelineController < ApplicationController
  def get_all_events
    events = TimelineEvent.all.sort_by do |e|
      e.date
    end

    render :json => events
  end

  def get_all_periods
    periods = TimelinePeriod.all

    render :json => periods
  end

  def add_event
    title = params[:title]
    description = params[:description]
    date = Date.parse params[:date]

    event = TimelineEvent.new :title => title, :description => description, :date => date

    if event.save
      render :text => 'ok'
    else
      render :text => 'error'
    end
  end

  def add_period
    title = params[:title]
    description = params[:description]
    start_date = Date.parse params[:start_date]
    end_date = Date.parse params[:end_date]

    period = TimelinePeriod.new :title => title, :description => description, 
      :start_date => start_date, :end_date => end_date

    if period.save
      render :text => 'ok'
    else
      render :text => 'error'
    end
  end
end
