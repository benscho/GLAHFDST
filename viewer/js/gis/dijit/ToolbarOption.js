define([
	'dojo/_base/declare',
	'dojo/on',
	'dojo/dom-style',
	'dojo/_base/lang',
	'dijit/layout/ContentPane',
	'dijit/registry',
	'xstyle/css!./ToolbarOption/css/ToolbarOption.css'
], function (declare, on, domStyle, lang, ContentPane, registry) {
	var selected;
	return declare([ContentPane], {
		postCreate: function () {
			this.inherited(arguments);
			this.on('click', lang.hitch(this, function () {
				//console.log('clicked a toolbarOption!');
				var widgetName = this.id.slice(0,-6) + "widget";
				if (selected) {
					domStyle.set(selected.domNode, "color", "black");
					domStyle.set(dojo.byId(selected.id.slice(0,-6) + "widget"), "display", "none");
					//domStyle.set(dojo.byId(selected.id.slice(0,-6) + "widget"), "z-index", "0");
					//domStyle.set(dojo.byId(selected.id.slice(0,-6) + "widget"), "visibility", "hidden");
					if (selected.id === 'measurement_parent') {
						registry.byId("measurement_widget").measure.hide();
					}
				}
				//annoying workaround for measurement
				domStyle.set(this.domNode, "color", "blue");
				if (widgetName === 'measurement_widget') {
					var measurementWidget = registry.byId(widgetName);
					measurementWidget.measure.show();
				}
				domStyle.set(dojo.byId(widgetName), "display", "block");
				//domStyle.set(dojo.byId(widgetName), "z-index", "50");
				//domStyle.set(dojo.byId(widgetName), "visibility", "visible");
				selected = this;
			}));
		},
		startup: function () {
			this.inherited(arguments);
		}
	});
});