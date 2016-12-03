/**
 * Filename: GoogleMap.js
 * Purpose: This file interfaces with maps.google.com.
 * Internal Dependencies: None.
 * External Dependencies: maps.google.com
 * Notes:      //https://snazzymaps.com
 */

g_callback_AddressFound = undefined;
g_callback_AddressProcessed = undefined;
var gm = (function() {
    /*************************** Member Variables ***************************/
    var self = this;

    var callback_markerClicked;

    // TODO: add "_" to each private variable
    // Public members - getters and setters available
    var _address = "sidney nsw";
    var locationLatlon;
    var _selectedMarker;

    // Public members - getters available.
    var _markers = [];
    var _places = [];

    // Private memebers
    var map;
    var mapStyles; // may be set by user in future version
    var largeInfowindow;
    var bounds;


    // container for public methods
    var publicMethods = {
    };

    /*************************** public methods ***************************/

    /**
     * publicMethods - Sets the address if a valid string is passed in.
     *
     *
     * @param  {type} addr The new address.
     * @return {string}    Returns the address.
     */
    publicMethods.getAddress = function() {
        return self._address;
    }

    publicMethods.setAddress = function(addr) {
        if (addr && addr.length > 0) {
            self._address = addr;
        }

        return self._address;
    }

    /**
     * anonymous function - latlon
     *
     * @param  {type} latlon {lat: latitue, lgn: longitude}
     * @return {type}        description
     */
    publicMethods.getLatlon = function(latlon) {
        if (true === latlon) {
            self.locationLatlon = latlon;
        }
        return self.locationLatlon;
    }

    publicMethods.getMarkersData = function() {
console.log("self.markers:", self._markers);
console.log("markers:", _markers);

        var returnArray = [];
        var title;
        var key;
        for (var data, i = 0; i < _markers.length, data = _markers[i]; i++) {
            title = data.Marker.title;
            key = data.Key;
            returnArray.push({
                Key: key,
                PlaceName: title
            });
        }
        return returnArray;
    }

    publicMethods.getPlacesArray = function() {
        return self._places;
    }

    //
    /**
     * anonymous function - description
     *
     * @return {type}  description
     */
    publicMethods.initMap = function() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: new google.maps.LatLng(0, 0),
            //center: {lat: 0, lng: 0},
            zoom: 2,
            //minZoom: 1,
            styles: setMapStyles(),
            mapTypeId: 'roadmap',
            mapTypeControl: false
        });

        bounds = new google.maps.LatLngBounds();
        largeInfowindow = new google.maps.InfoWindow();
        //   addressToLatlng(address);
        //      getPlaces();
    }

    publicMethods.setBouncingCallback = function(callback) {
      precondition(callback);

      callback_markerClicked = callback;  // bounce function
    }
    publicMethods.updateMap = function(address) {
        var addr = publicMethods.setAddress(address);
        addressToLatlng(address);
    }

    /*************************** private methods ***************************/

    /**
     * populateInfowindow - description
     *
     * @param  {type} marker description
     * @return {type}        description
     */
    publicMethods.populateInfowindow = function(marker) {
            // Start the marker bouncing.
            //toggleBounce(marker);

            // Check to make sure the infowindow is not already opened on this marker.
            if (largeInfowindow.marker == null || largeInfowindow.marker != marker) {
                largeInfowindow.maker = marker;
                largeInfowindow.setContent('<div>' + marker.title + '</div>');
                largeInfowindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.
                largeInfowindow.addListener('closeclick', function() {
                    callback_markerClicked(marker); // stop bouncing
                    //        largeInfowindow.setMarker(null);
                    //toggleBounce(marker);
                });
            } // if
        } // function: populateInfowindow

    // /**
    //  * toggleBounce - description
    //  *
    //  * @param  {type} marker description
    //  * @return {type}        description
    //  */
    // function toggleBounce(marker) {
    //     // If the marker.animation == drop, then set it to null
    //     if (marker.getAnimation() == google.maps.Animation.Drop) {
    //         marker.setAnimation(null);
    //     }
    //     // If the selected marker is already animated, then stop animation.
    //     if (marker.getAnimation() !== null) {
    //         marker.setAnimation(null);
    //         _bouncingMarker = null;
    //     } else {
    //         // stop a marker that is already bouncing.
    //         if (_bouncingMarker) {
    //             _bouncingMarker.setAnimation(null);
    //             _bouncingMarker = null;
    //         }
    //         // Tell the marker to bounce.
    //         marker.setAnimation(google.maps.Animation.BOUNCE);
    //
    //         // Remember which marker is bouncing.
    //         _bouncingMarker = marker;
    //     }
    // }
    //
    /**
     * setMapStyles - description
     *
     * @return {type}  description
     */
    var setMapStyles = function() {
        smapStyles = [{
            featureType: 'water',
            stylers: [{
                color: '#19a0d8'
            }]
        }, {
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [{
                color: '#ffffff'
            }, {
                weight: 6
            }]
        }, {
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#e85113'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{
                color: '#efe9e4'
            }, {
                lightness: -40
            }]
        }, {
            featureType: 'transit.station',
            stylers: [{
                weight: 9
            }, {
                hue: '#e85113'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [{
                visibility: 'off'
            }]
        }, {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{
                lightness: 100
            }]
        }, {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{
                lightness: -100
            }]
        }, {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{
                visibility: 'on'
            }, {
                color: '#f0e4d3'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{
                color: '#efe9e4'
            }, {
                lightness: -25
            }]
        }, {

            featureType: "poi",
            elementType: "labels",
            stylers: [{
                visibility: "on"
            }]

        }];

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
            console.log("Retrieve places failed with code: ", google.maps.places.PlacesServiceStatus)
            return google.maps.places.PlacesServiceStatus;
        } else {
            // Remember the places
            self._places = results; // results == places

            createMarkers(results);

            g_callback_AddressProcessed();

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

    function createMarkers() {
        clearMarkers();

        var bounds = new google.maps.LatLngBounds();

        // TODO: remove ui code
        //var placesList = document.getElementById('list-items');

        // The following group uses the location array to create an array of markers
        // on initialize.
        // console.log("places.count:", places.length);
        for (var i = 0, place; place = self._places[i]; i++) {
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

            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function() {
              // todo: set the variable to remember which marker was clicked
              setSelectedMarkerByMarker(marker);
              callback_markerClicked(this); // toggle bounce
              publicMethods.populateInfowindow(this);
              //toggleBounce(this);
            });

            // push the marker to out array of _markers.
            var markerkey = "key-" + i;
            _markers.push({
                Key: markerkey,
                Marker: marker
            });

            bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);

        //g_callback();
    }

    /**
     * makeMarkerKey - description
     *
     * @param  {type} title description
     * @return {type}       description
     */
    function makeMarkerKey(title) {
        assert(title.length > 0);
        assert(typeof title == 'string');

        var sRv = title.repace(" ", "+");
    }

    /**
     * addressToLatlng - description
     *
     * @return {type}  description
     */
    function addressToLatlng() {
        // address = "sidney nsw";

        var loc;
        var geoLocStatus;
        var geoResults;
        var geocoder = new google.maps.Geocoder();

        // if (address == '') {
        //   window.alert('You must enter an area, or address.');
        // } else {
        // Geocode the address/area entered to get the center.
        geocoder.geocode({
            address: self._address
        }, function(results, status) {
            geoLocStatus = status;
            geoResults = results;
            if (status == google.maps.GeocoderStatus.OK) {
                loc = results[0].geometry.location;
                self.locationLatlon = results[0].geometry.location;
                map.setCenter(results[0].geometry.location);
                map.setZoom(15);
                getPlaces();
                g_callback_AddressFound(results[0].formatted_address);
            } else {
              // TODO: Error handler here; should display a message and do
              // something reasonable, remain on current map or show world map
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
        // }
        // Get POI
        // getPlaces();

        // return {status: geoLocStatus, location: loc};
    } //  addressToLatlng


    publicMethods.setSelectedMarker = function(key) {
      assert(key.length > 0);
      assert(typeof key == "string");

      var ndx = findMarkerInArrayByKey(_markers, key);
      if (ndx < 0) {  // not found
        // do something
        self._selectedMarker = undefined;
      } else {
        self._selectedMarker = _markers[ndx];
      }

      return self._selectedMarker;
    }


    function setSelectedMarkerByMarker(marker) {
      var ndx = findMarkerInArrayByMarker(_markers, marker);
      if (ndx < 0) { // not found
        // do something
      } else {
        self._selectedMarker = _markers[ndx];
      }

      return self._selectedMarker;
    }

    publicMethods.getSelectedMarker = function() {
      return self._selectedMarker;
    }

    /**
     * placeSelected - description
     *
     * @param  {type} d description
     * @return {type}   description
     */
    publicMethods.placeSelected = function(marker_key) {
      assert(marker_key == self._selectedMarker.Key);
      assert(self._selectedMarker);
        //var marker = d.getAttribute("data-id");

        // var ndx = findInArray(_markers, key);
        // if (ndx < 0) {  // not found
        //   // do something
        // }
        //
        // var data = _markers[ndx];
        // assert(data);
        publicMethods.populateInfowindow(self._selectedMarker.Marker);
    }

    // support methods
    function clearMarkers() {
        _markers.length = 0;
    }

    // return object containing public methods
    return publicMethods;
})();
