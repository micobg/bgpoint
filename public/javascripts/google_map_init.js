function mapInitialize(givenOptions) {
    // if (typeof givenOptions !== 'undefined') {
    //     var center = (typeof givenOptions.center.latitude !== 'undefined' && typeof givenOptions.center.longitude !== 'undefined') ?
    //                 new google.maps.LatLng(givenOptions.center.latitude, givenOptions.center.longitude) : 
    //                 new google.maps.LatLng(42.733883, 25.485830), // center of Bulgaria
    //         mapOptions = {
    //             center: center,
    //             zoom: (typeof givenOptions.zoom !== 'undefined') ? givenOptions.zoom : 8
    //         };
    // } else {
        var mapOptions = {
                center: new google.maps.LatLng(42.733883, 25.485830), // center of Bulgaria
                zoom: 8
            };
    // }

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // add markers
    $.getJSON('/objects/0', function (data) {
        if (data.objects !== 0) {
            data.objects.forEach(function (object) {
                var infowindow = new google.maps.InfoWindow({
                    content: renderTooltip(object)
                });
                
                var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(object.coordinates.latitude, object.coordinates.longitude),
                        title: object.name
                    });
                marker.setMap(map);

                // marker's event listener
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map,marker);
                });

                // info window's event listener
                google.maps.event.addListener(infowindow, 'domready', function() {
                    // type click event
                    $('.object-type').on('click', function(event) {
                        event.stopPropagation();
                        
                        showSpecificTypeObjects(event);
                    });

                    // // like click event
                    // $('.object-like-submit').on('click', function(event) {
                    //     event.stopPropagation();
                        
                    //     objectLike(event);
                    // });

                    // closest click event
                    $('.get-closest-objects').on('click', function(event) {
                        event.stopPropagation();
                        
                        getClosestObjects(event);
                    });
                });
            });
        }
    });    
}

function addCreateListener() {
    // add event listener
    google.maps.event.addListenerOnce(map, 'click', function(e) {
        // var confirmation = confirm('Искате ли да добавите обект на това място?');

        // if (confirmation) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(e.latLng.d, e.latLng.e),
                title: 'Нов обект',
                animation: google.maps.Animation.BOUNCE
            });
            marker.setMap(map);

            renderCreateObjectForm(e.latLng);
        // }

        hideMessageBox();
    });
}

function renderTooltip(object) {
    var type = '<div> - обектът е от тип <strong class="object-type" data-id="' + object['_id'] + '">' + object.type + '</strong></div>',
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
        // 'Рейтинг: <em>(' + object.rating + ')</em> <span data-id="' + object['_id'] + '" class="object-like-submit">Добави към любими!</span>' + 
        '<div>' + object.desc + '</div>' + 
        type + bussines_hours + price + a_info + 
        '<span data-id="' + object['_id'] + '" class="get-closest-objects">Виж 3-те най-близки обекта!</span>';
}

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=mapInitialize';
    document.body.appendChild(script);
}

window.onload = loadScript;