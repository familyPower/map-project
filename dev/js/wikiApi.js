/** done
 * @Filename: wikiApi.js.
 * Purpose: This file interfaces with the Wikipedia api.
 * Internal Dependencies: None.
 * External Dependencies: http://en.wikipedia.org
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
               // clear out old data before new request
               var $wikiElem = $('#wikipedia-links');
               $wikiElem.text("");
               var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' +
                 addressStreet + '&format=json&callback=wikiCallback';

               var wikiRequestTimeout = setTimeout(function() {
                 $wikiElem.text("Failed to get Wikipedia resources.");
               }, 8000);

               _articles = {status: "fail", source: "wikipedia", articles: undefined};

               $.ajax(wikiUrl, {
                 // url: wikiUrl,
                 dataType: "jsonp",
                 // jsonp: "callback",
                 success: function( response ) {
                   var articleList = response[1];

                   _articles = {status: "ok", source: "Wikipedia", articles: response};
                   callback(_articles);
                  // _articles = response;
                  //  for (var i = 0; i < articleList.length; i++) {
                  //    articleStr = articleList[i];
                  //    var url = 'http:/en.wikipedia.org/wiki/' + articleStr;
                  //    $wikiElem.append('<li><a href="' + url + '">' +
                  //      articleStr + '</a></li>');
                  //  };

                  clearTimeout(wikiRequestTimeout);
                 }
               }).fail(function() {
                 _articles = {status:fail, source: "Wikipedia", articles: undefined};
                 callback(_articles);
             });

            }
            return publicMethods;
         })();
