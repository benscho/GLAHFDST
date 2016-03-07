Locate
======

Overview
--------
A slightly modified version of the CMV widget "Goto" (`Documentation <https://github.com/BrianBunker/cmv-widgets/tree/master//Goto>`_).
Small modifications to get it to work with the GLAHF Explorer, as well as the addition of an address lookup feature.

Address
-------
Small modifications have been made to the template (Locate.html), as well as *coordTypeTemplates* and gotoCoordinate both found in Locate.js.
Currently will only display the "best match". As decided by ESRI's Geocoding service. The possibility for more granularity exists, but could arguably be outside of the scope of this project.
When a user clicks "Locate", the contents of the address box are sent to Esri's Geocoding service. An array of results is returned, or an empty array if no matches are found.
Currently, only the "best match" address is displayed to the user. Clicking on it will cause the map to zoom and center on the address and place a green dot. 
There will be a maximum of one dot at any time, which can be cleared with the "Clear" button.