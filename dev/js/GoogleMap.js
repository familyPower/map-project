/**
 * Filename: GoogleMap.js
 * Purpose: This file interfaces with maps.google.com.
 * Internal Dependencies: None.
 * External Dependencies: maps.google.com
 * Notes:      //https://snazzymaps.com
 */

 var gm = (function () {
   /*************************** Private Variables ***************************/
   var self = this;

   var map;
   var address = "sidney nsw";
   var locationLatlon;
   var markers = [];
   var bouncingMarker;
   var mapStyles;
   var largeInfowindow;


   // container for public methods
   var publicMethods = {};

   /*************************** public methods ***************************/
   //
   /**
    * anonymous function - description
    *
    * @return {type}  description
    */
   publicMethods.initMap = function () {
     // Constructor creates a new map - only center and zoom are required.
     map = new google.maps.Map(document.getElementById('map-canvas'), {
       center: new google.maps.LatLng(0,0),
       //center: {lat: 0, lng: 0},
       zoom: 1,
       //minZoom: 1,
       styles: setMapStyles(),
       mapTypeId: 'roadmap',
       mapTypeControl: false
     });

     largeInfowindow = new google.maps.InfoWindow();
   //   addressToLatlng(address);
//      getPlaces();
   }

   publicMethods.setAddress  = function (address) {
     addressToLatlng(address);
     getPlaces();
   }



   /*************************** private methods ***************************/

   /**
    * populateInfowindow - description
    *
    * @param  {type} marker description
    * @return {type}        description
    */

   function populateInfowindow(marker) {
     // Start the marker bouncing.
     toggleBounce(marker);

     // Check to make sure the infowindow is not already opened on this marker.
     if (largeInfowindow.marker == null || largeInfowindow.marker != marker) {
       largeInfowindow.maker = marker;
       largeInfowindow.setContent('<div>' + marker.title + '</div>');
       largeInfowindow.open(map, marker);
       // Make sure the marker property is cleared if the infowindow is closed.
         largeInfowindow.addListener('closeclick', function() {
   //        largeInfowindow.setMarker(null);
           toggleBounce(marker);
         });
     } // if
   } // function: populateInfowindow

   /**
    * toggleBounce - description
    *
    * @param  {type} marker description
    * @return {type}        description
    */
   function toggleBounce(marker) {
     // If the marker.animation == drop, then set it to null
     if (marker.getAnimation() == google.maps.Animation.Drop) {
       marker.setAnimation(null);
     }
     // If the selected marker is already animated, then stop animation.
     if (marker.getAnimation() !== null) {
       marker.setAnimation(null);
       bouncingMarker = null;
     } else {
       // stop a marker that is already bouncing.
       if (bouncingMarker) {
         bouncingMarker.setAnimation(null);
         bouncingMarker = null;
       }
       // Tell the marker to bounce.
       marker.setAnimation(google.maps.Animation.BOUNCE);

       // Remember which marker is bouncing.
       bouncingMarker = marker;
     }
   }

   /**
    * setMapStyles - description
    *
    * @return {type}  description
    */
   var setMapStyles = function() {
        smapStyles = [
       {
         featureType: 'water',
         stylers: [
           { color: '#19a0d8' }
         ]
       },{
         featureType: 'administrative',
         elementType: 'labels.text.stroke',
         stylers: [
           { color: '#ffffff' },
           { weight: 6 }
         ]
       },{
         featureType: 'administrative',
         elementType: 'labels.text.fill',
         stylers: [
           { color: '#e85113' }
         ]
       },{
         featureType: 'road.highway',
         elementType: 'geometry.stroke',
         stylers: [
           { color: '#efe9e4' },
           { lightness: -40 }
         ]
       },{
         featureType: 'transit.station',
         stylers: [
           { weight: 9 },
           { hue: '#e85113' }
         ]
       },{
         featureType: 'road.highway',
         elementType: 'labels.icon',
         stylers: [
           { visibility: 'off' }
         ]
       },{
         featureType: 'water',
         elementType: 'labels.text.stroke',
         stylers: [
           { lightness: 100 }
         ]
       },{
         featureType: 'water',
         elementType: 'labels.text.fill',
         stylers: [
           { lightness: -100 }
         ]
       },{
         featureType: 'poi',
         elementType: 'geometry',
         stylers: [
           { visibility: 'on' },
           { color: '#f0e4d3' }
         ]
       },{
         featureType: 'road.highway',
         elementType: 'geometry.fill',
         stylers: [
           { color: '#efe9e4' },
           { lightness: -25 }
         ]
       },{

         featureType: "poi",
         elementType: "labels",
         stylers: [
               { visibility: "on" }
         ]

       }
     ];

     return mapStyles;
   }

   function getPlaces() {
     var service = new google.maps.places.PlacesService(map);

     service.nearbySearch({
       location: map.center,
       radius: 16000,
       type: ['park', 'library', 'zoo']
     }, processResults);

   }

   function processResults(results, status, pagination) {
     if (status !== google.maps.places.PlacesServiceStatus.OK) {
       return;
     } else {
       createMarkers(results);

       // if (pagination.hasNextPage) {
       //   var moreButton = document.getElementById('more');
       //
       //   moreButton.disabled = false;
       //
       //   moreButton.addEventListener('click', function() {
       //     moreButton.disabled = true;
       //     pagination.nextPage();
       //   });
       // }
     }
   }

   function createMarkers(places) {
     var bounds = new google.maps.LatLngBounds();
     var placesList = document.getElementById('list-items');

     // The following group uses the location array to create an array of markers
     // on initialize.
   console.log("places.count:", places.length);
     for (var i = 0, place; place = places[i]; i++) {
   //    console.log("i:", i);
       var image = {
         url: place.icon,
         size: new google.maps.Size(71, 71),
         origin: new google.maps.Point(0, 0),
         anchor: new google.maps.Point(17, 34),
         scaledSize: new google.maps.Size(25, 25)
       };

       var marker = new google.maps.Marker({
         map: map,
         icon: image,
         title: place.name,
         position: place.geometry.location
       });

       // TODO: move to view
        // Create an onclick even to open an infowindow at each marker.
        marker.addListener('click', function() {
          populateInfowindow(this);
          toggleBounce(this);
        });

        // push the marker to out array of markers.
        markers.push(marker);

        //$('.related-info-list').innerHTML.append('<li>' + marker.title + '</li>');

        // Retrieve the <ul> element that will hold the list of markers
        var $ulElement = $('#marker-list');
   var ulChildren = $ulElement.children;

        // Add the new Marker information
        $ulElement.append('<li>' +place.name+ '</li>');
        var $lastChild = $ulElement.children().last();

       var id = "item-" + i;
       $lastChild.attr('id', "item-" + id);
       $lastChild.attr('class', "marker-list-item");
       $lastChild.data("item-marker", marker);

   var a = $lastChild.data("item-marker");
   var u1 = $lastChild.data("item-marker");

       // Add click event to trigger actions like marker selected.
       $lastChild.click(function() {
         var marker = $(this).data("item-marker");
         populateInfowindow(marker);
       });

   var u = $('#marker-list:last-child').data("item-marker");
   //console.log(u.title);
   // var w = a.title
       bounds.extend(place.geometry.location);
     }
     map.fitBounds(bounds);
   }

   function addressToLatlng(address) {
     // address = "sidney nsw";

     var loc;
     var geoLocStatus;
     var geocoder = new google.maps.Geocoder();

     // if (address == '') {
     //   window.alert('You must enter an area, or address.');
     // } else {
       // Geocode the address/area entered to get the center.
       geocoder.geocode(
         { address: address
         }, function(results, status) {
             geoLocStatus = status;
            if (status == google.maps.GeocoderStatus.OK) {
              loc = results[0].geometry.location;
              locationLatlon = results[0].geometry.location;
              map.setCenter(results[0].geometry.location);
             //  map.setZoom(15);
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
         });
     // }

     // Get POI
     getPlaces();

    // return {status: geoLocStatus, location: loc};
   } //  addressToLatlng

   function placeSelected(d) {
     var marker = d.getAttribute("data-id");
     populateInfowindow(marker);
   }

   // return object containing public methods
   return publicMethods;
 }) ();
