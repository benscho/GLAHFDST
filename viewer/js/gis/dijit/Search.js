define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/io-query',
	'dojo/request',
	'dojo/on',
	
	'dijit/form/Select',
	'dijit/registry',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	
	'esri/tasks/query',
	'esri/tasks/QueryTask',
	
	'dstore/Memory',
	
	'dojo/text!./Search/templates/Search.html',
	'xstyle/css!./Search/css/Search.css'
], function (declare, lang, Array, ioQuery, request, on, Select, registry, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Query, QueryTask, Memory, SearchTemplate) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
		templateString: SearchTemplate,
		postCreate: function() {
			this.inherited(arguments);

			this.topics = [];
			this.queries = [];
			request.get("js/gis/dijit/Search/json/search.json", {
				handleAs: "json"
			}).then(lang.hitch(this, function (results) {
				//console.log("reading search.json...");
				for (var i in results) {
					this.topics.push(results[i]);
					var options = results[i].options;
					for (var j in options) {
						this.queries.push(options[j]);
					}
				}
				//console.log("done reading search.json");
				this.topicSelect = new Select({
					name: "topicSelect"
				}, dojo.byId("topicSelect"));
				this.topicSelect.addOption(this.topics);
				this.topicSelect.startup();
				this.querySelect = new Select({
					name: "querySelect"
				}, dojo.byId("querySelect"));
				this.querySelect.addOption(this.queries);
				this.querySelect.startup();
			}));
			on(dojo.byId('searchBtn'), 'click', lang.hitch(this, this.runSearch));
		},
		runSearch: function() {
			var topicIndex = registry.byId("topicSelect").index;
			var queryIndex = registry.byId("querySelect").index;
			var selectedTopic = this.topics[topicIndex];
			var selectedQuery = this.queries[queryIndex];
			var query = new Query();
			var queryTask = new QueryTask(selectedQuery.url);
			query.where = selectedQuery.param + "=" + selectedQuery.value;
			query.outFields = ["*"];
			query.returnGeometry = false;
			queryTask.execute(query, this.searchResults);
		},
		searchResults: function (event) {
			console.log("search results received");
		}
	});
});