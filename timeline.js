var events = [ ];
var periods = [ ];

Event = function(title, date) {
    this.title = title;
    this.date = date;
}

Event.prototype.toDom = function() {
    return $('<div class="event_item"><div class="event_item_title">' 
        + this.title + '</div><div class="event_item_date">' 
        + (this.date.getYear() + 1900) + '年' 
        + (this.date.getMonth() + 1) + '月'
        + this.date.getDate() + '日</div></div>');
}

Period = function(title, start_date, end_date) {
    this.title = title;
    this.start_date = start_date;
    this.end_date = end_date;
}

Period.prototype.toDom = function() {
    return $('<div class="period_item"><div class="period_item_title">'
        + this.title + '</div><div class="period_item_start_date">'
        + (this.start_date.getYear() + 1900) + '年'
        + (this.start_date.getMonth() + 1) + '月'
        + this.start_date.getDate() + '日</div><div class="period_item_end_date">'
        + (this.end_date.getYear() + 1900) + '年'
        + (this.end_date.getMonth() + 1) + '月'
        + this.end_date.getDate() + '日</div></div>');
}

$(function() {
    var event_container = $('#event_container');

    function renderAll() {
        $.ajax({
            url: 'http://localhost:3000/timeline/get_all_events',
            success: function(data) {
                events = data;

                event_container.html('');

                for (var i in data) {
                    var item = data[i];
                    var new_event = new Event(item.title, new Date(Date.parse(item.date)));

                    var R = parseInt(Math.random() * 4) * 32 + 128;
                    var G = parseInt(Math.random() * 4) * 32 + 128;
                    var B = parseInt(Math.random() * 4) * 32 + 128;

                    var dom = new_event.toDom();

                    event_container.append(dom);
                    dom.css('background', 'rgba(' + R + ', ' + G + ', ' + B + ', 0.3)');
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
                    var start_date = new Date(Date.parse(item.start_date));
                    var end_date = new Date(Date.parse(item.end_date));

                    var start_event_idx = 0, end_event_idx = 0;

                    for (var j in events) {
                        var e = events[j];
                        var date = new Date(Date.parse(e.date));

                        if (date < start_date) {
                            start_event_idx++;
                        }

                        if (date <= end_date) {
                            end_event_idx++;
                        }

                    }

                    var new_period = new Period(item.title, start_date, end_date);
                    var dom = new_period.toDom();

                    console.log(start_event_idx, end_event_idx);
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
        var date = new Date(date_arr[0], date_arr[1] - 1 || 0, date_arr[2] || 1);

        // var new_event = new Event(title, date);

        $.ajax({
            url: 'http://localhost:3000/timeline/add_event',
            data: {
                title: title,
                description: 'shabime',
                date: (date.getYear() + 1900) + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
            },
            success: function(data) {
                renderAll();
            }
        });
    });

    $('#period_new_button').click(function() {
        var title = $('#period_new_title').val();

        var start_date_arr = $('#period_start_date').val().split(' ');
        var start_date = new Date(start_date_arr[0], start_date_arr[1] - 1 || 0, start_date_arr[2] || 1);

        var end_date_arr = $('#period_end_date').val().split(' ');
        var end_date = new Date(end_date_arr[0], end_date_arr[1] - 1 || 11, end_date_arr[2] || 31);

        $.ajax({
            url: 'http://localhost:3000/timeline/add_period',
            data: {
                title: title,
                description: 'shabime',
                start_date: (start_date.getYear() + 1900) + '-' + 
                    (start_date.getMonth() + 1) + '-' + start_date.getDate(),
                end_date: (end_date.getYear() + 1900) + '-' + 
                    (end_date.getMonth() + 1) + '-' + end_date.getDate(),
            },
            success: function(data) {
                console.log(data);
            }
        });
    });
});
