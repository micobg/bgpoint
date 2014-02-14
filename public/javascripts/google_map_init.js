function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(42.733883, 25.485830),
    zoom: 8
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=initialize';
  document.body.appendChild(script);
}

window.onload = loadScript;