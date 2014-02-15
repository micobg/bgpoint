$(document).ready(function() {

});

$(window).resize(editTemplate());

// events
$('#btnLogin').on('click', loginSubmit);
$('#menu-box #get-all-objects').on('click', fetchAllObjects);
$('#create-object #create-object-submit').on('click', createObject);

function editTemplate() {
    // login
    $('#login-box').width(window.innerWidth - 400);
    $('#login-box').css("margin-top", window.innerHeight/2 - 150);

    // index
    $('#menu-box').width(window.innerWidth - 275);
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

function fetchAllObjects() {
    $.getJSON('/objects', function (data) {
        if (data.objects === 0) {
            // no data
            $('body').append('<div id="all-objects">Няма обекти</div>');
        } else {
            if ($('#all-objects').length === 0) {
                // render data
                $('body').append('<ul id="all-objects"></ul>');
                data.objects.forEach(function (object) {
                    $('#all-objects').append('<li><a href="">' + object.name + '</li>');
                });

                if (data.next_page) {
                    $('#all-objects').append('<li>Виж следващите 10!</li>');
                }
            } else {
                // close it
                $('#all-objects').remove();
            }
        }
    });
}

function renderCreateObjectForm(coordinates) {
    $('#create-object').remove();
    $('body').append('<div id="create-object"></div>');
    var form = $('#create-object');
    form.append('<h2>Създаване на обект</h2>');
    form.append('<input type="text" id="object-name" placeholder="Име">');
    form.append('<input type="hidden" id="object-coordinates-latitude" value="' + coordinates.d + '">');
    form.append('<input type="hidden" id="object-coordinates-longitude" value="' + coordinates.e + '">');
    form.append('<input type="text" id="object-type" placeholder="Тип">');
    form.append('<input type="text" id="object-desc" placeholder="Описание">');
    form.append('<input type="text" id="object-bussines-hours-from" placeholder="Работно време от...">');
    form.append('<input type="text" id="object-bussines-hours-to" placeholder="Работно време до...">');
    form.append('<input type="text" id="object-price" placeholder="Цена на билета">');
    form.append('<input type="text" id="object-additional-info" placeholder="Допълнителна информация (разделени със запетаи)">');
    form.append('<br /><button id="create-object-submit">Създай обекта</button>');
}

function createObject() {
    console.log('sd');
    var object = {
        name: $('#object-name').val(),
        coordinates: {
            latitude: $('#object-coordinates-latitude').val(),
            longitude: $('#object-coordinates-longitude').val()
        },
        type: $('#object-type').val()
    };
    console.log(object);

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
    console.log(object);

    $.ajax({
        type: 'POST',
        data: object,
        url: '/objects',
        dataType: 'JSON'
    }).done(function (response) {
        alert('Обектът е създаден успешно!');
    });
}