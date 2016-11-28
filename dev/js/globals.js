/**
 * Filename: globals.js
 * purpose: Holds variable and functions that are available globally
 */

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

function findInArray(array, key) {
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
