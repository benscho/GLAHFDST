define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
	'dijit/form/Button',
	'dijit/form/ComboButton',
	'dijit/Menu',
	'dijit/MenuItem',
	'dijit/form/Select',
	'dijit/form/TextBox',
	
	'dstore/Memory',
	
	'esri/dijit/Measurement',
	'esri/units',
	
	'dojo/dom-construct',
	'dojo/request',
	'dojo/html',
	'dojo/_base/lang',
	'dojo/topic',
	'dojo/text!./Toolbar/Templates/Toolbar.html',
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Button, ComboButton, Menu, MenuItem, Select,
			 TextBox, Memory, Measurement, units, domConstruct, request, html, lang, topic, ToolbarTemplate) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
        templateString: ToolbarTemplate,
		postCreate: function () {
			topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode', 'toolbar'));
		},
		startMeasure: function () {
			this.clearContents();
			/*this.measure = new Measurement({
                map: this.map,
                defaultAreaUnit: units.SQUARE_MILES,
                defaultLengthUnit: units.MILES
            }, domConstruct.create('div'));
            this.measure.startup();*/
			request.get("/js/gis/dijit/Toolbar/Templates/Measure.html").then(function(results) {
				html.set(dojo.byId("toolbarContents"), results);
			});
		},
		/*measureArea: function () {
			this.measure.setTool("area", true);
		},
		measureDistance: function () {
			this.measure.setTool("distance", true);
		},
		measureLocation: function () {
			this.measure.setTool("location", true);
		},*/
		startIdentify: function () {
			this.clearContents();
			request.get("/js/gis/dijit/Toolbar/Templates/Identify.html").then(function(results){
				html.set(dojo.byId("toolbarContents"), results);
			});
		},
		startFind: function () {
			this.clearContents();
			request.get("/js/gis/dijit/Toolbar/Templates/Find.html").then(function(results){
				html.set(dojo.byId("toolbarContents"), results);
			});
		},
		startPrint: function () {
			this.clearContents();
		},
		clearContents: function () {
			dojo.byId("toolbarContents").innerHTML = "";
			if(this.measure){
				this.measure.destroy();
			}
		},
		setMapClickMode: function () {
			
		}
	});
});