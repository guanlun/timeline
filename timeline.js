var events = [ ];

function dateCmp(a, b) {
    return a.date < b.date ? 1 : 0;
}

function Event(title, date) {
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

$(function() {
    var event_container = $('#event_container');

    function renderEvents() {
        $.ajax({
            url: 'http://localhost:3000/timeline/get_all_events',
            success: function(data) {
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
            }
        });
    }

    renderEvents();

    $('#event_new_button').click(function() {
        var title = $('#event_new_title').val();
        var date_arr = $('#event_new_date').val().split(' ');
        var date = new Date(date_arr[0], date_arr[1] - 1 || 0, date_arr[2] || 1);

        var new_event = new Event(title, date);

        $.ajax({
            url: 'http://localhost:3000/timeline/add_event',
            data: {
                title: title,
                description: 'shabime',
                date: (date.getYear() + 1900) + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
            },
            success: function(data) {
                renderEvents();
            }
        });
    });

    $('#period_new_button').click(function() {
        var title = $('#period_new_title').val();
        var start_date_arr = $('#period_starting_date').val().split(' ');
        var start_date = new Date(date_arr[0], date_arr[1] - 1 || 0, date_arr[2] || 1);
    });
});
