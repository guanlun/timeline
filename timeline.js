var events = [ ];
var periods = [ ];

Event = function(id, title, date, description) {
    this.id = id;
    this.title = title;
    this.date = date;
    this.description = description;

    this.dom = $('<div class="event_item"></div>');
    this.title_el = $('<div class="event_item_title" contenteditable>' 
            + this.title + '</div>');
    this.date_el = $('<div class="event_item_date" contenteditable>' 
            + this.date + '</div>');
    this.description_el = $('<div class="event_item_description" contenteditable>' 
            + this.description + '</div>');

    this.dom.append(this.title_el);
    this.dom.append(this.date_el);
    this.dom.append(this.description_el);

    this.title_el.blur(function() {
        updateAttr('event', this.id, 'title', this.title_el.html());
    }.bind(this));

    this.date_el.blur(function() {
        updateAttr('event', this.id, 'date', this.date_el.html());
    }.bind(this));

    this.description_el.blur(function() {
        updateAttr('event', this.id, 'description', this.description_el.html());
    }.bind(this));
}

Event.prototype.toDom = function() {
    return this.dom;
}

Period = function(id, title, start_date, end_date, description) {
    this.id = id;
    this.title = title;
    this.start_date = start_date;
    this.end_date = end_date;
    this.description = description;

    this.dom = $('<div class="period_item"></div>');
    this.title_el = $('<div class="period_item_title" contenteditable>' 
            + this.title + '</div>');
    this.start_date_el = $('<div class="period_item_start_date" contenteditable>' 
            + this.start_date + '</div>');
    this.end_date_el = $('<div class="period_item_end_date" contenteditable>' 
            + this.end_date + '</div>');
    this.description_el = $('<div class="period_item_description" contenteditable>' 
            + this.description + '</div>');

    this.dom.append(this.title_el);
    this.dom.append(this.start_date_el);
    this.dom.append(this.end_date_el);
    this.dom.append(this.description_el);

    this.title_el.blur(function() {
        updateAttr('period', this.id, 'title', this.title_el.html());
    }.bind(this));

    this.start_date_el.blur(function() {
        updateAttr('period', this.id, 'start_date', this.start_date_el.html());
    }.bind(this));

    this.end_date_el.blur(function() {
        updateAttr('period', this.id, 'end_date', this.end_date_el.html());
    }.bind(this));

    this.description_el.blur(function() {
        updateAttr('period', this.id, 'description', this.description_el.html());
    }.bind(this));
}

Period.prototype.toDom = function() {
    return this.dom;
    /*
    return $('<div class="period_item"><div class="period_item_title">'
        + this.title + '</div><div class="period_item_start_date">'
        + this.start_date + '</div><div class="period_item_end_date">'
        + this.end_date + '</div><div class="period_description">'
        + this.description + '</div></div>');
        */
}

$(function() {
    processMonthAndDate = function(md) {
        if (md.length == 1) {
            md = '0' + md;
        }
        return md;
    }

    formatDate = function(orig_str) {
        var date_arr, year, month, date;
        if (date_arr = orig_str.match(/(\d+)\ (\d+)\ (\d+)/)) {
            year = date_arr[1];
            month = processMonthAndDate(date_arr[2]);
            date = processMonthAndDate(date_arr[3]);

            return year + '-' + month + '-' + date;
        } else if (date_arr = orig_str.match(/(\d+)\ (\d+)/)) {
            year = date_arr[1];
            month = processMonthAndDate(date_arr[2]);

            return year + '-' + month;
        } else if (date_arr = orig_str.match(/(\d+)/)) {
            year = date_arr[1];

            return year;
        }
    }

    updateAttr = function(type, id, attr, value) {
        var url = 'http://localhost:3000/timeline/';

        if (type == 'event') {
            url += 'update_event_attr';
        } else if (type == 'period') {
            url += 'update_period_attr';
        }

        $.ajax({ 
            url: url,
            type: 'POST',
            data: {
                id: id,
                attr: attr,
                value: value,
            },
            success: function(data) {
                renderAll();
            }
        });
    }

    var event_container = $('#event_container');

    function renderAll() {
        $.ajax({
            url: 'http://localhost:3000/timeline/get_all_events',
            success: function(data) {
                events = data;

                event_container.html('');

                for (var i in data) {
                    var item = data[i];
                    var new_event = new Event(item.id, item.title, item.date, item.description);

                    var dom = new_event.toDom();

                    event_container.append(dom);

                    /*
                    var R = parseInt(Math.random() * 4) * 32 + 128;
                    var G = parseInt(Math.random() * 4) * 32 + 128;
                    var B = parseInt(Math.random() * 4) * 32 + 128;

                    dom.css('background', 'rgba(' + R + ', ' + G + ', ' + B + ', 0.3)');
                    */
                }

                renderPeriods();
            }
        });
    }

    var period_container = $('#period_container');

    function renderPeriods() {
        $.ajax({
            url: 'http://localhost:3000/timeline/get_all_periods',
            success: function(data) {
                periods = data;

                period_container.html('');

                for (var i in data) {
                    var item = data[i];
                    var start_date = item.start_date;
                    var end_date = item.end_date;

                    var start_event_idx = 0, end_event_idx = 0;

                    for (var j in events) {
                        var e = events[j];
                        var date = e.date;

                        if (date < start_date) {
                            start_event_idx++;
                        }

                        if (date <= end_date) {
                            end_event_idx++;
                        }

                    }

                    var new_period = new Period(item.id, item.title, start_date, end_date, item.description);
                    var dom = new_period.toDom();

                    period_container.append(dom);
                    dom.css('top', start_event_idx * 127 + 5);

                    var event_idx_span = end_event_idx - start_event_idx;
                    dom.css('height', event_idx_span * 127 - 27);
                }
            }
        });
    }

    renderAll();

    $('#event_new_button').click(function() {
        var title = $('#event_new_title').val();
        var date_arr = $('#event_new_date').val().split(' ');
        var date = formatDate($('#event_new_date').val());
        var description = $('#event_new_description').val();

        $.ajax({
            url: 'http://localhost:3000/timeline/add_event',
            type: 'POST',
            data: {
                title: title,
                description: description,
                date: date,
            },
            success: function(data) {
                renderAll();
            }
        });
    });

    $('#period_new_button').click(function() {
        var title = $('#period_new_title').val();
        var start_date = formatDate($('#period_start_date').val());
        var end_date = formatDate($('#period_end_date').val());
        var description = $('#period_new_description').val();

        $.ajax({
            url: 'http://localhost:3000/timeline/add_period',
            type: 'POST',
            data: {
                title: title,
                description: description,
                start_date: start_date,
                end_date: end_date,
            },
            success: function(data) {
                renderAll();
            }
        });
    });
});
