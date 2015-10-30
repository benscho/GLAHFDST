define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/aspect',
    'dojo/topic',
    'dojo/query',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dijit/registry',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_Contained',
    'dijit/MenuItem',
    'dijit/MenuSeparator',
	'./_Control', // layer control base class
    './_DynamicSublayer',
	
], function (
    declare,
    lang,
    array,
    aspect,
    topic,
    query,
    domConst,
    domAttr,
    registry,
    _WidgetBase,
    _TemplatedMixin,
    _Contained,
    MenuItem,
    MenuSeparator,
    _Control, // most everything happens here
	DynamicSublayer
) {
	var Group = declare([_WidgetBase, _TemplatedMixin, _Contained, _Control], {
		_children: null,
		_layerType: 'overlay',
		_esriLayerType: 'dynamic',
		_visLayersHandler: null,
        constructor: function () {
            this._sublayerControls = [];
        }, 
		_createSublayers: function (layer) {
			array.forEach(this._children, lang.hitch(this, function(child) {
				var childNode = registry.byId(child);
				var control = new DynamicSublayer ({
					id: childNode.id,
					control: this,
					sublayerInfo: child,
					icons: this.icons
				});
			}));
		}
	});
	return Group;
});