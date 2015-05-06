define([
	'dojo/_base/declare',
	'dojo/_base/fx',
	'dojo/_base/lang',
	'dojo/dom-style',
	'dojo/mouse',
	'dojo/on',
	'dijit/form/Button',
	'dijit/form/TextBox',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dojo/text!./ViewEdit/templates/ViewEdit.html'
], function(declare, baseFx, lang, domStyle, mouse, on, Button, TextBox, _WidgetBase, _TemplatedMixin, template) {
	return declare([_WidgetBase, _TemplatedMixin], {
		//default values
		name: "No name",
		text: "No text",
		description: "No description",
		templateString: template,
		postCreate: function() {
			var domNode = this.domNode;
			this.inherited(arguments);
		},
		prepareButtons: function(object) {
			console.log(object);
			var view = new Button({
				label: "View",
				onClick: this._viewData
			}, "viewBtn").startup();
			var edit = new Button({
				label: "Edit",
				onClick: this._editData
			}, "editBtn").startup();
		},
		_viewData: function() {
			var displayHTML = "<div>Name: " + name + "<br>"
				+ "Text: " + text + "<br>" 
				+ "Description: " + description + "</div>";
			var closeBtn = new Button({
				label: "Close",
				onClick: this._clearDisplay
			}, "closeBtn").startup();
			dojo.byId("displayBox").innerHTML = displayHTML;
		},
		_editData: function() {
			var displayHTML = "<div>Name: <input id='name'><br>"
				 + "Text: <input id='text'><br>"
				 + "Description: <input id='description'></div>";
			dojo.byId("displayBox").innerHTML = displayHTML;
			var nameBox = new TextBox({
				name: "name",
				value: ""
			}, "name");
			var textBox = new TextBox({
				name: "text",
				value: ""
			}, "text");
			var descBox = new TextBox({
				name: "description",
				value: ""
			}, "description");
			var saveBtn = new Button({
				label: "Save",
				onClick: this._saveData
			}, "saveBtn").startup();
			var closeBtn = new Button({
				label: "Close",
				onClick: this._clearDisplay
			}, "closeBtn").startup();
		},
		_saveData: function() {
			//TODO: this function
		},
		_clearDisplay: function() {
			dojo.byId("displayBox").innerHTML = "";
		}
	});
});