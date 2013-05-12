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
    date = params[:date]

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
    start_date = params[:start_date]
    end_date = params[:end_date]

    period = TimelinePeriod.new :title => title, :description => description, 
      :start_date => start_date, :end_date => end_date

    if period.save
      render :text => 'ok'
    else
      render :text => 'error'
    end
  end

  def update_event_attr
    event = TimelineEvent.find(params[:id])
    if event.update_attributes(params[:attr] => params[:value])
      render :text => 'ok'
    else
      render :text => 'error'
    end
  end

  def update_period_attr
    period = TimelinePeriod.find(params[:id])
    if period.update_attributes(params[:attr] => params[:value])
      render :text => 'ok'
    else
      render :text => 'error'
    end
  end
end
