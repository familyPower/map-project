How to use the program
===============
The application will start with the map center at the Empire State Building in
New York City. There will be points of interest (POI) to the left of the map.
There will also be articles from the New York Times and Wikipedia below the map.
You can click on any of the articles to read the article. If you click on a POI,
you will see any Wikipedia articles available about the POI clicked on.

You can change the center of the map by typing in an address or a landmark. The
map center will adjust to include the closest location to the what was typed in.
The address of the center of the map will display directly above the map.

The new links may be clicked to display additional information.

Step by step instructions to run the application (assuming application is run locally)
================================================
0. Ensure you have the following required programs to run the application locally:
  a) web browser ( Google Chrome for example )
  b) web server (Python for example)
  If either of these applications is missing, please search for your preferred
  web server and/or browser, then
  follow the instructions to download and install.

To start the application:
1. Start the web server, (in Python, type - Python -m SimpleHTTPServer 8000)
2. Stat your favorite web browser

1. Type localhost: 8000/dev
The application is now running.

To see a different location:
1. Type the address or name of the landmark in the entry area.
2. Press enter or click on the "Search" button.

To see a POI:
1. Click on marker for the POI or the name (located to the left of the map).

To stop a POI marker from bouncing and to close the infowindow, do one of the
following:
- Click on the same link clicked on to open the Infowindow
or
- click on the bouncing marker
or
- Click on the 'X' in the infowindow.

To get detailed information about the POI
- Click on the name of the POI
or
- Click on the marker for the POI.


Project Capabilities:
=====================
This is a map project that allows users to type in an address, landmark or
a location (i.e. Egypt, Pyramids; Eiffel Tower; Tower of London;
3 Haven Plaza New York, 10009). Google Maps will search for the location. The
address of the center of the map (the place Google Maps found) is displayed
above the map. A list of POI (Points Of Interest) is displayed to the left of
the map. Below the map are New York Times articles found about the address with
Wikipedia articles to the left of the New York Times articles.

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

*************************** New Information ****************************
Note: If a location can't be found, the original location remains and the
  text the user entered remains in the input box, thus allowing the user to
  correct any typo.

How to host the application locally.

Task Runner:
I use a simple task runner that only reduces the size of each file. Files are
first minimized and then compressed to achieve significant size of transmitted
files. All Application files are minimized and compressed.

To execute gruntfile.js (From a Unix based system.):
  Install required dependencies/packages
Copy and paste the following lines to install required dependencies. Copy each
line execute each line separately.

npm install grunt-contrib-uglify --save-dev
npm install grunt-contrib-cssmin --save-dev
npm install grunt-contrib-htmlmin --save-dev
npm install grunt-contrib-compress --save-dev

  Run the build process.
Then execute grunt from the command line by typing in 'grunt'.

Serve application
The next step is to start a local webserver. I used python. Please refer to the
documentation for the server you use.

To use python, type:
python -m SimpleHTTPServer xxxx (where 'xxxx' is the port you want to use, I
used 8000).

In your brower, type:
localhost: xxxx (matches the port you chose) /dev|dist

To execute the distribution version of the application, assuming port 8000 is
chosen, type:
localhost: 8000/dist

Replace 'dist' with 'dev' to run the development (uncompressed and not minified)
version of the code.

  ************************** Improve App ***************************

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
