/**
 * Filename: script.js
 * Purpose: Serves as the View componenet to MVVM design patter.
 * Local Dependencies: ViewModel.js
 * External Dependencies: None.
 * Notes:
 */

window.onload = function() {

    // ko.applyBindings(vm);
    // vm.mapLocation("Giraffe");
    vm.initialize();

    // vm.initMap();

}

var placeClicked = function(ele) {
    precondition(ele);

    //assert(true === ele.hasAttribute('id'), "placeClicked");
    var eId = ele.id;

    //assert(true === ele.hasAttribute('data-Item-Marker'), "placeClicked");
    var mrkr_name = ele.getAttribute('data-Item-Marker');

    vm.placeClicked(eId);
}
