/**
 *
 */

 var wiki = (function() {
             var self = this;

             // container for public methods
             var publicMethods = {};

             // container for Wikipedia articles
             var _articles;

             publicMethods.getArticles = function() {

             }

             /**
              * getWikipediaArticles - description
              *
              * @param  {type} addressStreet description
              * @param  {type} addressCity   description
              * @return {type}               description
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
