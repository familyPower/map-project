/*! project-6 10-12-2016 */
var vm=function(){function a(){return g_callback_AddressFound=b,g_callback_AddressProcessed=c,gm.setBouncingCallback(f),gm.setInfoWindowClosedCallback(g),assert(k.address().length>0),gm.initMap(l)}function b(a){k.formattedAddress(a)}function c(){var a=gm.getMarkersData();k.places.removeAll(),assert(0==k.places.length);for(var b,c=0;b=a[c],c<a.length;c++)k.places.push(b);nyt.getNYTArticles(k.address(),d),wiki.getWikipediaArticles(k.address(),e)}function d(a){if(a&&a.articles&&!(a.articles.length<=0)){k.nytData=a,k.nytArticles.removeAll();for(var b,c=0;b=a.articles.docs[c],c<a.articles.docs.length;c++)k.nytArticles.push({title:b.headline.main.split(";")[0],web_url:b.web_url})}}function e(a){if(k.wikipediaArticles.removeAll(),a&&a.articles&&a.articles.length>0){k.noWikipediaData(!1);for(var b,c=0;b=a.articles[c],c<a.articles.length;c++)k.wikipediaArticles.push({title:a.articles[1][c],web_url:a.articles[3][c]})}else k.noWikipediaData(!0)}function f(a,b){assert(a),assert("Key"in a),assert(isValidState(b)),assert(a.Marker);a.Marker;b==open?i(a):b==close?j(a):assert(!1)}function g(a,b){assert("Key"in a),assert(isValidState(b)),j(a)}function h(a){if(k.wikipediaPlaceInfoArray.removeAll(),a&&a.articles&&a.articles.length>0){k.noWikipediaPlaceData(!1);for(var b,c=0;b=a.articles[c],c<a.articles.length;c++)k.wikipediaPlaceInfoArray.push({wikiPlaceTitle:a.articles[1][c],wikiWeb_url:a.articles[3][c]})}else k.noWikipediaPlaceData(!0)}function i(a){assert(a&&a.Marker),wiki.getWikipediaArticles(a.Marker.title,h),k.selectedMarkerTitle(a.Marker.title),k.userSelectedLocation(!0)}function j(a){assert(a&&a.Marker),k.selectedMarkerTitle(null),k.userSelectedLocation(!1)}var k=this,l="Empire State Building";k.selectedMarkerTitle=ko.observable(),k.noWikipediaData=ko.observable(!1),k.noWikipediaPlaceData=ko.observable(!1),k.userSelectedLocation=ko.observable(!1),k.address=ko.observable("Empire State Building"),k.formattedAddress=ko.observable(),k.places=ko.observableArray(),k.nytArticles=ko.observableArray(),k.wikipediaArticles=ko.observableArray(),k.wikipediaPlaceInfoArray=ko.observableArray(),k._articlesNYT=ko.observableArray(),k.nytData=void 0;k.updateAddress=function(){var a=k.address();gm.updateMap(a,updateUIMarkers)},k.updateUIMarkers=function(){k.places.removeAll();var a=gm.getMarkersData();if(a&&!(a.length<=0))for(var b,c=0;b=a[c];c++){k.places.push({PlaceName:b.PlaceName,Key:b.Key})}};var m={};return m.filterChanged=function(a){gm.filterMarkers(a),k.updateUIMarkers()},m.initialize=function(){return a()},m.placeClicked=function(a){precondition("string"==typeof a),assert(a.trim().length>0);var b=gm.getSelectedMarker(),c=b?b:void 0;c?c.Key==a?(gm.toggleBounce(c.Marker),gm.closeInfoWindow(),gm.clearSelectedMarker(a),j(c)):c.Key!=a?(gm.toggleBounce(c),gm.closeInfoWindow(),gm.setSelectedMarker(a),c=gm.getSelectedMarker(),gm.toggleBounce(c.Marker),gm.populateInfowindow(c.Marker),i(c)):assert(!1):(gm.setSelectedMarker(a),c=gm.getSelectedMarker(),gm.populateInfowindow(c.Marker),gm.toggleBounce(c.Marker),i(c))},m}();ko.applyBindings(vm);