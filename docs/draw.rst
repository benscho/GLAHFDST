Draw
====

Overview
--------

Core difference from CMV version is the inclusion of text associated with a point.
This is done through a workaround as it's not well supported by the current version of ESRI's Javascript API.
Text is created as a separate symbol and moved along with the corresponding point (as the API supports either a point with no text or text with no point).
Saving/loading support has also been added. The contents of the drawn polygons are serialized and sent to the save function for saving.
On load (when Draw.js receives a "load/draw" event), the provided serialized data is converted back into polygons.

Text
----
The text data for a given point is stored in *this.curGraphic*, along with a reference to the corresponding point graphic.
When editing or moving text, the point is hidden (how we find the point depends on wether the point itself was clicked or the text was clicked), the edit toolbar is activated and the point can be moved.
When finished, the point is reconstructed and the toolbar is deactivated.
This functionality mainly takes place in the method *editGraphic*. The dual points are originally built in the method *onDrawToolbarDrawEnd*

Loading
-------
The act of saving occurs in the Save.js. Loading occurs in loadDrawnGraphics. The serialized data is supplied by Save.js, then reconstructed one by one depending on it's type.