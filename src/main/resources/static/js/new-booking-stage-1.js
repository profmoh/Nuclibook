var patientId = 0;
var therapyId = 0;

$(document).ready(function () {

    /*********************
     FIRST STAGE NAVIGATION
     **********************/

    $('.select-patient').click(function () {
        // get id and name
        patientId = $(this).attr('data-id');
        $('.patient-selected').html($(this).attr('data-name'));

        // open next page
        $('#page-one').slideUp(500);
        $('#page-two').slideDown(500);
    });

    $('#go-back-to-select-patient').click(function () {
        // open prev page
        $('#page-one').slideDown(500);
        $('#page-two').slideUp(500);
    });

    $('.select-therapy').click(function () {
        // get id and name
        therapyId = $(this).attr('data-id');
        $('.therapy-selected').html($(this).attr('data-name'));

        // open next page
        $('#page-two').slideUp(500);
        $('#page-three').slideDown(500);
    });

    $('#go-back-to-select-therapy').click(function () {
        // open prev page
        $('#page-two').slideDown(500);
        $('#page-three').slideUp(500);
    });

    /***********************
     FIRST STAGE DATA TABLES
     ***********************/

    setUpDataTable('#patients-table', 0, [[1, 1], [1, 1], [1, 1], [0, 0]]);
    setUpDataTable('#therapies-table', 0, [[1, 1], [1, 1], [1, 1], [1, 1], [0, 0]]);

    // "show more" links
    $('.more-camera-types').click(function (e) {
        e.preventDefault();
        $('#' + $(this).attr('data-target')).slideDown();
        $(this).closest('span').hide();
    });

    /********************
     SECOND STAGE CALENDAR
     *********************/

    // initial set up
    var appointmentsArray = [];
    var calendar = $('.calendar');

    // when the "show appointments" button is clicked...
    $('#view-available-appointments').click(function () {
        // hide buttons
        $(this).slideUp(300);
        $('#go-back-to-select-therapy').hide();

        //Add button for saving the appointments
        $('#page-three-sub-div').append('<div class = "col-sm-4 text-right">' +
        '<button class="btn btn-primary" id="saveAppointments" disabled>Save appointments</button></div>');

        //Variables for modal
        var startTimeObject;
        var endTimeObject;
        // show calendar
        calendar = $('.calendar').show().fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'agendaWeek'
            },

            defaultView: 'agendaWeek',
            selectable: true,
            selectHelper: true,
            minTime: "08:00:00",
            maxTime: "19:00:00",
            allDaySlot: false,

            viewDisplay: function (e) {
                // clear appointments
                appointmentsArray.length = 0;
                // reload for new date range
                callAjax(e.start, e.end);
            },


            //User selecting time slots
            select: function (start, end, allday) {
                startTimeObject = start;
                endTimeObject = end;
                //Open Modal
                $('.time-modal').removeClass('hide').modal('show');

                //Set options to the Hours the User initially selected
                var timeSelectedToStart = (startTimeObject.getHours() < 10 ? '0' : '')
                    + startTimeObject.getHours()
                    + ":"
                    + (startTimeObject.getMinutes() < 10 ? '0' : '')
                    + startTimeObject.getMinutes();
                var timeSelectedToEnd = (endTimeObject.getHours() < 10 ? '0' : '')
                    + endTimeObject.getHours()
                    + ":"
                    + (endTimeObject.getMinutes() < 10 ? '0' : '')
                    + endTimeObject.getMinutes();

                //Creating the list for the hours
                var optionHour = 08;
                var optionMin = 00;
                while (optionHour <= 18) {
                    optionMin = 00;
                    while (optionMin <= 45) {
                        var timeString = (optionHour < 10 ? '0' : '') + optionHour + ':' + (optionMin < 10 ? '0' : '') + optionMin;
                        $("#booking-start-time").append('<option value="' + timeString + '">' + (optionHour < 10 ? '0' : '') + optionHour + ':' + (optionMin < 10 ? '0' : '') + optionMin + '</option>');
                        $("#booking-end-time").append('<option value="' + timeString + '">' + (optionHour < 10 ? '0' : '') + optionHour + ':' + (optionMin < 10 ? '0' : '') + optionMin + '</option>');
                        optionMin += 15;
                    }
                    optionHour += 1;
                }
                // Make options selected by the user
                $('#booking-start-time').val(timeSelectedToStart).attr('selected', true);
                $('#booking-end-time').val(timeSelectedToEnd).attr('selected', true);

            },

            events: appointmentsArray,
            //Pop-up with details
            eventRender: function (event, element) {
                element.popover({
                    title: event.title,
                    placement: 'auto',
                    html: true,
                    trigger: 'hover',
                    animation: 'true',
                    content: event.msg,
                    container: 'body'
                });
                $('body').on('click', function (e) {
                    if (!element.is(e.target) && element.has(e.target).length === 0 && $('.popover').has(e.target).length === 0)
                        element.popover('hide');
                });
            },
            timeFormat: 'HH:mm',
            weekends: true,
            slotMinutes: 15
        });

        //Creating JSON to send
        var datesSelectedJSON;
        datesSelectedJSON = "{\"patiendID\":" + patientId + "," + "\"therapyId\":" + therapyId + "," + "\"bookingSections\":[";

        //Click ok to keep appointment;
        $('.btn-save').click(function () {
            //Getting minutes for the selected hours to check END is not before START
            var timeSelectedToStart = $('#booking-start-time').find(":selected").text();
            timeSelectedToStart = timeSelectedToStart.substring(0, 2) * 60 + timeSelectedToStart.substring(3, 5) * 1;
            var timeSelectedToEnd = $('#booking-end-time').find(":selected").text();
            timeSelectedToEnd = timeSelectedToEnd.substring(0, 2) * 60 + timeSelectedToEnd.substring(3, 5) * 1;

            //Inform the user that the hours selected are not correct;
            if (timeSelectedToStart >= timeSelectedToEnd) {
                //TODO toastr to work
                alert("wrong hours. Start : " + timeSelectedToStart + "End : " + timeSelectedToEnd);
                //toastr.error("Your selected end time is wrong.");
            } else {
                // after an appointment is saved, button "Save Appointments" to be enabled
                $('#saveAppointments').removeAttr('disabled');

                //Parsing data for the JSON
                var startTime = startTimeObject.getFullYear() + '-' +
                    (startTimeObject.getMonth() < 10 ? '0' : '') + (startTimeObject.getMonth() + 1) + '-' +
                    (startTimeObject.getDate() < 10 ? '0' : '') + startTimeObject.getDate() + 'T' +
                    $('#booking-start-time').find(":selected").text() + ":00";
                var endTime = endTimeObject.getFullYear() + '-' +
                    (endTimeObject.getMonth() < 10 ? '0' : '') + (endTimeObject.getMonth() + 1) + '-' +
                    (endTimeObject.getDate() < 10 ? '0' : '') + endTimeObject.getDate() + 'T' +
                    $('#booking-end-time').find(":selected").text() + ":00";

                datesSelectedJSON += "{\"startTime\":\"" + startTime + "\",";
                datesSelectedJSON += "\"endTime\":\"" + endTime + "\"},";

                //Add event to the calendar (Not saving it yet)
                calendar.fullCalendar('renderEvent',
                    {
                        title: $('.therapy-selected').text() + ": " + $('.patient-selected').text(),
                        start: startTime,
                        end: endTime,
                        msg: "Start time: <b>"
                        + startTime.substring(11, 16)
                        + "</b><br> End time: <b>" + endTime.substring(11, 16),
                        allDay: false
                    },
                    true // make the event "stick"
                );
                calendar.fullCalendar('unselect');
                //Close modal
                $('.time-modal').modal('hide');
            }
        });

        //Function to send the user to the next page.
        //Finishing the JSON String
        $('#saveAppointments').click(function () {
            datesSelectedJSON = datesSelectedJSON.substring(0, datesSelectedJSON.length - 1);
            datesSelectedJSON += "]}";
            $('#JSONtoSend').text(datesSelectedJSON);
            console.log(datesSelectedJSON);
        });
    });


    function callAjax(startDate, endDate) {
        // adjust end date backwards by one
        endDate = new Date(((endDate.getTime()) - 86400000));

        // get start/end strings to pass to calendar data route
        var startDateString = startDate.getFullYear()
            + '-'
            + (startDate.getMonth() < 10 ? '0' : '') + (startDate.getMonth() + 1)
            + '-'
            + ((startDate.getDate()) < 10 ? '0' : '') + (startDate.getDate());
        var endDateString = endDate.getFullYear()
            + '-'
            + (endDate.getMonth() < 10 ? '0' : '') + (endDate.getMonth() + 1)
            + '-'
            + ((endDate.getDate()) < 10 ? '0' : '') + (endDate.getDate());

        // send AJAX call
        $.get('/calendar?start=' + startDateString + '&end=' + endDateString)
            .done(function (result) {
                var rawJson = result.toString();
                var parsedJson = JSON.parse(rawJson);

                // loop through bookings
                var bookingTitle, bookingCameraType, bookingStart, bookingEnd;
                for (var i = 0; i < parsedJson.bookings.length; ++i) {
                    for (var j = 0; j < parsedJson.bookings[i].bookingSections.length; ++j) {
                        // build title
                        bookingTitle = parsedJson.bookings[i].therapyName + ":\n" + parsedJson.bookings[i].patientName;

                        //build Camera Type
                        bookingCameraType = parsedJson.bookings[i].cameraName;
                        // start and end time
                        bookingStart = parsedJson.bookings[i].bookingSections[j].startTime + ":00";
                        bookingStart = bookingStart.replace(" ", "T");
                        bookingEnd = parsedJson.bookings[i].bookingSections[j].endTime + ":00";
                        bookingEnd = bookingEnd.replace(" ", "T");

                        // add event
                        appointmentsArray.push({
                            title: bookingTitle,
                            start: bookingStart,
                            msg: "Start time: <b>"
                            + parsedJson.bookings[i].bookingSections[j].startTime.substring(10, 16)
                            + "</b><br> End time: <b>" + parsedJson.bookings[i].bookingSections[j].endTime.substring(10, 16)
                            + "<br>" + bookingCameraType + "</b>",
                            end: bookingEnd,
                            allDay: false
                        });
                    }
                }
                calendar.fullCalendar('refetchEvents');
            })
            .fail(function (xhr, textStatus, errorThrown) {
                console.log(errorThrown);
                console.log("failed to retrieve bookings");
            }
        );
    }
});
