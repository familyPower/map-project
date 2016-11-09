function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });

  //test: marker
  var tribeca = {lat: 40.719526, lng: -73.9980244};
  var marker = new google.maps.Marker({
    position: tribeca,
    map: map,
    title: 'First Marker!'
  });

  // var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

// google.maps.event.addDomListener(window, 'load', initMap);

// // code copied from https://github.com/twbs/bootstrap/issues/2475
// function myFunction() {
//   $(window).resize(function () {
//       var h = $(window).height(),
//           offsetTop = 60; // Calculate the top offset
//
//       $('#map-canvas').css('height', (h - offsetTop));
//   }).resize();
// }
