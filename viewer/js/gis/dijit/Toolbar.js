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
	
	'dojo/_base/lang',
	'dojo/topic',
	'dojo/text!./Toolbar/Templates/Toolbar.html'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Button, ComboButton, Menu, MenuItem, Select, TextBox, Memory, lang, topic, ToolbarTemplate) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
        templateString: ToolbarTemplate,
		postCreate: function () {
			topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode', 'toolbar'));
		},
		startMeasure: function () {
			this.clearContents();
			var areaButton = new Button({
				label: "Area",
				onClick: function() {
				
				}
			}).placeAt(dojo.byId("toolbarContents")).startup();
			var distanceButton = new Button({
				label: "Distance",
				onClick: function() {
				
				}
			}).placeAt(dojo.byId("toolbarContents")).startup();
			var locationButton = new Button({
				label: "Location",
				onClick: function() {
				
				}
			}).placeAt(dojo.byId("toolbarContents")).startup();
			var unitsMenu = new Menu({ style: "display: none;"});
			var miles = new MenuItem({
				label: "Miles",
				onClick: function(){
				
				}
			});
			var kilometers = new MenuItem({
				label: "Kilometers",
				onClick: function(){
				
				}
			});
			unitsMenu.addChild(miles);
			unitsMenu.addChild(kilometers);
			var unitsButton = new ComboButton({
				label: "Units",
				dropDown: unitsMenu
			}).placeAt(dojo.byId("toolbarContents")).startup();
		},
		startIdentify: function () {
			this.clearContents();
			dojo.byId("toolbarContents").innerHTML = "Choose \"All Visible Layers\" or a single layer for identify:";
			/*var identifyStore = new Memory({
				data: [
					{
						label:"*** All Visible Layers ***", 
						id: "all"
					}
				]
			});*/
			var identifySelect = new Select({
				name: "identifySelect",
				//store: identifyStore,
				options:[
					{ value: "", label:"*** All Visible Layers ***", selected: true }
				],
				labelAttr: "label"
			}).placeAt(dojo.byId("toolbarContents")).startup();
		},
		startFind: function () {
			this.clearContents();
			dojo.byId("toolbarContents").innerHTML = "<b>Select query:</b>";
			/*var findStore = new Memory({
				data: [
					{
						label: "Find a Basin by name",
						id: "basin-name"
					}
				]
			});*/
			var findSelect = new Select({
				name: "findSelect",
				//store: findStore,
				options:[
					{ value: "", label: "Find a Basin by name", selected: true }
				],
				labelAttr: "label"
			}).placeAt(dojo.byId("toolbarContents")).startup();
			dojo.byId("toolbarContents").innerHTML += "<b>Search for:</b>";
			var findText = new TextBox({
				name: "findText",
				value: ""
			}).placeAt(dojo.byId("toolbarContents")).startup();
		},
		startPrint: function () {
			this.clearContents();
		},
		clearContents: function () {
			dojo.byId("toolbarContents").innerHTML = "";
		},
		setMapClickMode: function () {
			
		}
	});
});