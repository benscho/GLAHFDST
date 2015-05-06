# GLAHFDST

This is a web viewer based on the configurable map viewer http://docs.cmv.io/en/1.3.3/ It is intended to be used with data from GLAHF in order to allow users to make informed decisions. The data is currently private, but will be made public in the near future.

#Major Widgets:
_Draw (modified from CMV):_ allows multiple points to be placed at once. Integrating text. esriGraphicsLayer and TextGraphics include extended versions of esri objects (GraphicsLayer and graphic) to facilitate development.
Needs testing. Integrating with ViewEdit to provide an interface to edit and interact with graphics and associated text.

_InteractiveDraw:_ allows a user to draw a polygon, polyline, or place a point. The constructed graphic will provide the user with information about the map based on currently active layers. Needs testing and clarification
for polyline. Plan to integrate with searching and Export widget.

_Criteria:_ allows a user to specify criteria from a set of fields we present them with. Fields are currently hardcoded but will be defined via .json for easy modification. Needs testing and more development.

_Export:_ a CMV widget. Given an area, allows user to export data into one of several formats (including shapefile). Requires geoprocessing service running on the target server to work.
Works, but needs to be integrated with GLAHF data. Difficult to test currently as esri server/data are unreliable.

_Save:_ currently saves the active layers, user-driven graphics (draw, interactive draw, and criteria results), and current extent. 3 'slots', although plenty of room for more (nameable save slots requested).
Goal is to provide user a way to save data between sessions, and then share data with others when ready. Any new layers to be saved must be hardcoded. Uses dstore's localDB to be browser agnostic.

#NOT WIDGETS:
_Query:_ basic lets a user query a specific table and layer. Queries are defined by .json. Advanced is in flux - needs to be re-evaluated to determine usefulness (if any).

_Results:_ conceptually, a place for users to compare results of numerous queries, criteria searches, etc. Needs more development. Original plan was to present attractive dgrid tables with graphics.
Sadly, significant portions of data being rasters make this harder to realize. Need to apply creativity.

_Metadata:_ a page to describe the layers and datasets. Mostly functional with rudimentary table of contents. Needs design work.

#CURRENT GOALS:
_Toolbar:_ Clarified to be about utility operations, NOT navigation. Intended to clear up widget space on the left. Concept is to move less substantial widgets (e.g. find, identify, measurement, etc.) to it.
Planning on using the CMV widget "ArcGIS JS NavigationTools", but heavily modified.

_Draw:_ Adding text to graphics has been clarified. Experiment with implementations. Preferred behavior is add graphic, then option to attach text. No need for robust editing as text is merely label.

_Criteria:_ Build criteria json for new data. Bug "cannot read property 'missingMessage' of undefined". Seems to be related to programmatically building select? Inconsistent.

#KNOWN ISSUES:
-CSS is sloppy. With overflow:hidden disabled there is scrolling. Lower priority, but should be fixed before project shown to public.

-Documentation is incomplete. I'm working on it ;)

-No clear plan on how to handle CMV updates. Previous merge was done by hand.

-Not adequately testing mobile support during development. Need to work on android and iOS testing.

-Advanced Query on back burner for now. May be repurposed at later point.
