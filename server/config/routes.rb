Server::Application.routes.draw do
  get 'timeline/get_all_events'
  get 'timeline/add_event'
  get 'timeline/get_all_periods'
  get 'timeline/add_period'
end
