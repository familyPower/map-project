
/**
 * Purpose: Interface with GoogleMaps.js and provide data to ViewModel.js.
 * Internal Dependencies: googleMaps.js.
 * External Dependencies: None.
 */

 var md = (function () {
   var self = this;

   // container for public methods
   var publicMethods = {};

   // public methods
   publicMethods.initMap = function () {
     //return gm.setAddress("sidney nsw");
     return gm.initMap();
   }


   // private methods
   var initialize = function () {

   }

   return publicMethods; // return object containing public methods
 }) ();
