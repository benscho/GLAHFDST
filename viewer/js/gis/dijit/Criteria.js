define([
	'esri/tasks/QueryTask',
	'esri/tasks/query',
	'esri/geometry/geometryEngine',
	'esri/layers/FeatureLayer',
	'esri/renderers/UniqueValueRenderer',
	'esri/symbols/SimpleFillSymbol',
	'esri/graphic',
	'esri/geometry/Polygon',
	
	'dgrid/OnDemandGrid',
	'dgrid/Selection',
	'dgrid/Keyboard',
	
	'dstore/Memory',
	
	'dojo/on',
	'dojo/dom',
	'dojo/request',
	'dojo/_base/array',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/promise/all',
	'dojo/topic',
	
	'dijit/form/Select',
	'dijit/form/TextBox',
	'dijit/registry',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/text!./Criteria/templates/Criteria.html',
	'xstyle/css!./Criteria/css/Criteria.css'
], function (QueryTask, Query, GeometryEngine, FeatureLayer, UniqueValueRenderer, SimpleFillSymbol, Graphic, Polygon, OnDemandGrid, Selection, Keyboard, Memory,
				on, dom, request, arrayUtil, declare, lang, all, topic, Select, TextBox, registry, _WidgetBase, _TemplatedMixin,
				_WidgetsInTemplateMixin, criteriaTemplate) {
	
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
		templateString: criteriaTemplate,
		postCreate: function () {
			this.inherited(arguments);
			this.initCriteria();
		},
		initCriteria: function () {
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
					color: "00DBFF",
					outline: {
						color: "00DBFF",
						width: 1,
						type: 'esriSLS',
						style: 'esriSLSSolid'
					},
					type: 'esriSFS',
					style: 'esriSFSHorizontal'
				}),
				label: 'Polygons that meet criteria',
				description: 'Polygons that meet criteria'
            });
            this.polygonGraphics.setRenderer(this.polygonRenderer);
            this.map.addLayer(this.polygonGraphics);
			this.criteriaObjs = [];
			//this.criteriaObjs.push({ "URL":"https://arcgis.lsa.umich.edu/arcgis/rest/services/IFR/mi_ifrhd_lakes_tabular/MapServer/0", "param": "GNIS_Name" });
			//this.criteriaObjs.push({ "URL":"https://arcgis.lsa.umich.edu/arcgis/rest/services/IFR/mi_boundaries/MapServer/2", "param": "NAME" });
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
			this.geoInfo = new Memory({ idProperty: 'id', data: []});
			topic.subscribe("load/criteria", lang.hitch(this, this.loadCriteria));
		},
		runInvestigation: function (polygonGraphics) {
			var criteriaDeferreds = [], i = 0, result;		
			while (true) {
				var curCriteria = dom.byId("criteria-" + i);
				if (!curCriteria) {
					break;
				}
				var curURL = this.criteriaObjs[i].URL;
				var query = new Query();
				var queryTask = new QueryTask(curURL);
				query.where = this.criteriaObjs[i].param + " like '%" + curCriteria.value + "%'";
				query.outFields = ["*"];
				query.returnGeometry = true;
				criteriaDeferreds.push(queryTask.execute(query));
				i++;
			}
			all(criteriaDeferreds).then(
				lang.hitch(this, function (results) {
					var layerGeo = []; //needed if more than one obj in a given layer
					//first, construct base case
					//for us, that is every obj in the first layer
					var  displayField;
					for(var i in results[0].features){
							layerGeo.push(results[0].features[i].geometry);
					}
					var curIntersection = GeometryEngine.union(layerGeo);
					for(var i in results) {
						layerGeo = []; //zero out layerGeo
						for(var j in results[i].features) {
							layerGeo.push(GeometryEngine.intersect(results[i].features[j].geometry, curIntersection));
						}
						curIntersection = GeometryEngine.union(layerGeo);
					}
					
					for(var i in results){
						displayField = results[i].displayFieldName;
						for(var j in results[i].features){
							if (GeometryEngine.intersect(curIntersection, results[i].features[j].geometry)) {
								this.geoInfo.put({"displayField": results[i].features[j].attributes[displayField], "extent": results[i].features[j].geometry.getExtent()});
							}	
						}
					}
		
					var graphic = new Graphic(curIntersection, null, { ren: 1 });
					this.polygonGraphics.add(graphic);
					this.map.setExtent(curIntersection.getExtent());
				})
			);
		},
		clearCriteria: function () {
			this.polygonGraphics.clear();
		},
		loadCriteria: function (data) {
			this.clearCriteria();
			var graphic = new Graphic(new Polygon(data.geometry), null, { ren: 1 });
			this.polygonGraphics.add(graphic);
		}
	});
});