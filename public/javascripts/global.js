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

    $('#all-objects').remove();
    $('#create-object').remove();

    // TODO: unbind map events
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

function renderObjects(data) {
    clearBoxes();

    $('body').append('<ul id="all-objects"></ul>');
    
    var box = $('#all-objects'),
        title = (data.filter_by_type === false) ? 'Всички обекти' : 'Обектите от тип <span class="object-type-name">' + data.filter_by_type + '</span>';
    
    box.append('<li id="box-header">' + title + ' <img src="/images/close-btn.png" id="box-close-btn" alt="" /></li>');
    if (data.objects === 0) {
        // no data
        box.append('<li>Няма обекти</li>');
    } else {
        // render data
        data.objects.forEach(function (object) {
            box.append('<li data-object-id="' + object._id + '" data-latitude="' + object.coordinates.latitude + '" data-longitude="' + object.coordinates.longitude + '">' + object.name + ' <span class="delete-object-submit">изтрии</span></li>');
        });

        if (data.next_page) {
            box.append('<li id="box-footer">Покажи още обекти!</li>');
        }

        // bind event
        $('#box-close-btn').on('click', function () {
            $('#all-objects').remove();
        });
        $('#all-objects li:not(#box-header,#box-footer)').on('click', goToObject);
        $('.delete-object-submit').on('click', deleteObject);
    }
}

function showAllObjects() {
    // if ($('#all-objects').length !== 0) {
    //     $('#all-objects').remove();
    //     return ;
    // }

    $.getJSON('/objects/10', function (data) {
        renderObjects(data);
    });
}

function goToObject(event) {
    map.panTo(new google.maps.LatLng($(event.target).data('latitude'), $(event.target).data('longitude')));
    map.setZoom(10);
    // mapInitialize({
    //     center: {
    //         latitude: $(event.target).data('latitude'),
    //         longitude: $(event.target).data('longitude')
    //     },
    //     zoom: 10
    // });
}

// on click add-object button
function addObject() {
    clearBoxes();

    showMessageBox('Кликнете на желанато от Вас място на картата, за да създадете обект!');
    addCreateListener();
}

function showMessageBox(message) {
    var message_box = $('#message-box');

    message_box.empty().append(message);
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
    clearBoxes();

    $('#create-object').remove();
    $('body').append('<form id="create-object"></form>');
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
    form.append('<br /><input type="submit" id="create-object-submit" value="Добави обекта" />');

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
        desc: $('#object-desc').val(),
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
    event.stopPropagation();

    var confirmation = confirm('Наистина ли искате да изтриете този обект?');

    // Check and make sure the user confirmed
    if (confirmation) {
        console.log('successful');
        $.ajax({
            type: 'DELETE',
            url: '/objects/' + $(event.target).parent().data('object-id')
        }).done(function (response) {
            if (response.msg !== '') {
                alert('Изтриването е нуспешно');
            }

            showAllObjects();
        });
    }
    else {
        return false;
    }
}

function showSpecificTypeObjects(event) {
    var type = $(event.target).html();

    $.getJSON('/objects/' + type + '/10', function (data) {
        renderObjects(data);
    });
}