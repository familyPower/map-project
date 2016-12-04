/**
 * Purpose: Acts as an interface to the model and provides data to the view.
 * Internal Dependencies: Model.js
 * External Dependencies: None.
 */

var vm = (function() {
    var self = this;

    /****************************** Constants */
    var DEFAULT_LOCATION = "Empire State Building";

    /***************************** Knockout Bindings **************************/
    // Keeps
    var _bouncingMarker;
    self.selectedMarkerTitle = ko.observable();

    //
    self.noWikipediaData = ko.observable(false);

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

    // Container for Wikipedia articles
    self.wikipediaArticles = ko.observableArray();

    self.nytData = undefined;

    // holds articles from the New York Times
    self._articlesNYT = ko.observableArray();

    // Submit button clicked.
    self.updateAddress = function() {
        // Get and save the new address to center map on.
        var newAddress = self.address();

        // set the new address and update the map.
        gm.updateMap(newAddress, updateUIMarkers);

        //g_callback = self.updateUIMarkers;
        // // update the map with the new address.
        // gm.updateMap(newAddress);

        // Update the places found for address
        //var plcs = gm.getPlaces();

        // Update UI with markers
        //self.updateUIMarkers();
    };

    self.updateUIMarkers = function() {
      self.places.removeAll();

        var dataArray = gm.getMarkersData();

        // no marker data
        if (!dataArray || dataArray.length <= 0) {
            return;
        }

        // // Retrieve the <ul> element that will hold the list of markers
        // var $ulElement = $('#marker-list');
        // var $ulChildren = $('#marker-list').children;
        //
        // for (var i = 0, marker; marker = markers[i]; i++) {
        //     // Add the new Marker information
        //     $ulElement.append('<li>' + marker.title + '</li>');
        //     var $lastChild = $ulElement.children().last();
        //
        //     $lastChild.attr('id', "item-" + i);
        //     $lastChild.attr('class', "marker-list-items");
        //     $lastChild.data("item-marker", marker);
        //
        //     // var a = $lastChild.data("item-marker");
        //     // var u1 = $lastChild.data("item-marker");
        //
        //     // Add click event to trigger actions like marker selected.
        //     $lastChild.click(function() {
        //         var mrkr = $(this).data('item-marker');
        //         gm.populateInfowindow(mrkr);
        //     });
        //
        //     var u = $('#marker-list:last-child').data('item-marker');
        // }
        // places.extend({
        //     rateLimit: 50
        // });
console.log("count-before:", self.places().length);
        for (var i = 0, data; data = dataArray[i]; i++) {
console.log("place:", data.PlaceName);
            var ulElement;

            self.updateUIMarkers.push({
                placeName: data.PlaceName,
                idString: data.Key,
            });
            //            console.log("ulElement-", i, ulElement);
            //            places.push(ulElement);

console.log("self.places.length:", self.places.length);
        }
console.log("count-after:", self.places().length);
console.log("places-", places());
        //places.sort():
    }

    // /****************************** Support Methods ***************************/
    // /**
    //  * toggleBounce - description
    //  *
    //  * @param  {type} marker description
    //  * @return {type}        description
    //  * Assumptions           There several significant assumptions. first
    //  *    only selected markers are bouncing.
    //  *  2) Only one marker is bouncing at a time, this only one marker is ever
    //  *      selected.
    //  *  3) If no marker is bouncing, then nothing is selected.
    //  *  4) If a marker or place is selected, then the marker will bounce.
    //  *  5) If a second marker/place is selected when a marker is bouncing, then
    //  *    the first marker will stop bouncing and the newly selected marker will
    //  *    start bouncing.
    //  */
    // function toggleBounce(mkr) {
    //   var marker = mkr;
    //   //self.selectedMarkerTitle();
    //     // If the marker.animation == drop, then set it to null
    //
    //     if (self._selectedMarker)
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
    //             _bouncingMarker = undefined;
    //         }
    //         // Tell the marker to bounce.
    //         marker.setAnimation(google.maps.Animation.BOUNCE);
    //
    //         // Remember which marker is bouncing.
    //         self._bouncingMarker = marker;
    //         self.selectedMarkerTitle(_bouncingMarker.title);
    //     }
    // }
    //

    /**
     * isMarker - description
     *
     * @param  {type} element The current element being processed in the array.
     * @param  {type} index   The index of the current element being processed in the array.
     * @param  {type} array   The array find was called upon.
     * @return {type}         description
     */
    function isMarker(element, index, array) {
      var data = array[index];

      if (data.Key == element) {
        return array[index];
      }

      return undefined;
    }

    /***************************End Support Methods ***************************/

    /****************************** Public Methods *****************************/
    // container for public methods
    var publicMethods = {};

    publicMethods.initialize = function() {

        return initMap();
    }

    function initMap() {

      // Set callbacks. This is necessary because calls to google maps appear
      // to be asynchronous.
      g_callback_AddressFound = addressFound;
      g_callback_AddressProcessed = addressProcessed;
      gm.setBouncingCallback(bouncingStopedStarted);
      gm.setInfoWindowClosedCallback(infoWindowClosed);

      assert(self.address().length > 0);
      //gm.updateMap(self.address());
      return gm.initMap(DEFAULT_LOCATION);
    }

    publicMethods.placeClicked = function(mrkr_id) {
        precondition(typeof mrkr_id == "string");
        assert(mrkr_id.trim().length > 0);

        // var ndx = findInArray(self.places(), mrkr_id);
        // if (ndx < 0) { // not found
        //   // do something
        // }
        //
        // assert(ndx < self.places().length);
        //
        // var m = data.Marker;
        // var k = data.Key;

        // start/stop bouncing

        var marker = ! gm.getSelectedMarker() ? undefined :
                          gm.getSelectedMarker();

        // No markers currently selected.
        if ( ! marker /*&& gm.getSelectedMarker() === self._selectedMarker*/) {
          gm.setSelectedMarker(mrkr_id);
          marker = gm.getSelectedMarker();
          gm.populateInfowindow(marker.Marker);
          gm.toggleBounce(marker.Marker);
          self.selectedMarkerTitle(marker.Marker.title);
          self.userSelectedLocation(true);

//          self.userSelectedLocation(true);
        } else if (marker.Key == mrkr_id)
          // marker already selected and it's the same marker
          // stop bouncing,
          // clear infoWindow,
          // clear selected marker
        {
          gm.toggleBounce(marker.Marker);
          gm.closeInfoWindow();
          gm.clearSelectedMarker(mrkr_id);
          self.selectedMarkerTitle(null);
          self.userSelectedLocation(false);
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
          self.selectedMarkerTitle(marker.Marker.title);
          self.userSelectedLocation(true);
        } else
          // Some sort of error occurred or some unexpected/unplanned condition
          // occurred. Should never get here.
        {
          assert(false);
        }

        function showHideMarkerLinks() {
          var marker = gm.getSelectedMarker();

          // No selected marker.
          if (! marker) {
            self.selectedMarkerTitle(null);
            self.userSelectedLocation(false);
          } else
          // Marker selected
          // Set observables,
          // Search sites for info on marker using title.
          {
            self.selectedMarkerTitle(marker.title);
            self.userSelectedLocation(true);
          }
        }

//        gm.placeSelected(mrkr_id);
//        nytApi.getNYTArticles();

        //"var mrkr = $(this).data('item-marker'); gm.populateInfowindow(mrkr);"
    }
    /**************************** End Public Methods **************************/

    /**************************** Callbacks **************************/

    function addressFound(formattedAddress) {
      // Display the address found
      self.formattedAddress(formattedAddress);
    }

    function addressProcessed() {
      // Get the places represented by the markers.
      var markers = gm.getMarkersData();

      // Remove existing data from the observableArray of markers.
      self.places.removeAll();

      assert(0 == self.places.length);

      // Fill the observable array with new data.
      for( var i = 0, marker; marker = markers[i], i < markers.length; i++) {
        self.places.push(marker);
      }

      // Retrieve information for the address.
      nyt.getNYTArticles(self.address(), nytArticlesFound);
      wiki.getWikipediaArticles(self.address(), wikipediaArticlesFound);

    }

    /**
     * nytArticlesFound - description
     *
     * @param  {type} nytD The results from calling the NYT web service.
     * @return {type}      None
     * @comment
     * @TODO Modify code so that aged articles do not appear.
     */
    function nytArticlesFound(nytD) {
      self.nytData = nytD;
      self.nytArticles.removeAll();
      for( var i = 0, item; item = nytD.articles.docs[i], i < nytD.articles.docs.length; i++) {
        self.nytArticles.push({title: item.headline.main.split(";")[0],
          web_url: item.web_url});
      }
    }

    function wikipediaArticlesFound(wikipediaD) {
      self.wikipediaArticles.removeAll();

      if ( wikipediaD && wikipediaD.articles && wikipediaD.articles.length > 0 ) {
        self.noWikipediaData(false);
        //Load the observablearray with relevant data.
        for( var i = 0, item; item = wikipediaD.articles[i], i < wikipediaD.articles.length; i++) {
          self.wikipediaArticles.push({title: wikipediaD.articles[1][i],
          web_url: wikipediaD.articles[3][i]});
        }
      } else {
        self.noWikipediaData(true);
      }
    }
    function bouncingStopedStarted(mrkr, state) {
      assert(mrkr);
      assert('Key' in mrkr);
      assert(isValidState(state));
      assert(mrkr.Marker);

      var marker = mrkr.Marker;

      // Open the details view and show info
      if( state == open ) {
        self.selectedMarkerTitle(marker.title);
        self.userSelectedLocation(true);
      } else if (state == close) {
        self.selectedMarkerTitle(null);
        self.userSelectedLocation(false);
      } else {
        // this should never happen
        assert(false);
      }
    }
    function infoWindowClosed(mrkr, state) {
      assert ('Key' in mrkr);
      assert (isValidState(state));

      self.selectedMarkerTitle(null);
      self.userSelectedLocation(false);
    }
    /**************************** End Callbacks **************************/

    // Expose public methods.
    return publicMethods; // return object containing public methods
})();

ko.applyBindings(vm);
