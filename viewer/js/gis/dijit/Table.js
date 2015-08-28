define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/topic',
	
	'dgrid/Grid',
	
	'dijit/layout/TabContainer',
	'dijit/layout/ContentPane',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/text!./Table/templates/Table.html',
	'xstyle/css!./Table/css/Table.css'
], function (declare, lang, topic, Grid, TabContainer, ContentPane, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, tableTemplate) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
		templateString: tableTemplate,
		tabContainer: {},
		postCreate: function () {
			this.tabContainer = new TabContainer({
				style: "height:100%; width:100%;",
				id: "tabContainer"
			}, "sidebarBottom");
			this.tabContainer.startup();
			topic.subscribe("table/post", lang.hitch(this, this.postTable));
		},
		postTable: function (results) {
			var grid = new Grid({
				columns: results.columns,
			});
			grid.renderArray(results.data);
			var cp = new ContentPane({
				title: results.title,
				content: grid
			});
			this.tabContainer.add(cp);
		}
	});
});