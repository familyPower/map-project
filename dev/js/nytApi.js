/** done
 * Filename: nytApi
 * Purpose: This file interfaces with the New York Times api.
 * Internal Dependencies: None.
 * External Dependencies: http://api.nytimes.com
 */

var nyt = (function() {
    var self = this;

    // Holds articles returned by the NYT api.
    var _articles = [];

    // container for public methods
    var publicMethods = {};

    /**
     * getNYTArticles - description
     *
     * @param  {type} addressStreet The place to finds news articles about.
     * @return {type}               None.
     * <p>
     * This functions populates an array with the articles found. The array is
     * passed to the callback function located in the ViewModel. A special
     * entry is made into the articles array indicating the failure.
     * </p>
     */
    publicMethods.getNYTArticles = function(addressStreet, callback) {
        var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +
            addressStreet + '@sort=newest&api-key=fb149abdcc464fffa45ab3afef02a436';

        // clear out old data before new request
        _articles = [];

        nytimesUrl = nytimesUrl.replace(' ', '+');

        $.getJSON(nytimesUrl, function(data) {
            // console.log(data);
            // $nytHeaderElem.text("New York Times Articles About " + addressStreet);
            // console.log('here2');
            _articles = {
                status: "ok",
                source: "New York Times",
                articles: data.response
            };
            callback(_articles);

        }).fail(function() {
            alert('NYT was not able to retrieve any articles.');            _articles = {
                status: fail,
                source: "New York Times",
                articles: undefined
            };
            callback(_articles);
        })
    }

    return publicMethods;
})();
