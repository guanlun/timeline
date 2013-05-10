class ApplicationController < ActionController::Base
  before_filter :cors_preflight_check
  after_filter :cors_set_access_control_headers

  # For all responses in this controller, return the CORS access control headers.
  def cors_set_access_control_headers
    # headers['Access-Control-Allow-Origin'] = 'http://' + request.host
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Headers'] = "Overwrite, Destination, Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control, Content-Length, Accept, Accept-Charset, Accept-Encoding, Referer";
  end
  
  # If this is a preflight OPTIONS request, then short-circuit the
  # request, return only the necessary headers and return an empty
  # text/plain
  def cors_preflight_check
    if request.method == :options
      headers['Access-Control-Allow-Origin'] = "*"
      headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
      headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-Prototype-Version'
      render :text=>'', :content_type => 'text/plain'
    end
  end

  protect_from_forgery


end
