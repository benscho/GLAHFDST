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

.. js:function:: investigateAll(polygonGraphics)

Begins an investigation for criteria that satisfy all selected criteria

.. js:function:: investigateAny(polygonGraphics)

Begins an investigation for criteria that satisfy any selected criteria

.. js:function:: runInvestigation(polygonGraphics, intersect)

Does the actual bulk of the processing. Depending on the value of `intersect`, either an intersect or union operation is performed on the polygons.

.. js:function:: criteriaComplete(jobInfo)

Handles the results of a search. Retrieves the results of a investigation given the *jobInfo*. Attempts to format results, but makes no guarantee on ordering due to JSON. By default, these are fed to the bottom table.

.. js:function:: criteriaStatus(info)

Simple logging function. Keeps track of what is happening while server is crunching data.

.. js:function:: criteriaFailed(info)

Logs any serious errors that arise. Ideally, fails gracefully.

.. js:function::  clearCriteria()

Clears out the Criteria graphics.

.. js:function:: loadCriteria(data)

Simply reconstructs criteria geometry.

Properties
----------

.. js:data:: polygonGraphics

An ESRI Javascript API Feature Layer which contains the graphics created by the searches. `Documentation. <https://developers.arcgis.com/javascript/jsapi/featurelayer-amd.html>'_

.. js:data:: tooltips[]

An array used to construct the Dijit Dialog objects (`Documentation <https://dojotoolkit.org/api/?qs=1.10/dijit/Dialog>`_) and hold the references to them.
