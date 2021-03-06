define([
	'dojo/_base/declare',
	'dojo/on',
	'dojo/dom-class',
	'dojo/dom-style',
	'dojo/_base/lang',
	'dojo/topic',
	'dijit/layout/ContentPane',
	'dijit/registry',
	'xstyle/css!./ToolbarOption/css/ToolbarOption.css'
], function (declare, on, domClass, domStyle, lang, topic, ContentPane, registry) {
	var selected;
	return declare([ContentPane], {
		postCreate: function () {
			this.inherited(arguments);
			domStyle.set(this.domNode, "textAlign", "center");
			domStyle.set(this.domNode, "cursor", "pointer");
			this.on('click', lang.hitch(this, function () {
				var widgetName = this.id.slice(0,-6) + "widget";
				if (this.id === "help_parent") {
					topic.publish("help/display", true);
					return;
				}
				if (selected && selected !== null) {
					domStyle.set(selected.domNode, "color", "black");
					domStyle.set(dojo.byId(selected.id.slice(0,-6) + "widget"), "display", "none");
					if (selected.id === 'measurement_parent') {
						registry.byId("measurement_widget").measure.hide();
					}
				}
				if(this === selected) {
					selected = null;
					return;
				}
				//annoying workaround for measurement
				domStyle.set(this.domNode, "color", "blue");
				if (widgetName === 'measurement_widget') {
					var measurementWidget = registry.byId(widgetName);
					measurementWidget.measure.show();
				}
				domClass.add(dojo.byId(widgetName), "toolbarPane");
				domStyle.set(dojo.byId(widgetName), "display", "block");
				selected = this;
			}));
		},
		startup: function () {
			this.inherited(arguments);
		}
	});
});