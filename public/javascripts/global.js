$(document).ready(function() {

});

$(window).resize(editTemplate());

// events
$('#btnLogin').on('click', loginSubmit);
$('#menu-box #get-all-objects').on('click', showAllObjects);
$('#menu-box #add-object').on('click', addObject);

function editTemplate() {
    // login
    $('#login-box').width(window.innerWidth - 400);
    $('#login-box').css("margin-top", window.innerHeight/2 - 150);

    // index
    $('#menu-box').width(window.innerWidth - 275);
    $('#message-box').width(window.innerWidth - 265);
}

function clearBoxes() {
    hideMessageBox();

    $('#create-object').remove();
}

function loginSubmit() {
    var loginData = {
      'email': $('#login-form fieldset input#inputEmail').val(),
      'password': $('#login-form fieldset input#inputPassword').val()
    }
    $.ajax({
        type: 'POST',
        data: loginData,
        url: '/login_submit',
        dataType: 'JSON'
    }).done(function (response) {
        if (typeof response.redirect === 'string') {
            window.location = response.redirect;
        } else {
            alert('Wrong email or password');
        }
    });
};

function showAllObjects() {
    $.getJSON('/objects', function (data) {
        if (data.objects === 0) {
            // no data
            $('body').append('<div id="all-objects">Няма обекти</div>');
        } else {
            if ($('#all-objects').length === 0) {
                // render data
                $('body').append('<ul id="all-objects"></ul>');
                data.objects.forEach(function (object) {
                    $('#all-objects').append('<li data-latitude="' + object.coordinates.latitude + '" data-longitude="' + object.coordinates.longitude + '">' + object.name + ' <span data-object-id="' + object._id + '" id="delete-object-submit">изтрии</span></li>');
                });

                if (data.next_page) {
                    $('#all-objects').append('<li>Виж следващите 10!</li>');
                }
            } else {
                // close it
                $('#all-objects').remove();
            }

            // bind event
            $('#delete-object-submit').on('click', deleteObject);
            $('#all-objects li').on('click', goToObject);
        }
    });
}

function goToObject(event) {
    mapInitialize({
        center: {
            latitude: $(event.target).data('latitude'),
            longitude: $(event.target).data('longitude')
        },
        zoom: 10
    });
}

// on click add-object button
function addObject() {
    showMessageBox('Кликнете на желанато от Вас място на картата, за да създадете обект!');
    addCreateListener();
}

function showMessageBox(message) {
    var message_box = $('#message-box');

    message_box.empty().append('Кликнете на желанато от Вас място на картата, за да създадете обект!');
    message_box.animate({
        top: 48
    }, 500);
}

function hideMessageBox() {
    var message_box = $('#message-box');

    message_box.animate({
        top: 20
    }, 500);
}

function renderCreateObjectForm(coordinates) {
    $('#create-object').remove();
    $('body').append('<div id="create-object"></div>');
    var form = $('#create-object');
    form.append('<h2>Добавяне на обект</h2>');
    form.append('<input type="text" id="object-name" required placeholder="Име">');
    form.append('<input type="hidden" id="object-coordinates-latitude" value="' + coordinates.d + '">');
    form.append('<input type="hidden" id="object-coordinates-longitude" value="' + coordinates.e + '">');
    form.append('<input type="text" id="object-type" required placeholder="Тип">');
    form.append('<input type="text" id="object-desc" required placeholder="Описание">');
    form.append('<input type="text" id="object-bussines-hours-from" placeholder="Работно време от...">');
    form.append('<input type="text" id="object-bussines-hours-to" placeholder="Работно време до...">');
    form.append('<input type="text" id="object-price" placeholder="Цена на билета">');
    form.append('<input type="text" id="object-additional-info" placeholder="Допълнителна информация (разделени със запетаи)">');
    form.append('<br /><button id="create-object-submit">Добави обекта</button>');

    // bind event
    $('#create-object-submit').on('click', createObject);
}

function createObject() {
    var object = {
        name: $('#object-name').val(),
        coordinates: {
            latitude: $('#object-coordinates-latitude').val(),
            longitude: $('#object-coordinates-longitude').val()
        },
        type: $('#object-type').val(),
        rating: 0
    };

    if ($('#object-bussines-hours-from').val() !== '' && $('#object-bussines-hours-to').val() !== '') {
        object.bussines_hours = [];
        object.bussines_hours.from = $('#object-bussines-hours-from').val();
        object.bussines_hours.to = $('#object-bussines-hours-to').val();
    }
    if ($('#object-price').val() !== '') {
        object.price = $('#object-price').val();
    }
    if ($('#object-additional-info').val() !== '') {
        object.additional_info = $('#object-additional-info').val().split(',');

        var trimmed = [];
        object.additional_info.forEach(function (a_info) {
            trimmed.push(a_info.trim());
        });
        object.additional_info = trimmed;
    }

    $.ajax({
        type: 'POST',
        data: object,
        url: '/objects',
        dataType: 'JSON',
        success: function (response) {
            // remove create tooltip
            $('#create-object').remove();

            // create marker
            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(object.coordinates.latitude, object.coordinates.longitude),
                title: object.name
            });
            marker.setMap(map);

            alert('Обектът е създаден успешно!');
        }
    });
}

function deleteObject(event) {
    var confirmation = confirm('Наистина ли искате да изтриете този обект?');
console.log(event);
    // Check and make sure the user confirmed
    if (confirmation) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/objects/' + $(event).attr('rel')
        }).done(function (response) {

          // Check for a successful (blank) response
          if (response.msg === '') {
          }
          else {
            alert('Error: ' + response.msg);
          }

          showAllObjects();
        });

    }
    else {
        return false;
    }
}