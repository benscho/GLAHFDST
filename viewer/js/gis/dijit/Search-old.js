define([
	'dojo/_base/declare',
	'dojo/request',
	'dojo/json',
	
	'dstore/Memory',
	'dstore/legacy/DstoreAdapter',
	
	'dijit/form/Select',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/text!./Search/templates/Search.html',
	'dojo/text!./Search/json/search.json',
	'xstyle/css!./Search/css/Search.css'
], function (declare, request, json, Memory, DstoreAdapter, Select, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, searchTemplate, search) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
		templateString: searchTemplate,
		postCreate: function () {
			this.inherited(arguments);
			this.initSearch();
		},
		initSearch: function () {
			var categories = new DstoreAdapter(
				new Memory({
					idProperty: "name",
					data: json.parse(search)
				})
			);
			var categorySelect = new Select({
				name: "categorySelect",
				store: categories,
				labelAttr: "name",
				maxHeight: -1,
				onChange: function(results) {
					console.log(results);
					var optionsSelect = dijit.byId("options");
					optionsSelect.destroy(true); //preserve dom
					options = new DstoreAdapter(
						new Memory({
							idProperty: "name",
							data: this.getOptions(results).item.options
						})
					);
					optionsSelect = new Select({
						store: options,
						name: "optionsSelect",
						labelAttr: "name",
						maxHeight: -1
					}, "options");
					optionsSelect.startup();
				}
			}, "categories");
			categorySelect.startup();
			
			var optionsSelect = new Select({
				disabled: true,
				options: [
					{ label:"Options...", value: "Options..." }
				]
			}, "options");
			optionsSelect.startup();
		}
	});
});