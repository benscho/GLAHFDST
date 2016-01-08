Save
====

Overview
--------
Saves the active layers, user-created graphics (draw and criteria) and current extent. Uses "slots" to differentiate saves, and data is stored using dstore's localDB. Supports all major browsers.

Methods
-------
.. js:function:: postCreate()

Sets up the basic state for saving. Initializes the database, which consists of two main localDB objects: *geoLayerDB* and *graphicsLayerDB*.

.. js:function:: gatherData()

Filters all the layers based on if they are active or not. Inserts active layers into *activeGraphicLayers*, then calls *saveData*.

.. js:function:: saveData()

Finishes collecting data, then serializes it and stores it in the database.

.. js:function:: loadData()

Loads the data from the browser database. When loading is finished, it uses Dojo's topic/publish to distribute information. For the graphics layers, we have to send the data to the proper widget for redrawing.

.. js:function:: _onSlotChange()

When a slot changes, make sure our slot object is pointing at the right one.

Properties
----------