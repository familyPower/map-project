/**
 * Purpose: Acts as an interface to the model and provides data to the view.
 * Internal Dependencies: Model.js
 * External Dependencies: None.
 */

var vm = (function() {
    var self = this;

    /***************************** Knockout Bindings **************************/
    // The center of the map.
    //self.address = ko.observable("Empire State Building");
    self.address = ko.observable("World View");

    // The places found by google maps for address.
    self.places = ko.observableArray();

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
      places.removeAll();

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

            self.places.push({
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

    /****************************** Support Methods ***************************/

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

      // called after map address updated.
      g_callback_AddressFound = addressFound;

        return gm.initMap();
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

        gm.placeSelected(mrkr_id);
//        nytApi.getNYTArticles();

        //"var mrkr = $(this).data('item-marker'); gm.populateInfowindow(mrkr);"
    }

    function addressFound(formattedAddress) {
      var articles = nyt.getNYTArticles(formattedAddress);
      var wikiArticles = wiki.getWikipediaArticles(formattedAddress);
    }
    /**************************** End Public Methods **************************/

    // Expose public methods.
    return publicMethods; // return object containing public methods
})();

ko.applyBindings(vm);
