/** done.
 * Filename: GoogleMap.js
 * Purpose: This file interfaces with maps.google.com.
 * Internal Dependencies: None.
 * External Dependencies: maps.google.com
 * Notes:      //https://snazzymaps.com
 *
 */

/**
 * Globally defined callback functions.
 * Note: There is no reason for these to be devied globally, consider moving
 * them into gm.
 *
 */
g_callback_AddressFound = undefined;
g_callback_AddressProcessed = undefined;
var gm = (function() {
    /*************************** Member Variables ***************************/
    var self = this;

    /**
     * Callback defined internally to gm. A publicMethods function is used to
     * set them.
     */
    // TODO: add "_" to each private variable to indicate that it's private.
    var callback_markerClicked;
    var callback_infoWindowClosed;

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
    var publicMethods = {};

    /*************************** public methods ***************************/

    /**
     * publicMethods - Getter for address.
     *
     * @return {type}  string
     */
    publicMethods.getAddress = function() {
        return self._address;
    }

    /**
     * publicMethods - Setter for address.
     *
     * @param  {type} addr String.
     * @return {type}      None.
     */
    publicMethods.setAddress = function(addr) {
        if (addr && addr.length > 0) {
            self._address = addr;
        }

        return self._address;
    }

    /**
     * getMarkersData - Takes the list of marker in _markers and puts them into
     *    a custom object which is stored in an array.
     *
     * @return {type}  The array of markers with custome information.
     */
    publicMethods.getMarkersData = function() {
        var returnArray = [];
        var title;
        var key;
        for (var data, i = 0; i < _markers.length, data = _markers[i]; i++) {
            if (true == data.Marker.visible) {
                title = data.Marker.title;
                key = data.Key;
                returnArray.push({
                    Key: key,
                    PlaceName: title
                });
            }
        }
        return returnArray;
    }

    /**
     * initMap - Initializes GoogleMap.
     *
     * @return {type}  None.
     */
    publicMethods.initMap = function(address) {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: new google.maps.LatLng(0, 0), //40.748817, -73.985428),
            //center: {lat: 0, lng: 0},
            zoom: 20,
            //minZoom: 1,
            styles: setMapStyles(),
            mapTypeId: 'roadmap',
            mapTypeControl: false
        });

        bounds = new google.maps.LatLngBounds();
        largeInfowindow = new google.maps.InfoWindow();

        publicMethods.updateMap(address);
    }

    /**
     * setBouncingCallback - Sets the callback to call when bouncing starts/
     *      stops.
     *
     * @param  {type} callback The function to call.
     * @return {type}          None.
     */
    publicMethods.setBouncingCallback = function(callback) {
        precondition(callback);

        callback_markerClicked = callback; // bounce function
    }

    /**
     * setInfoWindowClosedCallback - Sets the function to call when the
     *    Infowindow closes.
     *
     * @param  {type} callback The function to call.
     * @return {type}          None.
     */
    publicMethods.setInfoWindowClosedCallback = function(callback) {
        callback_infoWindowClosed = callback;
    }

    /**
     * updateMap - Updates the address of the center of the map.
     *
     * @param  {type} address The new address.
     * @return {type}         None.
     */

    publicMethods.updateMap = function(address) {
        var addr = publicMethods.setAddress(address);
        addressToLatlng(address);
    }

    /**
     * populateInfowindow - description
     *
     * @param  {type} mrkr - A marker used to populate the Infowindow.
     * @return {type}        None.
     */
    publicMethods.populateInfowindow = function(mrkr) {
        var marker; // contains only GoogleMap information.
        var theMarker; // includes application specific information.

        if ('Key' in mrkr) {
            marker = mrkr.Marker;
            theMarker = mrkr;
        } else {
            assert(mrkr.position.equals(publicMethods.getSelectedMarker().Marker.position));

            marker = publicMethods.getSelectedMarker().Marker;
            theMarker = publicMethods.getSelectedMarker();
        }

        // Check to make sure the infowindow is not already opened on this marker.
        if (largeInfowindow.marker == null || largeInfowindow.marker != marker) {
            largeInfowindow.marker = marker;
            largeInfowindow.setContent('<div>' + marker.title + '</div>');
            largeInfowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            largeInfowindow.addListener('closeclick', function() {
                infoWindowClosed(theMarker);
            });
        }
    }

    /**
     * closeInfoWindow - Closes the infowindow then ensures the state if set.
     *
     * @return {type}  None.
     */
    publicMethods.closeInfoWindow = function() {
        largeInfowindow.close();
        largeInfowindow.marker = null;
    }

    /**
     * toggleBounce - toggleBounce
     *
     * @param  {type} mrkr The marker that shoule start/stop bouncing.
     * @return {type}        None.
     */
    publicMethods.toggleBounce = function(mrkr) {
        precondition(self._selectedMarker || mrkr);

        var marker = mrkr ? (('Key' in mrkr) ? mrkr.Marker : mrkr) : self._selectedMarker.Marker;
        // If the marker.animation == drop, then set it to null

        if (marker.getAnimation() && marker.getAnimation() ==
            google.maps.Animation.BOUNCE) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    /**
     * publicMethods - clearSelectedMarker: Clears the currently selected marker
     *      to undefined. This indicates that no marker is selected.
     *
     * @return {type}  None
     */
    publicMethods.clearSelectedMarker = function() {
        self._selectedMarker = undefined;
    }

    /**
     * setSelectedMarker - Sets the marker the user clicked selected in the
     *    POI list (left of map). Also sets the currently selected marker
     *    variable. If the marker is not found (should never happen), the
     *    currently selected marker variable is sete to undefined.
     *
     * @param  {type} key The key of the marker for the element clicked on.
     * @return {type}     Returns the currently selected marker.
     */
    publicMethods.setSelectedMarker = function(key) {
        assert(key.length > 0);
        assert(typeof key == "string");

        var ndx = findMarkerInArrayByKey(_markers, key);
        if (ndx < 0) { // not found
            // do something
            self._selectedMarker = undefined;
        } else {
            self._selectedMarker = _markers[ndx];
        }

        return self._selectedMarker;
    }

    /**
     * findMarkerFromMarker - findMarkerFromMarker: Searches to find a marker in the
     *    array of markers given a marker to search for.
     *
     * @param  {type} mrkr The marker to find.
     * @return {type}      The index of the desired marker or < 0 if marker
     *        isn't found.
     */
    publicMethods.findMarkerFromMarker = function(mrkr) {
        var ndx = findMarkerInArrayByMarker(_markers, mrkr);

        if (ndx >= 0) {
            return _markers[ndx];
        }
    }

    /**
     * getSelectedMarker - Returns the currently selected marker.
     *
     * @return {type}  Marker.
     */
    publicMethods.getSelectedMarker = function() {
        return self._selectedMarker ? self._selectedMarker : undefined;
    }

    /**
     * filterMarkers - Sets to visible all marker that meet the filter type. All
     *      other markers are made invisible.
     *
     * @param  {type} category The GoogleMaps category type.
     * @return {type}          None.
     * <p>
     * Postcondition: The visibility state of each marker is set according to
     *    whether or not the marker is of the correct type.
     * </p>
     * Credit: Peter @ jsfiddle: http://jsfiddle.net/peter/drytwvL8/
     */
    publicMethods.filterMarkers = function(category) {
        assert(_markers);
        var markers = _markers;

        for (i = 0; i < markers.length; i++) {
            var marker = markers[i].Marker;

            // If is same category or category not picked
            if (category == "all" || category.length === 0 || arrayContains(marker.category, category)) {
                marker.setVisible(true);
            }
            // Categories don't match
            else {
                marker.setVisible(false);
            }
        }
    }


    /*************************** private methods ***************************/

    /**
     * setMapStyles - Sets the styles of the map.
     * @return {type}  None.
     * <p>
     * TODO: Consider making map styles variable so that user can set the style.
     * </p>
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

    /**
     * getPlaces - Calls the GoogleMaps api to get a list of places. Gets the
     *    location from the center of the map, which should be the closest
     *    location matching the criteria entered by the user.
     *
     * @return {type}  None.
     */
    function getPlaces() {
        var service = new google.maps.places.PlacesService(map);

        self._places = [];
        service.nearbySearch({
            location: map.center,
            radius: 16000,
            types: ['park', 'library', 'zoo', 'museum', 'aquarium']
        }, processResults);
    }

    /**
     * processResults - Processes the results from the call to GoogleMaps
     *    PlacesService api. Calls a callback to inform UI of new markers.
     *
     * @param  {type} results    The results found by the search.
     * @param  {type} status     Success or Faile
     * @param  {type} pagination The number of pages in results.
     * @return {type}            None.
     */
    function processResults(results, status, pagination) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
            alert("Retrieve places failed with code: ", google.maps.places.PlacesServiceStatus)
            return google.maps.places.PlacesServiceStatus;
        } else {
            // Remember the places
            Array.prototype.push.apply(self._places, results); // results == places

            // Create the markers.
            createMarkers(results);

            // Notify UI of new markers.
            g_callback_AddressProcessed();

            // Are there more pages?
            if (pagination.hasNextPage) {
                pagination.nextPage();
            }
        }
    }

    /**
     * createMarkers - Creates the markers from the places found.
     *
     * @return {type}  None.
     */
    function createMarkers() {
        // assumes that places will always be found. ummm?
        precondition(self._places && self._places.length > 0);

        clearMarkers();

        var bounds = new google.maps.LatLngBounds();

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
                position: place.geometry.location,
                category: place.types
            });

            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function() {
                markerClicked(this); // toggle bounce
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

        // !!! Big assumption here!! There may not be any places and thus no
        // markers to create.
        Postcondition(_markers && _markers.length > 0);
    }

    /**
     * addressToLatlng - Sets the center of the map to the new address.
     *
     * @return {type}  None.
     */
    function addressToLatlng() {
        // address = "sidney nsw";

        var loc;
        var geoLocStatus;
        var geoResults;
        var geocoder = new google.maps.Geocoder();

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
                // TODO: Better Error handler here; should display a message and do
                // something reasonable, remain on current map or show world map
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    /**
     * markerClicked - Sets application state based the the current state of
     *    application and the action (which marker the user clicked) of the
     *    user. See comments for details.
     *
     * @param  {type} marker The marker the user clicked on.
     * @return {type}        None.
     */
    function markerClicked(marker) {
        var currentMarker = self._selectedMarker;
        var newMarker = publicMethods.findMarkerFromMarker(marker);
        assert(newMarker && 'Key' in newMarker);

        self._selectedMarker = null;

        if (!currentMarker)
        // There is no current marker. So the clicked marker is a new marker
        {
            // Update the currently selected marker
            self._selectedMarker = currentMarker = newMarker;

            // start the new marker bouncing
            publicMethods.toggleBounce();

            // open the infoWindow
            publicMethods.populateInfowindow(self._selectedMarker);

            // notify UI
            callback_markerClicked(currentMarker, open);

        } else if (currentMarker && currentMarker.Key == newMarker.Key)
        // The marker clicked is the same as the currently selected marker
        // Stop bouncing, closeInfoWindow, notify UI
        // Stop bouncing
        {
            if (marker.getAnimation() == google.maps.Animation.BOUNCE) {
                publicMethods.toggleBounce(currentMarker);
            }
            // closeInfoWindow
            publicMethods.closeInfoWindow();
            // notify UI
            callback_markerClicked(currentMarker, close);
        } else if (currentMarker && currentMarker.Key != newMarker.Key)
        // The a different marker was clicked, so
        // Stop the currently bouncing marker, close the currentInfoWindow
        // Notify UI
        // then
        // Update the currently selected marker, start the new marker bouncing,
        // open the infoWindowClosed, notify UI
        {
            // Stop bouncing
            if (currentMarker.Marker.getAnimation() == google.maps.Animation.BOUNCE) {
                publicMethods.toggleBounce(currentMarker);
            }
            // close the currentInfoWindow
            publicMethods.closeInfoWindow();

            // Notify UI
            callback_markerClicked(currentMarker, close);

            // Update the currently selected marker
            self._selectedMarker = newMarker;

            // start the new marker bouncing
            publicMethods.toggleBounce(newMarker);

            // open the infoWindow
            publicMethods.populateInfowindow(self._selectedMarker);

            // notify UI
            callback_markerClicked(currentMarker, open);
        }
    }

    /**
     * infoWindowClosed - Sets application state when user closes the
     *    infoWindow. This is a callback method assigned when the infoWindow is
     *    created.
     *
     * @param  {type} marker The marker associated with the infoWindow.
     * @return {type}        None.
     *
     */
    function infoWindowClosed(marker) {
        // stop bouncing
        publicMethods.toggleBounce();

        // close infoWindow
        publicMethods.closeInfoWindow();

        // notify UI
        callback_infoWindowClosed(marker, close);
    }


    /**
     * clearMarkers - Empties the markers array.
     *
     * @return {type}  None.
     */
    function clearMarkers() {
        _markers.length = 0;

        // ensure array continues to exist.
        assert(_markers);

        postcondition(_markers.legth > 0);
    }


    // return object containing public methods
    return publicMethods;
})();
