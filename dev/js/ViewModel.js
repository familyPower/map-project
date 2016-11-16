
/**
 * Purpose: Acts as an interface to the model and provides data to the view.
 * Internal Dependencies: Model.js
 * External Dependencies: None.
 */

var vm = (function () {
  var self = this;

  // container for public methods
  var publicMethods = {};

  // public methods
  publicMethods.initialize = function () {
    self.initMap();
  }
  publicMethods.initMap = function () {
    return md.initMap();
  }


  // private methods
  var initialize = function () {

  }

  return publicMethods; // return object containing public methods
}) ();
