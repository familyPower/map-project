/**
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
     * @return {type}               description
     */
    publicMethods.getNYTArticles = function(addressStreet, callback) {
        //  var $nytHeaderElem = $('#nytimes-header');
        //  var $nytElem = $('#nytimes-articles');
        var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +
            addressStreet + '@sort=newest&api-key=fb149abdcc464fffa45ab3afef02a436';

        // clear out old data before new request
        //  $nytElem.text("");
        nytimesUrl = nytimesUrl.replace(' ', '+');
        // console.log(nytimesUrl);
        //  $.getJSON(nytimesUrl,processNYTData);

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
                //  for (var i = 0; i < articles.length; i++) {
                //    var article = articles[i];
                //    var strArticle = '<li class="article">'+'<a href="'+article.web_url+'">"'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>';
                //    // console.log(strArticle);
                //    $nytElem.append(strArticle);
                //  }
            }).fail(function() {
                _articles = {
                    status: fail,
                    source: "New York Times",
                    articles: undefined
                };
                callback(_articles);
                // $nytHeaderElem.text("New York Times Articles Could Not Be Loaded for " + addressStreet);
            })
            // console.log('here');



    }

    return publicMethods;
})();
