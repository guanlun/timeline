$(function() {
    var events = [ ];
    var periods = [ ];

    Event = function(id, title, date, description) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.description = description;

        this.dom = $('<div class="event_item"></div>');
        this.title_el = $('<div class="event_item_title item_title" contenteditable>' 
                + this.title + '</div>');
        this.date_el = $('<div class="event_item_date item_date" contenteditable>' 
                + this.date + '</div>');
        this.description_el = $('<div class="event_item_description item_description" contenteditable>' 
                + this.description + '</div>');
        this.delete_el = $('<div class="event_item_delete item_delete">delete</div>');

        this.dom.append(this.title_el);
        this.dom.append(this.delete_el);
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

        this.delete_el.click(function() {
            if (confirm('delete this event?')) {
                deleteItem('event', this.id);
            }
        }.bind(this));
    }

    Period = function(id, title, start_date, end_date, description, col_no) {
        this.id = id;
        this.title = title;
        this.start_date = start_date;
        this.end_date = end_date;
        this.description = description;
        this.col_no = col_no;

        this.dom = $('<div class="period_item"></div>');
        this.title_el = $('<div class="period_item_title item_title" contenteditable>' 
                + this.title + '</div>');
        this.start_date_el = $('<div class="period_item_start_date item_date" contenteditable>' 
                + this.start_date + '</div>');
        this.end_date_el = $('<div class="period_item_end_date item_date" contenteditable>' 
                + this.end_date + '</div>');
        this.description_el = $('<div class="period_item_description item_description" contenteditable>' 
                + this.description + '</div>');
        this.delete_el = $('<div class="period_item_delete item_delete">delete</div>');

        this.left_arrow_el = $('<div class="period_item_left_arrow arrow">&lt;</div>');
        this.right_arrow_el = $('<div class="period_item_right_arrow arrow">&gt;</div>');

        this.dom.append(this.title_el);
        this.dom.append(this.delete_el);
        this.dom.append(this.start_date_el);
        this.dom.append(this.end_date_el);
        this.dom.append(this.description_el);

        this.dom.append(this.left_arrow_el);
        this.dom.append(this.right_arrow_el);

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

        this.delete_el.click(function() {
            if (confirm('delete this period?')) {
                deleteItem('period', this.id);
            }
        }.bind(this));

        this.left_arrow_el.click(function() {
            if (this.col_no > 1) {
                updateAttr('period', this.id, 'col_no', this.col_no - 1);
            }
        }.bind(this));

        this.right_arrow_el.click(function() {
            this.col_no;
            updateAttr('period', this.id, 'col_no', this.col_no + 1);
        }.bind(this));
    }

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

    deleteItem = function(type, id) {
        var url = 'http://localhost:3000/timeline/';

        if (type == 'event') {
            url += 'delete_event';
        } else if (type == 'period') {
            url += 'delete_period';
        }

        $.ajax({
            url: url,
            type: 'POST',
            data: {
                id: id,
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

                    event_container.append(new_event.dom);

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

                    /*
                    for (var j in periods) {
                        var p = periods[j];
                        if (!(p.start_date > end_date || p.end_date < start_date)) {

                        }
                    }
                    */

                    var new_period = new Period(item.id, item.title, start_date, 
                            end_date, item.description, item.col_no);

                    period_container.append(new_period.dom);
                    new_period.dom.css('top', start_event_idx * 127 + 5);

                    var event_idx_span = end_event_idx - start_event_idx;
                    new_period.dom.css('height', event_idx_span * 127 - 27);

                    new_period.dom.css('left', (item.col_no - 1) * 200);

                    // periods.push(data[i]);
                }
            }
        });
    }

    renderAll();

    $('#event_new_button').click(function() {
        var title = $('#event_new_title').val();
        var date = formatDate($('#event_new_date').val());
        var description = $('#event_new_description').val();

        if (title && date) {
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
        } else {
            alert('please fill the fields!');
        }
    });

    $('#period_new_button').click(function() {
        var title = $('#period_new_title').val();
        var start_date = formatDate($('#period_start_date').val());
        var end_date = formatDate($('#period_end_date').val());
        var description = $('#period_new_description').val();
        var col_no = $('#period_new_col_no').val() || 1;

        if (title && start_date && end_date) {
            $.ajax({
                url: 'http://localhost:3000/timeline/add_period',
                type: 'POST',
                data: {
                    title: title,
                    description: description,
                    start_date: start_date,
                    end_date: end_date,
                    col_no: col_no,
                },
                success: function(data) {
                    renderAll();
                }
            });
        } else {
            alert('please fill the fields!');
        }
    });
});
