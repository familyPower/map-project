
/**
 * Purpose: Acts as an interface to the model and provides data to the view.
 * Internal Dependencies: Model.js
 * External Dependencies: None.
 */

var vm = (function () {
  var self = this;

  /****************************** Knockout Bindings **************************/
  self.address = ko.observable("Empire State Building");
  // self.address = ko.observable("World Map");

  // Submit button clicked.
  this.updateAddress = function() {
    // Get and save the new address to center map on.
    var newAddress = self.address();

    // update the map with the new address.
    gm.setAddress(newAddress);

  };

  // container for public methods
  var publicMethods = {};

  /****************************** Public Methods *****************************/
  publicMethods.initialize = function () {
    return gm.initMap();
  }

  publicMethods.initMap = function () {
    return gm.initMap();
  }

  /****************************** Private Methods ****************************/
  var initialize = function () {

  }

  // Expose public methods.
  return publicMethods; // return object containing public methods
}) ();

ko.applyBindings(vm);
