var events = [ ];
var periods = [ ];

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

Event = function(title, date, description) {
    this.title = title;
    this.date = date;
    this.description = description;
}

Event.prototype.toDom = function() {
    return $('<div class="event_item"><div class="event_item_title">' 
        + this.title + '</div><div class="event_item_date">' 
        /*
        + (this.date.getYear() + 1900) + '年' 
        + (this.date.getMonth() + 1) + '月'
        */
        + this.date + '</div><div class="event_item_description">'
        + this.description + '</div></div>');
}

Period = function(title, start_date, end_date, description) {
    this.title = title;
    this.start_date = start_date;
    this.end_date = end_date;
    this.description = description;
}

Period.prototype.toDom = function() {
    return $('<div class="period_item"><div class="period_item_title">'
        + this.title + '</div><div class="period_item_start_date">'
        + this.start_date + '</div><div class="period_item_end_date">'
        + this.end_date + '</div><div class="period_description">'
        + this.description + '</div></div>');
}

$(function() {
    /*
    dateFormatter($('#event_new_date'));
    dateFormatter($('#period_start_date'));
    dateFormatter($('#period_end_date'));
    */

    var event_container = $('#event_container');

    function renderAll() {
        $.ajax({
            url: 'http://localhost:3000/timeline/get_all_events',
            success: function(data) {
                events = data;

                event_container.html('');

                for (var i in data) {
                    var item = data[i];
                    var new_event = new Event(item.title, item.date, item.description);

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

                    var new_period = new Period(item.title, start_date, end_date, item.description);
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
