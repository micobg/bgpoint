function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(42.733883, 25.485830),
        zoom: 8
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // add markers
    $.getJSON('/objects', function (data) {
        if (data.objects !== 0) {
            data.objects.forEach(function (object) {
                var infowindow = new google.maps.InfoWindow({
                    content: renderTooltip(object)
                });
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(object.coordinates.latitude, object.coordinates.longitude),
                    title: object.name
                });
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map,marker);
                });

                marker.setMap(map);
            });
        }
    });

    // add event listeners
    google.maps.event.addListener(map, 'click', function(e) {
        var confirmation = confirm('Искате ли да добавите обект на това място?');

        if (confirmation) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(e.latLng.d, e.latLng.e),
                title: 'Нов обект',
                animation: google.maps.Animation.BOUNCE
            });

            marker.setMap(map);
            renderCreateObjectForm(e.latLng);
        }
    });
}


function renderTooltip(object) {
    var type = '<div> - обектът е от тип <strong>' + object.type + '</strong></div>',
        bussines_hours = price = a_info = '';
    
    if (typeof object.bussines_hours !== 'undefined') {
        bussines_hours = '<div> - работното му време е от <strong>' + object.bussines_hours.from + '</strong> до <strong>' + object.bussines_hours.to + '</strong></div>';
    }
    if (typeof object.price !== 'undefined') {
        price = '<div> - цената на билета е <strong>' + object.price + 'лв</strong></div>';
    }
    if (typeof object.additional_info !== 'undefined' && object.additional_info.length > 0) {
        a_info += '<div> - <em>' + object.additional_info.join(', ') + '</em></div>';
    }

    return '<h2>' + object.name + '</h2>' +
        'Рейтинг: <em>(' + object.rating + ')</em>' + 
        '<div>' + object.desc + '</div>' + 
        type + bussines_hours + price + a_info;
}

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=initialize';
    document.body.appendChild(script);
}

window.onload = loadScript;