/** done
 * Filename: globals.js
 * purpose: Holds variable, constants and functions that are available globally.
 */

// Indicates the current or desired state of the details row.
var open = "OPEN";
var close = "CLOSE";

/**
 * isValidLatLong - description
 *
 * @param  {type} latLon GoogleMap latlon object. Holds latitude and longitude.
 * @return {type}        True iff lat & lng are within range, else false.
 * Purpose        Validates that lat & lng are within range.
 */
function isValidLatLong(latLon) {
    var lat = latlon.lat;
    var lon = latlon.lgn;

    if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        return true;
    }

    return false;
}


/**
 * isEqualLatLng - description
 *
 * @param  {type} loc1 A GoogleMaps Position object.
 * @param  {type} loc2 A second GoogleMaps Position object.
 * @return {boolean}   Returns true if the two locations point
 *    to the same latitude and longitude.
 */
function isEqualLatLng(loc1, loc2) {
    var loc1Lat = loc1.lat();
    var loc1Lng = loc1.lng();
    var loc2Lat = loc2.lat();
    var loc2Lng = loc2.lng();

    return loc1.lat() == loc2.lat() && loc1.lng() == loc2.lng();
}


/**
 * assert - Throws error if condition is false, else it does nothing.
 *
 * @param  {type} condition Boolean statement to evaluate.
 * @param  {type} message   Message to display if condition fails.
 * @return {type}           none.
 */
function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}


/**
 * precondition - Throws error if condition is false, else it does nothing.
 *
 * @param  {type} condition Boolean statement to evaluate.
 * @param  {type} message   Message to display if condition fails.
 * @return {type}           None.
 * <p>
 * comment        Works the same as an assert, however the name indicates this
 *                    function is used to ensure all conditions exist to
 *                    permit a function to operate correctly.
 * </p>
 */
function precondition(condition, message) {
    if (!condition) {
        throw message || "Precondition failed";
    }
}

/**
 * postcondition - Ensures state is valid after a function executes.
 *
 * @param  {type} condition oolean statement to evaluate.
 * @param  {type} message   Message to display if condition fails.
 * @return {type}           None
 */
function postcondition(condition, message) {
    if (!condition) {
        throw message || "Postcondition failed";
    }
}


/**
 * findMarkerInArrayByKey - Searches the array of Markers for a marker with
 *    the passed in key.
 *
 * @param  {type} array The array of Markers to search. Marker object must
 *                        contain the application specific field 'Key'.
 * @param  {type} key   The key value to search for.
 * @return {type}       The index of the found marker or -1 if not found.
 *
 */
function findMarkerInArrayByKey(array, key) {
    precondition(array.length > 0 && 'Key' in array[0]);

    var bFound = false;

    var iRv = -1; // not found
    for (var data, i = 0; bFound == false || i < array.length, data = array[i]; i++) {
        if (key == data.Key) {
            iRv = i;
            bFound = true;
        }
    }
    return iRv;
}

/**
 * findMarkerInArrayByMarker -  - Searches the array of Markers for a marker
 *    that contains the same lat. lng. as the passed in marker. If two Markers
 *    contain the same lat. lng., they are considered to point to the same
 *    location.
 *<p>
 * The code currently assumes that the marker will contain application specific
 *  data. This may not hold true in the future.
 *
 * @param  {type} array  The array of Markers to search
 * @param  {type} marker The marker to find.
 * @return {type}        The index of the found marker or -1 if not found.
 */
function findMarkerInArrayByMarker(array, marker) {
    precondition(array);
    precondition(marker);

    assert(array.length > 0);
    assert('Key' in array[0] && !('Key' in marker));


    var bFound = false;

    var iRv = -1; // not found
    for (var data, i = 0; bFound == false && i < array.length, data = array[i]; i++) {
        assert(array[i].Marker);
        if (array[i].Marker.position.equals(marker.position)) {
            iRv = i;
            bFound = true;
        }
    }
    return iRv;
}


/**
 * arrayContains - Search the array for value.
 *
 * @param  {type} array The array to search.
 * @param  {type} value The item to search for.
 * @return {type}       true iff the value is in the array, else false.
 */
function arrayContains(array, value) {
    if (!array || array.length <= 0) {
        return false;
    }

    for (var i = 0, data; data = array[i]; i++) {
        if (data == value) {
            return true;
        }
    }

    return false;
}


/**
 * isValidState - Used to ensure that a valid state place detail panel.
 *
 * @param  {type} state The state used, as a parameter etc.
 * @return {type}       true if state is valid, else false.
 */
function isValidState(state) {
    return state == open || state == close;
}
