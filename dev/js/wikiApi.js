/** done
 * @Filename: wikiApi.js.
 * Purpose: This file interfaces with the Wikipedia api.*Internal Dependencies: None.
 * External Dependencies: http: //en.wikipedia.org
 */

var wiki = (function() {
    var self = this;

    // container for public methods
    var publicMethods = {};

    // container for Wikipedia articles
    var _articles;

    /**
     * getWikipediaArticles - Calls the wikipedia api to search for
     *     articles for address.
     *
     * @param  {type} addressStreet The information to search for, can
     *               be any name or location.
     * @return {type}               Returns an array of articles.
     * <p>
     *   If the api call fails, a special article is created indicating
     *     the failure.
     * </p>
     */
    publicMethods.getWikipediaArticles = function(addressStreet, callback) {
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' +
            addressStreet.replace(' ', '%20') + '&format=json&callback=?';

        // clear out old data before new request
        _articles = [];

        //wikiUrl = wikiUrl.replace(' ', '%20');

        _articles = {
            status: "fail",
            source: "wikipedia",
            articles: undefined
        };

        $.jsonp({
            url: wikiUrl,
            success: function(data) {
                _articles = {
                    status: "ok",
                    source: "Wikipedia",
                    articles: data
                };
                callback(_articles);
            },
            error: function() {

                alert('Wikipedia was not able to retrieve any articles for ' +
                    addressStreet);
                _articles = {
                    status: "fail",
                    source: "Wikipedia",
                    articles: undefined
                };
                callback(_articles);
            }
        });
        // .fail(function() {
        //
        //     alert('Wikipedia was not able to retrieve any articles for ' +
        //         addressStreet);
        //     _articles = {
        //         status: "fail",
        //         source: "Wikipedia",
        //         articles: undefined
        //     };
        //     callback(_articles);
        // });
    }
    return publicMethods;
})();
