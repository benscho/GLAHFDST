Layers
======

Overview
--------

Mostly unchanged from the CMV implementation, but with the addition of grouping for layers.
Grouping emulates layers being part of the same service without doing that, allowing for each layer to be handled separately for caching or enabling. 
For the sake of the coder, the reordering of layers has been disabled.

Grouping
--------

The bulk of the grouping related modifications take place in the *_addControl* function and the new *createGroup* function.
Layers with a common parent are added to a list of the current group. When we hit the next parent, we finalize the list and display the group.
Groups are mainly just an HTML construct with little behind-the-scenes functionality.

Properties
----------

