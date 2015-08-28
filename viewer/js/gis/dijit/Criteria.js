define([
	'esri/tasks/QueryTask',
	'esri/tasks/query',
	'esri/geometry/geometryEngine',
	'esri/layers/FeatureLayer',
	'esri/renderers/UniqueValueRenderer',
	'esri/symbols/SimpleFillSymbol',
	'esri/graphic',
	'esri/geometry/Polygon',
	'esri/Color',
	'esri/SpatialReference',
	'esri/units',
	'esri/tasks/Geoprocessor',
	'esri/tasks/GeometryService',

	'dstore/Memory',
	
	'dojo/on',
	'dojo/dom',
	'dojo/request',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/promise/all',
	'dojo/topic',
	
	'dgrid/Grid',
	
	'dijit/layout/ContentPane',
	'dijit/registry',
	'dijit/form/Form',
	'dijit/form/RadioButton',
	'dijit/form/ComboBox',
	'dijit/form/TextBox',
	'dijit/form/Button',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/text!./Criteria/templates/Criteria.html',
	'xstyle/css!./Criteria/css/Criteria.css'
], function (QueryTask, Query, GeometryEngine, FeatureLayer, UniqueValueRenderer, SimpleFillSymbol, Graphic, Polygon, Color, SpatialReference, Units, Geoprocessor, GeometryService, Memory,
				on, dom, request, declare, lang, all, topic, Grid, ContentPane, registry, Form, RadioButton, ComboBox, TextBox, Button, _WidgetBase, _TemplatedMixin,
				_WidgetsInTemplateMixin, criteriaTemplate) {
	
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		referenceLayers: [],
		queryID: 0,
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
					/*if (results[i].type === "reference") { //commented out for now, eventually implement subbasins and classification zones as reference layers
						this.referenceLayers[i] = {
							name: results[i].name,
							id: "criteria-"+i,
							URL: results[i].URL,
							param: results[i].param
						};
					} else*/ if (results[i].type === "select") {
						var myStore = new Memory({
							data: [
								{name:"Options...", id:"option"}
							]
						});
						dom.byId('criteriaOptions').innerHTML += results[i].name + ":";
						var combo = new ComboBox({
							name: results[i].name,
							id: "criteria-"+i,
							value: "Options...",
							URL: results[i].URL,
							layer: results[i].layer,
							param: results[i].param,
							store: myStore
						}).placeAt('criteriaOptions');
						combo.startup();
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
					} else if (results[i].type === "radio") {
						dom.byId('criteriaOptions').innerHTML +="<u>"+ results[i].name + "</u>:<br/><form id=\"criteria-"+ i + "\" name=\"" + results[i].name + "\" URL=\""
							+ results[i].URL + "\" param=\"" + results[i].param + "\" + layer=\"" + results[i].layer + "\"></form>";
						for(var j in results[i].choices){
							dom.byId("criteria-" + i).innerHTML += "<div style=\"float:left;\"><input type=\"radio\" name=\"" + results[i].name + "\" value=\"" + results[i].choices[j][1] + "\"/>" + results[i].choices[j][0] + "</div>";
						}
						//form.startup();
						dom.byId('criteriaOptions').innerHTML += "<br/>";
					} else if (results[i].type === "heading") {
						dom.byId('criteriaOptions').innerHTML += "<h4 id=\"criteria-"+ i + "\" name=\"header\">" + results[i].name + "</h4>";
					} else { //result.type not recognized
						console.log("ERROR: Unrecognized results[i].type: " + results[i]);
					}
				}
			}); 
			this.geoInfo = new Memory({ idProperty: 'id', data: []});
			topic.subscribe("load/criteria", lang.hitch(this, this.loadCriteria));
		},
		constructBaseGeometry: function (results) {
			var layerGeo = []; //needed if more than one obj in a given layer
			//first, construct base case
			//for us, that is every obj in the first layer
			var displayField;
			for(var i in results[0].features) {
				layerGeo.push(results[0].features[i].geometry);
			}
			return GeometryEngine.union(layerGeo);
		},
		runInvestigation: function (polygonGraphics) {
			var i = 0, result, criteriaDeferreds = [], criteriaURLs = ""; 
			while (true) {
				var curCriteria = dom.byId("criteria-" + i);
				if (!curCriteria) {
					break;
				} else if (curCriteria.attributes.name.value === "header") {
					i++;
					continue;
				}
				else if (!document.querySelector('input[name=\"' + curCriteria.name + '\"]:checked')) {
					i++;
					continue;
				}
				var curVal = document.querySelector('input[name=\"' + curCriteria.name + '\"]:checked').value;
				var curParam = curCriteria.attributes.param.value;
				var curURL = curCriteria.attributes.URL.value;
				var curLayer = curCriteria.attributes.layer.value;
				/*var query = new Query();
				var queryTask = new QueryTask(curURL + "/" + curLayer);
				query.where = curParam + "=" + curVal;
				query.outFields = ["*"];
				query.returnGeometry = true;
				query.maxAllowableOffset = 1000;
				criteriaDeferreds.push(queryTask.execute(query));*/
				var url = curURL + "/" + curLayer + "/query?where=" + curParam + "=" + curVal + "&f=json";
				criteriaURLs += url + ",";
				i++;
			}
			criteriaURLs = criteriaURLs.slice(0, -1); //trim last ,
			var drawnGeo = {};
			var params = {
				//"polygon": drawnGeo,
				"Layers": criteriaURLs
			};
			console.log(params);
			gp = new Geoprocessor("https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/Criteria/GPServer/Criteria");
			gp.submitJob(params, lang.hitch(this, this.criteriaComplete), this.criteriaStatus, this.criteriaFailed);
			/*all(criteriaDeferreds).then(
				lang.hitch(this, function (results) {
					var layerGeo = []; //needed if more than one obj in a given layer
					//first, construct base case
					//for us, that is every obj in the first layer
					var displayField;
					for(var i in results[0].features){
							layerGeo.push(results[0].features[i].geometry);
					}
					var curIntersection = constructBaseGeometry(results);//GeometryEngine.union(layerGeo);
					if (results.length > 1) {
						for(var i in results) {
							layerGeo = []; //zero out layerGeo
							for(var j in results[i].features) {
								if (GeometryEngine.intersects(results[i].features[j].geometry, curIntersection)){
									layerGeo.push(GeometryEngine.intersect(results[i].features[j].geometry, curIntersection));
								}
							}
							curIntersection = GeometryEngine.union(layerGeo);
						}
					}
					console.log("done processing intersections");
					
					for(var i in results){
						displayField = results[i].displayFieldName;
						for(var j in results[i].features){
							if (GeometryEngine.intersect(curIntersection, results[i].features[j].geometry)) {
								this.geoInfo.put({"displayField": results[i].features[j].attributes[displayField], "extent": results[i].features[j].geometry.getExtent()});
							}	
						}
					}
					var useDrawn = false; //FOR TESTING! to be replaced with radio or checkbox
					var curGeo, //currently active geometry - drawn or previous criteria results
						newGeo; //new geometry we're getting from the query
					if (useDrawn) { //check if user has selected to use drawn graphics
						var layers = this.map.getLayersVisibleAtScale(), j;
						for (j = 0; j < layers.length; j++) {
							var prefix = layers[j].id.split("_");
							if(prefix === 'drawnGraphics') {
								if(layers[j].graphics){
									curGeo.addRing(layers[j].Graphics);
								}
							}
						}
					}
					else if (this.polygonGraphics.graphics) { //if we have graphics in criteria and user wants to iterate
						
					}
					else if (this.polygonGraphics.graphics) { //we have graphics in criteria but user wants to restart
						
					}
					else { //no graphics anywhere! we're starting anew
						curGeo = new Polygon(new SpatialReference({wkid:102100}));
						newGeo = new Polygon(new SpatialReference({wkid:102100}));
						curGeo.addRing([
							[-8939064.8907999992,5250835.0367999971],
							[-8939111.8277000003,5250856.8774000034],
							[-8939070.5055,5250886.1327000037],
							[-8939064.8907999992,5250835.0367999971]
						]);
						newGeo.addRing([
							[-8936480.0787000004,5250901.3295999989],
							[-8936433.1667999998,5250879.4804999977],
							[-8936474.4569000006,5250850.2289000005],
							[-8936480.0787000004,5250901.3295999989]
						]);
					}
					var geoservice = new GeometryService("https://arcgisdev.lsa.umich.edu/arcgis/rest/services/Utilities/Geometry/GeometryServer");
					//geoservice.intersect(curGeo, newGeo, this.criteriaComplete, this.criteriaFailed);
					//need to display results
					//arbitrary # system, but also want area per geometry, Lake, Sub-basin, mgmt zone, and possible suitability score
					//possibly use attributetables?
					/*var graphic = new Graphic(curIntersection, null, { ren: 1 });
					if (curIntersection.rings.length > 0){
						this.polygonGraphics.add(graphic);
						this.map.setExtent(curIntersection.getExtent());
						this.createFeatureTable(curIntersection);
					}
				})
			);*/
		},
		criteriaComplete: function (jobInfo) {
			console.log("succeeded!");
			gp = new Geoprocessor("https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/Criteria/GPServer/Criteria");
			gp.getResultData(jobInfo.jobId, "outputFC", lang.hitch(this, function (results) {
				console.log("retrived results");
				this.polygonGraphics.add(results.value.features[0].geometry, null, { ren: 1 }); //TODO: Multiple result polygons
			}), function (error) {
				console.log("failure to return results");
			});
		},
		criteriaStatus: function (info) {
			console.log("status: " + info);
		},
		criteriaFailed: function (error) {
			console.log("failed: " + error);
		},
		clearCriteria: function () {
			this.polygonGraphics.clear();
		},
		loadCriteria: function (data) {
			this.clearCriteria();
			var graphic = new Graphic(new Polygon(data.geometry), null, { ren: 1 });
			this.polygonGraphics.add(graphic);
		},
		/*createFeatureTable: function (polygons) {
            //var attributeTable = registry.byId('attributesContainer_widget');
			var tabContainer = registry.byId('tabContainer');
            this.queryID = this.queryID + 1;
			var columns = [ //start simple, add lake, subbasin, zone after we get it working
				{
					field: "number",
					label: "#"
				},
				{
					field: "area",
					label: "Area (km^2)"
				}
			];
			
			var processedResults = [];
			for(var i=0;i<polygons.rings.length;i++) {
				var result = [];
				result.number = i+1;
				result.polygon = new Polygon(new SpatialReference(102100));
				result.polygon.addRing(polygons.rings[i]);
				result.area = GeometryEngine.geodesicArea(result.polygon);
				processedResults[i] = result;
			}
			
			var grid = new Grid({
				id: this.queryID,
				columns: columns
			});
			grid.renderArray(processedResults);
			var cp = new ContentPane({
				title: "Criteria " + this.queryID,
				content: grid
			});
			tabContainer.addChild(cp);
		}*/
	});
});