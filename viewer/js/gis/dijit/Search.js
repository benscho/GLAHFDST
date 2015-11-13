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
	_TemplatedMixin, _WidgetsInTemplateMixin, Query, QueryTask, Polygon, GeometryEngine,
	FeatureLayer, UniqueValueRenderer, SimpleFillSymbol, Color, Graphic, SpatialReference, SearchTemplate) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
		templateString: SearchTemplate,
		postCreate: function() {
			this.inherited(arguments);

			this.topics = [];
			this.queries = [];
			//FOR VALIDATION OF AREAS
			this.polygonGraphics = new FeatureLayer({
				layerDefinition: {
					geometryType: 'esriGeometryPolygon',
					fields: [{
						name: 'OBJECTID',
						type: 'esriFieldTypeOID',
						alias: 'OBJECTID',
						domain: null,
						editable: false,
						nullable: false
					}, {
						name: 'ren',
						type: 'esriFieldTypeInteger',
						alias: 'ren',
						domain: null,
						editable: true,
						nullable: false
					}]
				},
				featureSet: null
			}, {
				id: 'search_poly',
				title: 'Search Graphics',
				mode: FeatureLayer.MODE_SNAPSHOT
			});
			this.polygonRenderer = new UniqueValueRenderer(new SimpleFillSymbol(), 'ren', null, null, ', ');
			this.polygonRenderer.addValue({
				value: 1,
				symbol: new SimpleFillSymbol({
					color: new Color("99FF33"),
					outline: {
						color: new Color("99FF33"),
						width: 1,
						type: 'esriSLS',
						style: 'esriSLSSolid'
					},
					type: 'esriSFS',
					style: 'esriSFSSolid'
				}),
				label: 'Polygons that meet search criteria',
				description: 'Polygons that meet search criteria'
            });
            this.polygonGraphics.setRenderer(this.polygonRenderer);
            this.map.addLayer(this.polygonGraphics);
			//END VALIDATION
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
			var topicIndex = registry.byId("topicSelect").tabIndex;
			var queryIndex = registry.byId("querySelect").tabIndex;
			var selectedTopic = this.topics[topicIndex];
			var selectedQuery = this.queries[queryIndex];
			var query = new Query();
			var queryTask = new QueryTask(selectedQuery.url);
			query.where = selectedQuery.param + "=" + selectedQuery.value;
			query.outFields = ["*"];
			query.returnGeometry = true;
			this.grouping = selectedQuery.grouping;
			this.queryInProgress = true;
			console.log("launching search");
			queryTask.execute(query, lang.hitch(this,this.searchResults));
		},
		searchResults: function (results) {
			console.log("search results received");
			this.queryInProgress = false;
			var resultsData = [];
			if (this.grouping) {
				for(var i in results.features) {
					var curData = {};
					var poly = new Polygon(results.features[i].geometry);
					curData.polygon = poly;
					curData.area = GeometryEngine.geodesicArea(poly, 'square-kilometers');
					curData.attributes = results.features[i].attributes;
					resultsData.push(curData);
				}
			}
			else {
				var resultsGeometry = new Polygon();
				for(var i in results.features) {
					resultsGeometry.addRing(results.features[i].geometry);
				}
				resultsData.push(resultsGeometry);
			}		
			/*var searchPoly = new Polygon(new SpatialReference({wkid:3857}));
			for (var j in results.features[0].geometry.rings) {
				searchPoly.addRing(results.features[0].geometry.rings[j]);
			}
			var graphic = new Graphic(searchPoly, null, { ren: 1 });
			this.polygonGraphics.add(graphic);*/
			console.log("finished processing search results");
		},
		changeQueries: function (event) {
			console.log("changed topic");
			this.querySelect.removeOption(this.querySelect.getOptions());
			this.querySelect.addOption(this.topics[event].options);
			//this.querySelect.set('options', this.topics[event]);
			//this.querySelect.loadDropDown();
		}
	});
});