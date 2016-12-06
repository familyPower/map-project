/**
 * @Filename: ViewModel.js
 * Purpose: Acts as an interface to the model and provides data to the view.
 * Internal Dependencies: wikiApi.js, GogleMap.js, nytApi.js
 * External Dependencies: None.
 */

var vm = (function() {
    var self = this;

    /****************************** Constants */
    var DEFAULT_LOCATION = "Empire State Building";

    /***************************** Knockout Bindings **************************/
    self.selectedMarkerTitle = ko.observable();

    //
    self.noWikipediaData = ko.observable(false);
    self.noWikipediaPlaceData = ko.observable(false);
    //
    self.userSelectedLocation = ko.observable(false);

    // The center of the map.
    //self.address = ko.observable("Empire State Building");
    self.address = ko.observable("Empire State Building");

    // Address found by googleMaps.
    self.formattedAddress = ko.observable();

    // The places found by google maps for address.
    self.places = ko.observableArray();

    // Container for news articles
    self.nytArticles = ko.observableArray();

    // Container for wikipediaInfopedia articles
    self.wikipediaArticles = ko.observableArray();
    self.wikipediaPlaceInfoArray = ko.observableArray();

    // holds articles from the New York Times
    self._articlesNYT = ko.observableArray();

    self.nytData = undefined;
    var _bouncingMarker;

    // Submit button clicked.

    /**
     * updateAddress - Called my the view to notify that the user changed
     *    the location of the center of the map. Calls GoogleMaps to notify
     *    api of the change.
     *
     * @return {type}  None.
     */
    self.updateAddress = function() {
        // Get and save the new address to center map on.
        var newAddress = self.address();

        // set the new address and update the map.
        gm.updateMap(newAddress, updateUIMarkers);
    };

    /**
     * updateUIMarkers - Updates the UI markers.
     *
     * @return {type}  None.
     */
    self.updateUIMarkers = function() {
        self.places.removeAll();

        var dataArray = gm.getMarkersData();

        // no marker data
        if (!dataArray || dataArray.length <= 0) {
            return;
        }

        for (var i = 0, data; data = dataArray[i]; i++) {
            var ulElement;

            self.places.push({
                PlaceName: data.PlaceName,
                Key: data.Key,
            });
        }
    }

    /***************************End Support Methods ***************************/

    /****************************** Public Methods *****************************/
    // container for public methods
    var publicMethods = {};

    /**
     * filterChanged - Notified by UI that the user selected a different filter.
     *    Updates application state to reflect changes.
     *
     * @param  {type} value The value of the selected filter. Should match
     *                      GoogleMaps type values.
     * @return {type}       None.
     */
    publicMethods.filterChanged = function(value) {
        gm.filterMarkers(value);
        self.updateUIMarkers();
    }

    /**
     * initialize - Called by UI to initialize application and apis.
     *
     * @return {type}  None.
     */
    publicMethods.initialize = function() {

        return initMap();
    }

    /**
     * initMap - Initializes GoogleMap.js including assigning callbacks.
     *
     * @return {type}  None.
     */
    function initMap() {

        // Set callbacks. This is necessary because calls to google maps appear
        // to be asynchronous.
        g_callback_AddressFound = addressFound;
        g_callback_AddressProcessed = addressProcessed;
        gm.setBouncingCallback(bouncingStopedStarted);
        gm.setInfoWindowClosedCallback(infoWindowClosed);

        assert(self.address().length > 0);

        return gm.initMap(DEFAULT_LOCATION);
    }

    /**
     * placeClicked - Notified that user selected a place from the list.
     *      See code for additional comments.
     * @param  {type} mrkr_id The key identifying the marker, also element id.
     * @return {type}         None.
     */
    publicMethods.placeClicked = function(mrkr_id) {
        precondition(typeof mrkr_id == "string");
        assert(mrkr_id.trim().length > 0);

        var selectedMarker = gm.getSelectedMarker();
        var marker = !selectedMarker ? undefined :
            selectedMarker;

        // No markers currently selected.
        if (!marker /*&& gm.getSelectedMarker() === self._selectedMarker*/ ) {
            gm.setSelectedMarker(mrkr_id);
            marker = gm.getSelectedMarker();
            gm.populateInfowindow(marker.Marker);
            gm.toggleBounce(marker.Marker);
            showPlacesDetailRow(marker);

        } else if (marker.Key == mrkr_id)
        // marker already selected and it's the same marker
        // stop bouncing,
        // clear infoWindow,
        // clear selected marker
        {
            gm.toggleBounce(marker.Marker);
            gm.closeInfoWindow();
            gm.clearSelectedMarker(mrkr_id);
            hidePlacesDetailRow(marker);
        } else if (marker.Key != mrkr_id)
        // marker alaready selected and bouncing and infoWindow present.
        // Stop bouncing and close infoWindow
        // selected marker
        // Start bouncing
        // Show inforwindo
        {
            gm.toggleBounce(marker);
            gm.closeInfoWindow();
            gm.setSelectedMarker(mrkr_id);

            marker = gm.getSelectedMarker();
            gm.toggleBounce(marker.Marker);
            gm.populateInfowindow(marker.Marker);
            showPlacesDetailRow(marker);
        } else
        // Some sort of error occurred or some unexpected/unplanned condition
        // occurred. Should never get here.
        {
            assert(false);
        }
    }

    /**************************** End Public Methods **************************/

    /**************************** Callbacks **************************/

    /**
     * addressFound - callback function to notify ViewModel that GoogleMap
     *    found an address.
     *
     * @param  {type} formattedAddress description
     * @return {type}                  description
     */
    function addressFound(formattedAddress) {
        // Display the address found
        self.formattedAddress(formattedAddress);
    }

    /**
     * addressProcessed - Called when GoogleMaps finishes processing an
     *    address. This function handles updating the ViewModel's state and
     *    requesting NYT and wikipedia articles for the address.
     *
     * @return {type}  None.
     */
    function addressProcessed() {
        // Get the places represented by the markers.
        var markers = gm.getMarkersData();

        // Remove existing data from the observableArray of markers.
        self.places.removeAll();

        assert(0 == self.places.length);

        // Fill the observable array with new data.
        for (var i = 0, marker; marker = markers[i], i < markers.length; i++) {
            self.places.push(marker);
        }

        // Retrieve information for the address.
        nyt.getNYTArticles(self.address(), nytArticlesFound);
        wiki.getWikipediaArticles(self.address(), wikipediaArticlesFound);

    }

    /**
     * nytArticlesFound - This function is called by the New York Times api
     *  after it completes the request. This function processes the data sent
     *  by the NYT api and sets the knockout variables so the ui is updated.
     *
     * @param  {type} nytD The results from calling the NYT web service.
     * @return {type}      None
     * @comment
     * @TODO Modify code so that aged articles do not appear.
     */
    function nytArticlesFound(nytD) {
        self.nytData = nytD;
        self.nytArticles.removeAll();
        for (var i = 0, item; item = nytD.articles.docs[i], i < nytD.articles.docs.length; i++) {
            self.nytArticles.push({
                title: item.headline.main.split(";")[0],
                web_url: item.web_url
            });
        }
    }

    /**
     * wikipediaArticlesFound - This function is called by the Wikipedia api
     *  after it finishes processing a request for articles. This function
     * processes the data sent by the api and sets the knockout variables
     * so the ui is updated.
     *
     * @param  {type} wikipediaD The wikipedia data
     * @return {type}            None.
     */
    function wikipediaArticlesFound(wikipediaD) {
        self.wikipediaArticles.removeAll();

        if (wikipediaD && wikipediaD.articles && wikipediaD.articles.length > 0) {
            self.noWikipediaData(false);
            //Load the observablearray with relevant data.
            for (var i = 0, item; item = wikipediaD.articles[i], i < wikipediaD.articles.length; i++) {
                self.wikipediaArticles.push({
                    title: wikipediaD.articles[1][i],
                    web_url: wikipediaD.articles[3][i]
                });
            }
        } else {
            self.noWikipediaData(true);
        }
    }


    /**
     * bouncingStopedStarted - Indicates a marker that has started or stopped
     *    bouncing. The marker details pane is opened or closed based on the
     *    of state. If state is open, marker is bouncing, then the marker
     *    detail pane is visible. If the state is close, marker is not bouncing
     *    then the marker detail pane is made invisible. This function is called
     *    by both the ViewModel and GoogleMap.js files since the marker's
     *    animation state can be changed in both locations.
     *
     * @param  {type} mrkr  The marker that stopped / started bouncing.
     * @param  {type} state What should the state of the marker detail pane be?
     * @return {type}       None.
     */
    function bouncingStopedStarted(mrkr, state) {
        assert(mrkr);
        assert('Key' in mrkr);
        assert(isValidState(state));
        assert(mrkr.Marker);

        var marker = mrkr.Marker;

        // Open the details view and show info
        if (state == open) {
            showPlacesDetailRow(mrkr);
        } else if (state == close) {
            hidePlacesDetailRow(mrkr);
        } else {
            // this should never happen
            assert(false);
        }
    }

    /**
     * infoWindowClosed - A callback function that notifies the ViewModel that
     *    the InfoWindow closed.
     *
     * @param  {type} mrkr  The marker belonging to the infowindow.
     * @param  {type} state The state of the marker (open, close).
     * @return {type}       description
     */
    function infoWindowClosed(mrkr, state) {
        assert('Key' in mrkr);
        assert(isValidState(state));

        hidePlacesDetailRow(mrkr);
    }

    /**
     * callback_wikipediaPlaceDetailInfoDone - This callback function is called
     *    by the wikipedia api after it finishes retrieving articles for the
     *    marker detail pane.
     *
     * @param  {type} wikipediaD
     *
     * @return {type}            description
     */
    function callback_wikipediaPlaceDetailInfoDone(wikipediaD) {
        self.wikipediaPlaceInfoArray.removeAll();

        // Is there data to process?
        if (wikipediaD && wikipediaD.articles && wikipediaD.articles.length > 0) {
            // Notify UI that there is data.
            self.noWikipediaPlaceData(false);
            //Load the observablearray with relevant data.
            for (var i = 0, item; item = wikipediaD.articles[i], i < wikipediaD.articles.length; i++) {
                self.wikipediaPlaceInfoArray.push({
                    wikiPlaceTitle: wikipediaD.articles[1][i],
                    wikiWeb_url: wikipediaD.articles[3][i]
                });
            }
        } else {
            // Notify UI that there is no data for the detail pane.
            self.noWikipediaPlaceData(true);
        }

    }

    /**************************** End Callbacks **************************/

    /**
     * showPlacesDetailRow - Makes the marker detail pane visible and requests
     *    data to populate the marker detail pane.
     *
     * @param  {type} mrkr The marker for which articles are needed.
     * @return {type}      None.
     */
    function showPlacesDetailRow(mrkr) {
        assert(mrkr && mrkr.Marker);

        // Retrieve wikipedia data
        wiki.getWikipediaArticles(mrkr.Marker.title, callback_wikipediaPlaceDetailInfoDone);

        // Update the UI with the marker title.
        self.selectedMarkerTitle(mrkr.Marker.title);

        // Show the marker detail pane.
        self.userSelectedLocation(true); //noWikipediaPlaceData
    }

    /**
     * hidePlacesDetailRow - Cleans up and makes the marker detail pane invisible.
     *
     * @param  {type} mrkr description
     * @return {type}      description
     */
    function hidePlacesDetailRow(mrkr) {
        assert(mrkr && mrkr.Marker);

        // Remove the marker title.
        self.selectedMarkerTitle(null);

        // Hide the marker detail pane.
        self.userSelectedLocation(false);

        // Clean up wikipedia data
    }

    // Expose public methods.
    return publicMethods; // return object containing public methods
})();

ko.applyBindings(vm);
