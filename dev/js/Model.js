
/**
 * Purpose: Interface with the ViewModel and the various data sources.
 * Internal Dependencies: googleMaps.js.
 * External Dependencies: None.
 * Comment: This file may be removed and the functionality moved to the
 *        ViewModel. This file adds a layer of abstraction along with
 *        additional complexity. At this point, I'm not sure the level of
 *        abstraction justifies the cost.
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
