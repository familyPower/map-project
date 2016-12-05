Project Capabilities:
This is a map project that allows users to type in an address, landmark or
a location (i.e. Egypt, Pyramids; Eiffel Tower; Tower of London;
3 Haven Plaza New York, 10009). Google Maps will search for the location. The
address of the center of the map (the place Google Maps found) is displayed
above the map. A list of POI (Points Of Interest) is displayed to the left of
the map. Below the map are New York Times articles found about the address with
Wikipeida articles to the left of the New York Times articles.

If the user selects a place, an icon representing that location will bounce and
an Infowindow will open displaying the name of the place. Bouncing can be
initiated by clicking on the icon or selecting the place from the list to the
left of the map. An Infowindow will display for the bouncing icon. The place
clicked is not visible on the map, the map will automatically adjust so that
the clicked location is visible.

The bouncing can be stopped by clicking on the bouncing icon, closing the
Infowindow, or by clicking on the location in the list (see known issues below).

When a place is clicked on, a new row will appear between the map and the news
pane. The new pane will contain articles, if any, specific to the selected
place.

Libraries used: Bootstrap, Knockout, jquery

API's Used: Google Maps, New York Times, Wikipedia.

Important: I borrowed snippets of code from various websites. I did not use
            more than on function or parts of a function from any site.

Note: If a location can't be found, the original location remains and the
  text the user entered remains in the input box, thus allowing the user to
  correct any typo.


* TODO:
*  1. Add scrollbars.
*  1. Add more information to Infowindow.
*  2. Add more categories; consider a drop down check boxes of categories.
*  3. Allow user to select more than one category
*  4. Improve presentation on small devices, especially phones (read more about
          bootstrap's responsive features).
*  5. Remove blank items returned from Wikipedia (I'm assuming the blank items
        are retrieved from Wikipedia).
*  6. Limit number of items in each list. Use scrollbars (see #1).
*  7. Modify/add css to beautify/professionalize the ui.
*  8. Make error handling more robust and informative.

Known Issues:
  1. When user selects a POI and then clicks on a filter, the Infowindow doesn't
      close. Infowindow should close.
  2. When user types in a new location, with the place details pane open, the
      pane remains open displaying data from the previously selected place.
      Pane should close.
  3. When changing location with filter set, filter remains set, though all
      places are displayed. Filter should reset to "All".
  4. Changing filter options does not close Infowindow. Infowindow should close
      when filter changes.
