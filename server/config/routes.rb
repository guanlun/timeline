Server::Application.routes.draw do
  get 'timeline/get_all_events'
  post 'timeline/add_event'
  post 'timeline/update_event_attr'

  get 'timeline/get_all_periods'
  post 'timeline/add_period'
  post 'timeline/update_period_attr'
end
