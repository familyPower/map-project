/**
 * Filename: globals.js
 * purpose: Holds variable and functions that are available globally
 */

var open = "OPEN";
var close = "CLOSE";

/**
 * isValidLatLong - description
 *
 * @param  {type} latLon description
 * @return {type}        description
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
 * @param  {type} loc1 description
 * @param  {type} loc2 description
 * @return {boolean}   Returns true if the two locations point
 *    to the same place.
 */
function isEqualLatLng(loc1, loc2) {
  var loc1Lat = loc1.lat();
  var loc1Lng = loc1.lng();
  var loc2Lat = loc2.lat();
  var loc2Lng = loc2.lng();

  return loc1.lat() == loc2.lat() && loc1.lng() == loc2.lng();
}

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

function precondition(condition, message) {
    if (!condition) {
        throw message || "Precondition failed";
    }
}

function postcondition(condition, message) {
    if (!condition) {
        throw message || "Postcondition failed";
    }
}

function findMarkerInArrayByKey(array, key) {
  var bFound = false;

  var iRv = -1; // not found
  for( var data, i = 0; bFound == false || i < array.length, data = array[i]; i++) {
    if (key == data.Key) {
      iRv = i;
      bFound = true;
    }
  }
  return iRv;
}

function findMarkerInArrayByMarker(array, marker) {
  assert(array);
  assert(marker);

  var bFound = false;

  var iRv = -1; // not found
  for( var data, i = 0; bFound == false && i < array.length, data = array[i]; i++) {
    assert(array[i].Marker);
    if (array[i].Marker.position.equals(marker.position)) {
      iRv = i;
      bFound = true;
    }
  }
  return iRv;
}

function arrayContains(array, value) {
  if (!array || array.length <= 0){
    return false;
  }

  for (var i = 0, data; data = array[i]; i++) {
    if (data == value) {
      return true;
    }
  }

  return false;
}
function isValidState(state) {
  return state == open || state == close;
}
