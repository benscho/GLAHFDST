Criteria
========

Overview
--------
The criteria widget was designed solely for the GLAHF Explorer and is intended to give users an open-ended way to visually explore the relationships between different datasets.
The datasets are divided by categories (e.g. Hydrology, Temperature Energy, etc.). Each dataset itself has several options, provided as checkboxes. All of these are defined in the JSON file located at
Criteria/json/criteria.json. Users can select to search for results that match either "all" (resulting geometry must satisfy every checkbox) of the selected criteria or "any" of the selected criteria
(resulting geometry must satisfy any checkbox).

Methods
-------
.. js:function:: postCreate()

Sets up the initial state of the criteria widget.

.. js:function:: runInvestigation(polygonGraphics)

Processes the selected fields. The selected layers are enabled as transparent feature layers, but also sent to the server for geoprocessing.

.. js:function:: criteriaComplete(jobInfo)

Handles the results of a search. Retrieves the results of a investigation given the *jobInfo*. Attempts to format results, but makes no guarantee on ordering due to JSON. By default, these are fed to the bottom table.

.. js:function:: createLegend()

Creates and displays a legend pane for Criteria. Allows users to enable/disable any of the various feature layers or the results layer itself. Hidden when a user hits "clear" or changes the active toolbar.

.. js:function:: createLayer(layerInfo)

Given some *layerInfo*, construct the transparent feature layer that will display on the map. Colors are picked from a list to ensure they have sufficient contrast, layers outside the index of the list are not allowed.

.. js:function:: criteriaStatus(info)

Simple logging function. Keeps track of what is happening while server is crunching data.

.. js:function:: criteriaFailed(info)

Logs any serious errors that arise. Ideally, fails gracefully.

.. js:function::  clearCriteria()

Clears out the Criteria graphics found in *this.polygonGraphics* and zeroes out *this.criteriaLayers*.

.. js:function:: loadCriteria(data)

Reconstructs the geometry from the browser's indexedDB. Feature layers are re-queried, but the geometry information is preserved.

Properties
----------

.. js:data:: this.polygonGraphics

An ESRI Javascript API Feature Layer which contains the graphics created by the searches. `Documentation. <https://developers.arcgis.com/javascript/jsapi/featurelayer-amd.html>'_

.. js:data:: tooltips[]

An array used to construct the Dijit Dialog objects (`Documentation <https://dojotoolkit.org/api/?qs=1.10/dijit/Dialog>`_) and hold the references to them.

.. js:data:: this.colors[]

An array of colors. Contains blue, yellow, red, green, purple, and orange. Used to assign colors to the feature layers created during an investigation.

.. js:data:: this.criteriaLayers[]

An array of the layers currently being used with Criteria. By design, the intersection layer is the final one. Cleared when *clearCriteria()* is called.