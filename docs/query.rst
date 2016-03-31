Query
=====

Overview
--------
The query widget is designed to let users explore the data in a slightly less directed but still somewhat guided way. Users are able to query tables using queries that have been pre-defined in json.
The queries are presented in two separate select drop-downs - one for category, and then another for finer grain selection within that category.
Results appear in the bottom table pane.
Needs some expansion in terms of queries offerred, and possibly a redesign or removal.
The code is still intact in the github repository, but it has currently been disabled in viewer.js and viewer/templates/mapOverlay.html

Methods
-------

.. js:function:: postCreate()

Sets up the basic state for the query widget. First, query.json is read and used to construct the query select drop-downs.

.. js:function:: runQuery()

Does the actual query operation. Reads the currently selected values from the drop-downs and builds the query. If the query has been serialized for performance, we just grab the data from the serialized json.
Otherwise, we run the query in real time.

.. js:function:: queryResults(results)

Parses the supplied results and adds the results to the bottom table pane. Uses information from the .json file to name table columns.

Properties
---------
.. js:data:: topics[]

Contains a list of the top-level categories for queries.

.. js:data:: queries[]

Contains a list of the actual queries from the corresponding category. Repopulated when the selected topic is changed.

.. js:data:: topicSelect

The Dijit object for the top-level select. `Documentation. <https://dojotoolkit.org/api/?qs=1.10/dijit/form/Select>`_

.. js:data:: querySelect

The Dijit object for the lower-level select. `Documentation. <https://dojotoolkit.org/api/?qs=1.10/dijit/form/Select>`_