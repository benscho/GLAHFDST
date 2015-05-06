define([
	"esri/tasks/QueryTask",
	"esri/tasks/query",
	"esri/geometry/geometryEngine",
	"esri/layers/FeatureLayer",
	"esri/renderers/UniqueValueRenderer",
	"esri/symbols/SimpleFillSymbol",
	"esri/graphic",
	
	"dojo/DeferredList",
	"dojo/on",
	"dojo/dom",
	"dojo/request",
	"dojo/_base/array",
	"dojo/_base/declare",
	
	"dijit/form/Select",
	"dijit/form/TextBox",
	"dijit/registry",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./Criteria/templates/Criteria.html"
], function (QueryTask, Query, GeometryEngine, FeatureLayer, UniqueValueRenderer, SimpleFillSymbol, Graphic, DeferredList,
				on, dom, request, arrayUtil, declare, Select, TextBox, registry, _WidgetBase, _TemplatedMixin,
				_WidgetsInTemplateMixin, criteriaTemplate) {
	/*function runInvestigation () {
		var criteriaDeferreds = [];
		arrayUtil.forEach(criteriaList, function (criteria) {
			var curCriteria = registry.byId(criteria);
			var curURL = curCriteria.URL + curCriteria.layer;
			var query = new Query();
			var queryTask = new QueryTask(curURL);
			query.where = curCriteria.param + " like '%" + dom.byId(criteria).value + "%'";
			query.outFields = ["*"];
			query.returnGeometry = true;
			criteriaDeferreds.push(queryTask.execute(query));
		});
		new DeferredList(criteriaDeferreds).then(function (results) {
			var layerGeo = []; //needed if more than one obj in a given layer
			//first, construct base case
			//for us, that is every obj in the first layer
			for(var i in results[0][1].features){
					layerGeo.push(results[0][1].features[i].geometry);
			}
			var curIntersection = GeometryEngine.union(layerGeo);
			for(var i in results) {
				layerGeo = []; //zero out layerGeo
				for(var j in results[i][1].features) {
					layerGeo.push(GeometryEngine.intersect(results[i][1].features[j].geometry, curIntersection));
				}
				curIntersection = GeometryEngine.union(layerGeo);
			}
			console.log(curIntersection);
			var graphic = new Graphic(curIntersection);
			this.polygonGraphics.add(graphic);
		});
	}*/
	
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
		templateString: criteriaTemplate,
		postCreate: function () {
			this.inherited(arguments);
			this.initCriteria();
		},
		initCriteria: function () {
/*			var query = new Query();
			var queryCounties = new QueryTask("https://arcgis.lsa.umich.edu/arcgis/rest/services/IFR/mi_boundaries/MapServer/2");
			var queryLakes = new QueryTask("https://arcgis.lsa.umich.edu/arcgis/rest/services/IFR/mi_ifrhd_lakes_tabular/MapServer/0");
			var queries = [];
			query.where = "GNIS_Name = 'Fourmile Lake'";
			query.returnGeometry = true;
			query.outFields = ["*"];
			queries[0] = queryLakes.execute(query);
			query.where = "NAME = 'Washtenaw'";
			queries[1] = queryCounties.execute(query);
			var deflist = new DeferredList(queries).then(function (results) {
				var intersection = GeometryEngine.intersect(results[0][1].features[0].geometry, results[1][1].features[0].geometry);
				console.log(intersection);
			});*/
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
				id: 'criteria_poly',
				title: 'Criteria Graphics',
				mode: FeatureLayer.MODE_SNAPSHOT
			});
			this.polygonRenderer = new UniqueValueRenderer(new SimpleFillSymbol(), 'ren', null, null, ', ');
			this.polygonRenderer.addValue({
				value: 1,
				symbol: new SimpleFillSymbol({
					color: [255, 170, 0, 255],
					outline: {
						color: [255, 170, 0, 255],
						width: 1,
						type: 'esriSLS',
						style: 'esriSLSSolid'
					},
					type: 'esriSFS',
					style: 'esriSFSForwardDiagonal'
				}),
				label: 'Polygons that meet criteria',
				description: 'Polygons that meet criteria'
            });
            this.polygonGraphics.setRenderer(this.polygonRenderer);
            this.map.addLayer(this.polygonGraphics);
			request.get("/js/gis/dijit/Criteria/json/criteria.json", {
				handleAs: "json"
			}).then(function (results) {
				for(var i in results) {
					if (results[i].type === "select") {
						dom.byId('criteriaOptions').innerHTML += results[i].name + ":";
						var select = new Select({
							name: results[i].name,
							id: "criteria-"+i,
							options:[{
								label: "Options...",
								value: "",
								selected: true
							}],
							URL: results[i].URL,
							layer: results[i].layer,
							param: results[i].param
						}).placeAt('criteriaOptions');
						select.startup();
						dom.byId('criteriaOptions').innerHTML += "<br/>";
					} else if (results[i].type === "text") {
						dom.byId('criteriaOptions').innerHTML += results[i].name + ":";
						var textbox = new TextBox({
							name: results[i].name,
							id: "criteria-"+i,
							URL: results[i].URL,
							layer: results[i].layer,
							param: results[i].param
						}).placeAt('criteriaOptions');
						textbox.startup();
						dom.byId('criteriaOptions').innerHTML += "<br/>";
					} else { //result.type not recognized
						console.log("ERROR: Unrecognized results[i].type: " + results[i]);
					}
				}
			});
			on(dom.byId("investigate"), "click", this.runInvestigation);			
		},
		runInvestigation: function () {
			var criteriaDeferreds = [], i = 0;		
			while (true) {
				var curCriteria = registry.byId("criteria-" + i);
				if (!curCriteria) {
					break;
				}
				var curURL = curCriteria.URL + curCriteria.layer;
				var query = new Query();
				var queryTask = new QueryTask(curURL);
				query.where = curCriteria.param + " like '%" + dom.byId("criteria-" + i).value + "%'";
				query.outFields = ["*"];
				query.returnGeometry = true;
				criteriaDeferreds.push(queryTask.execute(query));
				i++;
			}
			new DeferredList(criteriaDeferreds).then(function (results) {
				var layerGeo = []; //needed if more than one obj in a given layer
				//first, construct base case
				//for us, that is every obj in the first layer
				for(var i in results[0][1].features){
						layerGeo.push(results[0][1].features[i].geometry);
				}
				var curIntersection = GeometryEngine.union(layerGeo);
				for(var i in results) {
					layerGeo = []; //zero out layerGeo
					for(var j in results[i][1].features) {
						layerGeo.push(GeometryEngine.intersect(results[i][1].features[j].geometry, curIntersection));
					}
					curIntersection = GeometryEngine.union(layerGeo);
				}
				console.log(curIntersection);
				var graphic = new Graphic(curIntersection);
				//this.polygonGraphics.add(graphic);
				dom.byId("criteriaOutput").innerHTML = "<strong>Results:</strong></br> Number of areas that satisfy criteria: " + curIntersection.rings.length;
			});
		}
	});
});