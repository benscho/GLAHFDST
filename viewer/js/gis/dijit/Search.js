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
	'dijit/layout/ContentPane',
	'dijit/layout/TabContainer',
	
	'dgrid/Grid',
	
	'esri/tasks/query',
	'esri/tasks/QueryTask',
	'esri/geometry/Polygon',
	'esri/geometry/geometryEngine',
	'esri/layers/FeatureLayer',
	'esri/renderers/UniqueValueRenderer',
	'esri/symbols/SimpleFillSymbol',
	'esri/Color',
	'esri/graphic',
	'esri/SpatialReference',
	
	'dojo/text!./Search/templates/Search.html',
	'xstyle/css!./Search/css/Search.css'
], function (declare, lang, Array, ioQuery, request, on, Select, registry, _WidgetBase,
	_TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, TabContainer, Grid, Query, QueryTask,
	Polygon, GeometryEngine, FeatureLayer, UniqueValueRenderer, SimpleFillSymbol, Color, Graphic,
	SpatialReference, SearchTemplate) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
		templateString: SearchTemplate,
		postCreate: function() {
			this.inherited(arguments);
			this.number = 0;
			this.topics = [];
			this.queries = [];
			this.resultsPane = new TabContainer({
				style: "height: 100%; width: 100%;"
			});
			this.resultsPane.placeAt("sidebarBottom");
			this.resultsPane.startup();
			request.get("js/gis/dijit/Search/json/search.json", {
				handleAs: "json"
			}).then(lang.hitch(this, function (results) {
				//console.log("reading search.json...");
				for(var i in results){
					this.topics.push(results[i]);
				}
				var options = results[0].options;
				for (var j in options) {
					this.queries.push(options[j]);
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
				this.topicSelect.on("change", lang.hitch(this, this.changeQueries));
			}));
			on(dojo.byId('searchBtn'), 'click', lang.hitch(this, this.runSearch));
		},
		runSearch: function() {
			if (this.queryInProgress) {
				alert("There is already a query in progress! Please wait for the current query to finish before launching another.");
				return;
			}
			var topicIndex = registry.byId("topicSelect").value;
			var queryIndex = registry.byId("querySelect").value;
			var selectedTopic = this.topics[topicIndex];
			var selectedQuery = this.queries[queryIndex];
			if (selectedQuery.canned === "true") {
				request.get("js/gis/dijit/Search/json/search-canned.json", {
					handleAs: "json"
				}).then(lang.hitch(this, function(results) {
					var curRes = results[topicIndex].options[queryIndex];
					this.number++;
					var grid = new Grid({
						columns: curRes.columns
					});
					grid.renderArray(curRes.data);
					var cp = new ContentPane({
						id: "search-" + this.number,
						title: "Search " + this.number,
						content: grid
					});
					this.resultsPane.addChild(cp);
					this.queryInProgress = false;
				}));
			}
			else {
				var query = new Query();
				var queryTask = new QueryTask(selectedQuery.url);
				query.where = selectedQuery.param + "=" + selectedQuery.param;
				query.outFields = ["*"];
				query.returnGeometry = true;
				this.grouping = selectedQuery.grouping;
				this.queryInProgress = true;
				this.columns = selectedQuery.columns;
				this.curVariable = selectedQuery.variable;
				console.log("launching search");
				queryTask.execute(query, lang.hitch(this,this.searchResults));
			}
		},
		searchResults: function (results) {
			console.log("search results received");
			this.queryInProgress = false;
			if(results.features === 0) {
				alert("No data found!");
				return;
			}
			var resultsData = [];
			//if (this.grouping) {
				for(var i in results.features) {
					var curData = {};
					var poly = new Polygon(results.features[i].geometry);
					curData.polygon = poly;
					curData.area = GeometryEngine.geodesicArea(poly, 'square-kilometers');
					curData.value = results.features[i].attributes[this.curVariable];
					resultsData.push(curData);
				}
			//}
			/*else {
				var resultsGeometry = new Polygon();
				for(var i in results.features) {
					resultsGeometry.addRing(results.features[i].geometry);
				}
				resultsData.push(resultsGeometry);
			}*/
			this.number++;
			var grid = new Grid({
				columns: this.columns
			});
			grid.renderArray(resultsData);
			var cp = new ContentPane({
				id: "search-" + this.number,
				title: "Search " + this.number,
				content: grid
			});
			this.resultsPane.addChild(cp);
			console.log("finished processing search results");
		},
		changeQueries: function (event) {
			console.log("changed topic");
			this.querySelect.removeOption(this.querySelect.getOptions());
			this.querySelect.addOption(this.topics[event].options);
			this.queries = [];
			request.get("js/gis/dijit/Search/json/search.json", {
				handleAs: "json"
			}).then(lang.hitch(this, function (results) {
				for(var i in results[event].options) {
					this.queries.push(results[event].options[i]);
				}
			}));
			//this.querySelect.set('options', this.topics[event]);
			//this.querySelect.loadDropDown();
		}
	});
});