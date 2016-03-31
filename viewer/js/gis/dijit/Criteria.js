define([
	'esri/tasks/QueryTask',
	'esri/tasks/query',
	'esri/geometry/geometryEngine',
	'esri/layers/FeatureLayer',
	'esri/renderers/UniqueValueRenderer',
	'esri/renderers/SimpleRenderer',
	'esri/symbols/SimpleFillSymbol',
	'esri/symbols/SimpleLineSymbol',
	'esri/graphic',
	'esri/geometry/Polygon',
	'esri/Color',
	'esri/SpatialReference',
	'esri/units',
	'esri/tasks/Geoprocessor',
	'esri/tasks/GeometryService',
	'esri/InfoTemplate',

	'dstore/Memory',
	
	'dojo/dom-style',
	'dojo/on',
	'dojo/dom',
	'dojo/request',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/json',
	'dojo/promise/all',
	'dojo/topic',
	'dojo/io-query',
	'dojo/parser',
	'dojo/dom-class',
	
	'dgrid/Grid',
	
	'dijit/popup',
	'dijit/Dialog',
	'dijit/layout/ContentPane',
	'dijit/registry',
	'dijit/form/Form',
	'dijit/form/RadioButton',
	'dijit/form/ComboBox',
	'dijit/form/TextBox',
	'dijit/form/Button',
	'dijit/form/CheckBox',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/text!./Criteria/templates/Criteria.html',
	'xstyle/css!./Criteria/css/Criteria.css'
], function (QueryTask, Query, GeometryEngine, FeatureLayer, UniqueValueRenderer, SimpleRenderer, SimpleFillSymbol, SimpleLineSymbol,
			Graphic, Polygon, Color, SpatialReference, Units, Geoprocessor, GeometryService, InfoTemplate, Memory,
			domStyle, on, dom, request, declare, lang, json, all, topic, ioQuery, parser, domClass, Grid, popup, Dialog, ContentPane, registry, Form,
			RadioButton, ComboBox, TextBox, Button, CheckBox, _WidgetBase, _TemplatedMixin,
				_WidgetsInTemplateMixin, criteriaTemplate) {
	
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		referenceLayers: [],
		queryID: 0,
		widgetsInTemplate: true,
		templateString: criteriaTemplate,
		criteriaLayers: [],
		colors: [],
		postCreate: function () {
			this.inherited(arguments);
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
			request.get("js/gis/dijit/Criteria/json/criteria.json", {
				handleAs: "json"
			}).then(function (results) {
				var toolTips = [];
				for(var i in results) {
					//potential to support many different types of criteria
					//but currently only checkbox and heading are supported
					if (results[i].type === "checkbox") {
						toolTips[i] = new Dialog({
							content: results[i].description,
							style: "width: 330px",
							onMouseUp: function() {
								popup.close(toolTips[this.id.slice(5,-3)]);
							}
						});
						dom.byId('criteriaOptions').innerHTML +="<u>"+ results[i].name + "</u>:&nbsp;<i class=\"fa fa-info fa-3 critInfo\" id=\"crit-" + i + "-id\"></i>" 
							+ "<br><div data-dojo-type=\"dijit/form/Form\" id=\"criteria-" + i + "\" name=\"" + results[i].name + "\" URL=\"" + results[i].URL + "\" param=\"" + results[i].param
							+ "\" layer=\"" + results[i].layer + "\"></div>";
						for(var j in results[i].choices){
							dom.byId("criteria-" + i).innerHTML += "<input type=\"checkbox\" name=\"" 
							+ results[i].choices[j]["name"] + "\" value=\"" + results[i].choices[j]["value"] + "\" style=\"cursor: pointer;\"></input>"
							+ results[i].choices[j]["name"] + "<br/>";
						}
					} else if (results[i].type === "heading") {
						toolTips[i] = new Dialog({
							content: results[i].description,
							style: "width: 330px",
							onMouseUp: function() {
								popup.close(toolTips[this.id.slice(5,-3)]);
							}
						});
						dom.byId('criteriaOptions').innerHTML += "<h4 id=\"criteria-"+ i + "\" name=\"header\">" + results[i].name + "</h4>";
					} else { //result.type not recognized
						console.log("ERROR: Unrecognized results[i].type: " + results[i]);
					}
				}
				for(var j in toolTips) {
					var node = dom.byId("crit-"+ j + "-id");
					if (!node) {
						continue;
					}
					on(node, "click", function() {
						popup.open({
							popup: toolTips[this.id.slice(5,-3)],
							around: dom.byId(this.id)
						});
					});
				}
			}); 
			//this.geoInfo = new Memory({ idProperty: 'id', data: []});
			topic.subscribe("load/criteria", lang.hitch(this, this.loadCriteria));
			this.colors = ["blue", "yellow", "red", "green", "purple", "#FFA500"]; //last value is the hex for orange
			//esri's Color() method doesn't accept "orange" as a valid color string for some reason...
		},
		runInvestigation: function (polygonGraphics) {
			var i = 0, result, criteriaDeferreds = [], criteriaURLs = "";
			this.polygonGraphics.clear();
			this.clearCriteria();
			var selected = document.querySelectorAll("div#criteriaOptions input[type=checkbox]:checked");
			if (selected.length === 0) {
				alert("Please select one or more of the habitat criteria before hitting the Investigate button!");
				return;
			}
			var curParent, newLayer = {}, j = 0, myLayers = [];
			for (var i in selected) {
				if (i === "length" || i === "item") {
					break;
				}
				var parent = selected[i].parentNode;
				if(parent === curParent) {
					newLayer.values.push(selected[i].value);
					newLayer.options.push(selected[i].name);
				}
				else {
					if(curParent) {
						myLayers.push(newLayer);
						j += 1;
					}
					curParent = parent;
					newLayer = {};
					newLayer.values = [selected[i].value];
					newLayer.URL = parent.attributes.url.value;
					newLayer.layer = parent.attributes.layer.value;
					newLayer.param = parent.attributes.param.value;
					newLayer.index = j;
					newLayer.name = parent.attributes.name.value;
					newLayer.options = [selected[i].name];
				}				
			}
			myLayers.push(newLayer);
			if (myLayers.length > 6) {
				alert("Please select criteria from 6 or fewer categories.");
				return;
			}
			var queryStr = "";
			this.queryParams = [];
			this.criteriaLayers = [];
			for (var i = 0; i < myLayers.length; i++) {
				this.createLayer(myLayers[i]);
				var curParam = myLayers[i].param;
				var whereStr = "";
				for (var j = 0; j < myLayers[i].values.length; j++) {
					whereStr += curParam + " = " + myLayers[i].values[j] + " OR ";
				}
				whereStr = whereStr.slice(0, -4); //trim last " OR "
				var query = {
					where: whereStr,
					f: "json"
				};
				var baseURL = myLayers[i].URL + "/";
				var urlStr = baseURL + myLayers[i].layer + "/" + "query?" + ioQuery.objectToQuery(query);
				queryStr += urlStr + ",";
			}
			queryStr = queryStr.slice(0, -1); //trim last ","
			var params = {
				"layers": queryStr
			};
			console.log(params);
			this.numLayers = myLayers.length;
			this.criteriaLegend();
			if (this.numLayers === 1) {
				console.log("only 1 layer selected");
				return;
			}
			this.gp = new Geoprocessor("https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/Criteria/GPServer/Criteria");
			this.gp.submitJob(params, lang.hitch(this, this.criteriaComplete), this.criteriaStatus, this.criteriaFailed);
			domStyle.set(dojo.byId("criteriaLoading"), "display", "inline");
			domStyle.set(dojo.byId("criteriaMessage"), "display", "inline");
		},
		criteriaLegend: function () {
			domStyle.set(dom.byId("legend"), "display", "inline");
			for (var i = 0; i < this.criteriaLayers.length; i++) {
				var html = "<div id = \"legend-group-" + i + "\"><i class=\"fa layerControlIcon fa-plus-square-o\""
					+ "id = \"legend-expand-" + i + "\" style=\"cursor: pointer;\"></i>" 
					+ "<input type=\"checkbox\" id=\"crit-layer-" + i + "\" checked=\"true\" style=\"cursor: pointer;\"></input>"
					+ this.criteriaLayers[i].name + "&nbsp;<div style=\"background:" + this.colors[i] + ";width:17px;float:right;\">&nbsp;</div>";
				var options = this.criteriaLayers[i].options;
				for (var j = 0; j < options.length; j++) {
					html += "<div class=\"inactive legendOption\">" + options[j] + "</div>";
				}
				html += "</div>";
				dom.byId("criteriaLegend").innerHTML += html;
			}
			if (this.numLayers > 1) {
				dom.byId("criteriaLegend").innerHTML += "<input type=\"checkbox\" id=\"crit-layer-" + i + "\" checked=\"true\" style=\"cursor: pointer; margin-left:15px;\">" 
					+ "</input>Intersection&nbsp;<div style=\"background:#99FF33;width:17px;float:right;\">&nbsp;</div><br>";
			}
			for(var j = 0; j < this.numLayers; j++) {
				on(dojo.byId("crit-layer-" + j), "click", lang.hitch(this, function(evt) {
					var id = evt.srcElement.id.slice(-1);
					if (this.criteriaLayers[id].visible) {
						this.criteriaLayers[id].hide();
					}
					else {
						this.criteriaLayers[id].show();
					}
				}));
				on(dojo.byId("legend-expand-" + j), "click", lang.hitch(this, function(evt) {
					var id = evt.srcElement.id.slice(-1);
					var inactiveOptions = document.querySelectorAll("#legend-group-" + id + " .legendOption");
					for(var j in inactiveOptions) {
						domClass.toggle(inactiveOptions[j], "inactive");
						domClass.toggle(inactiveOptions[j], "active");
					}
					domClass.toggle("legend-expand-" + id, "fa-plus-square-o");
					domClass.toggle("legend-expand-" + id, "fa-minus-square-o");
				}));
			}
			if (this.numLayers > 1) {
				on(dojo.byId("crit-layer-" + j), "click", lang.hitch(this, function(evt) {
					if (this.polygonGraphics.visible) {
						this.polygonGraphics.hide();
						dojo.byId("crit-layer-" + j).checked = false;
					}
					else {
						this.polygonGraphics.show();
						dojo.byId("crit-layer-" + j).checked = true;
					}
				}));
			}
		},
		createLayer: function (layerInfo) {
			var newLayer = new FeatureLayer(layerInfo.URL + "/" + layerInfo.layer, { outFields: ["*"] });
			if (layerInfo.values.length === 1) {
				newLayer.setDefinitionExpression(layerInfo.param + " = " + layerInfo.values);
			}
			else {
				var definitionStr = "";
				for(var i = 0; i < layerInfo.values.length; i++) {
					definitionStr+= (layerInfo.param + " = " + layerInfo.values[i]) + " OR ";
				}
				//remove last " OR "
				definitionStr = definitionStr.slice(0,-4);
				newLayer.setDefinitionExpression(definitionStr);
			}
			var layerColor = new Color(this.colors[layerInfo.index]);
			var simpleColor = layerColor.toRgb();
			var rgbaColor = layerColor.toRgba();
			rgbaColor[3] = 0.25; //opacity
			rgbaColor = new Color(rgbaColor);
			simpleColor = new Color(simpleColor);
			var symbol = new SimpleRenderer(
				new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, simpleColor, 2), rgbaColor)
			);
			newLayer.setRenderer(symbol);
			newLayer.name = layerInfo.name;
			newLayer.options = layerInfo.options;
			this.criteriaLayers.push(newLayer);
			this.map.addLayer(newLayer);
		},
		criteriaComplete: function (jobInfo) {
			this.map.reorderLayer(this.polygonGraphics, this.map.layerIds.length);
			domStyle.set(dojo.byId("criteriaLoading"), "display", "none");
			domStyle.set(dojo.byId("criteriaMessage"), "display", "none");
			this.gp.getResultData(jobInfo.jobId, "outputFC", lang.hitch(this, function (results) {
				console.log("retrived results");
				var infoTemplate = new InfoTemplate();
				infoTemplate.setTitle("Test");
				var fieldStr = "${*}";
				infoTemplate.setContent(fieldStr);
				if (results.value.features.length === 0) {
					alert("Criteria Investigation returned no results!");
					return;
				}
				var critPoly = new Polygon(new SpatialReference({wkid:3857}));
				for(var i in results.value.features) {
					for(var j in results.value.features[i].geometry.rings){
						critPoly.addRing(results.value.features[i].geometry.rings[j]);
					}
				}
				var graphic = new Graphic(critPoly, null);
				var attr = { ren: 1, "queryParams": this.queryParams };
				graphic.setAttributes(attr);
				this.polygonGraphics.add(graphic);
				console.log(GeometryEngine.geodesicArea(critPoly, 'square-kilometers'));
				this.map.setExtent(critPoly.getExtent());
			}), function (error) {
				console.log("failure to return results");
				console.log(error);
			});
		},
		criteriaStatus: function (info) {
			console.log("status: " + info);
		},
		criteriaFailed: function (error) {
			console.log("failed: " + error);
		},
		clearCriteria: function () {
			for(var i = 0; i < this.criteriaLayers.length; i++) {
				this.criteriaLayers[i].clear();
			}
			this.polygonGraphics.clear();
			domStyle.set(dom.byId("legend"), "display", "none");
			dom.byId("criteriaLegend").innerHTML = "";
		},
		loadCriteria: function (data) {
			this.clearCriteria();
			this.queryParams = data.attributes.queryParams;
			for (var i = 0; i < this.queryParams.length; i++) {
				this.createLayer(this.queryParams[i]);
			}
			var critPoly = new Polygon(new SpatialReference({wkid:3857}));
			for(var j in data.geometry.rings){
				critPoly.addRing(data.geometry.rings[j]);
			}
			
			var attr = { ren: 1, "queryParams": this.queryParams };
			var graphic = new Graphic(critPoly, null);
			graphic.setAttributes(attr);
			this.polygonGraphics.add(graphic);
			this.criteriaLegend();
			this.polygonGraphics.show();
			for (i = 0; i < this.queryParams.length; i++) {
				this.map.reorderLayer(this.criteriaLayers[i],0);
			}
		}
	});
});