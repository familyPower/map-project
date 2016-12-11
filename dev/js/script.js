/** done
 * Filename: script.js
 * Purpose: Serves as the View componenet to MVVM design patter.
 * Local Dependencies: ViewModel.js
 * External Dependencies: None.
 * Notes:
 */

var gm_Error = false;

/**
 * window.onload handles initialization required once the window is loaded.
 *
 * @return {type}  None.
 *
 * <p>
 * precondition: window is loaded along with js files.
 * postcondition: All initialization is complete.
 * </p>
 */
window.onload = function() {

    // ko.applyBindings(vm);
    // vm.mapLocation("Giraffe");
    if (false == gm_Error) {
        vm.initialize();
    }
    // vm.initMap();

}


/**
 * placeClicked - Indicates that the user clicked on a Place listed in the panel
 *    to the left of the map.
 *
 * @param  {type} ele The element selected by the user.
 * @return {type}     None.
 *
 * <p>
 * Notifies the ViewModel (vm) that the user selected a Place and what the id of
 * the selected place.
 * </p>
 */
var placeClicked = function(ele) {
    precondition(ele);

    var eId = ele.id;

    vm.placeClicked(eId);
}

/**
 * filterChanged - Notifies the ViewModel that the user changed the filterChanged
 *         selection.
 *
 * @param  {type} value The value of the selected filter.
 * @return {type}       None.
 *
 * <p>
 * Assumption: value is a valid GoogleMap place type:
 *          https://developers.google.com/places/supported_types
 */
function filterChanged(value) {
    vm.filterChanged(value);
}

function googleMapError(err) {
    gm_Error = true;
    alert("Error in: Google Map. Error code: " + err);
}

function gm_authFailure() {
    gm_Error = true;

    $('#map-canvas').remove();

    alert("Failed to authenticate GoogleMaps API.");
}
