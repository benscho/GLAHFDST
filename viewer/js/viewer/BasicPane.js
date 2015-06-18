define([
	"dojo/_base/declare",
    "dojo/request",
    "dojo/_base/array",
    "dijit/form/Select",
	"dojo/on",
	"dojo/dom",
	"esri/tasks/query",
	"esri/tasks/QueryTask",
	"dgrid/Grid",
	"dgrid/extensions/Pagination",
	"dstore/Memory",
	'dojo/promise/all',
	'esri/geometry/geometryEngine',
	"./Results"
], function (declare, request, arrayUtil, Select, on, dom, Query, QueryTask, Grid, Pagination, Memory, all, GeometryEngine, Results) {
	var queryStore, queryColumns;
	function showResults (results) {
		var querySelect = dijit.byId("querySelect");
		var selected = dijit.byId("querySelect").get("selected");
		var resultItems = [];
		var resultCount = results.features.length;
		for (var i = 0; i < resultCount; i++) {
			resultItems.push(results.features[i].attributes);
		}
		//queryStore = new Memory({ data: resultItems });
		queryData = results;
		queryColumns = querySelect.options[selected].displayColumns;
		var grid = new Grid({
			columns: queryColumns
		//	collection: queryStore
		}, "basicGrid");
		grid.renderArray(resultItems);
	}
	return {
		initBasic: function () {
			new Select({
				name: "querySelect",
				id: "querySelect",
				options: [{
					label: "Select a Query",
					value: "",
					selected: true,
					description: "This is a sample description."
				}]
			}, "selector").startup();
			request.get("/js/viewer/data/basic.json", {
				handleAs: "json"
			}).then(function (queries) {
				arrayUtil.forEach(queries, function (query) {
					var newOption = {
						label: query.name,
						value: query.name,
						URL: query.URL,
						fields: query.fields,
						layers: query.layers,
						description: query.description,
						displayColumns: query.displayColumns
					};
					dijit.byId("querySelect").addOption(newOption);
				});
			});
			dijit.byId("querySelect").on("change", function () {
				var i, options = this.get("options");
				for (i in options) {
					if (options[i].selected) {
						dojo.byId('description').innerHTML = this.get("options")[i].description;
						dijit.byId("querySelect").set("selected", parseInt(i));
						return;
					}
				}
			});
			on(dom.byId("queryBtnNv"), "click", function () {
				var querySelect = dijit.byId("querySelect");
				var selected = dijit.byId("querySelect").get("selected");
				var query = new Query();
				var queryTask = new QueryTask(querySelect.options[selected].URL);
				query.where = querySelect.options[selected].fields + " = '" + dojo.byId("queryTextNv").value + "'";
				query.returnGeometry = false;
				query.outFields = ["*"];
				queryTask.execute(query, showResults);
			});
			on(dom.byId("basicResultsBtn"), "click", function () {
				if (queryData === undefined){
					alert("No data to send to Results!");
					return;
				}
				Results.addNode(queryData);
			});
			on(dom.byId("queryTestBtn"), "click", function () {
				var query = new Query();
				query.where = "1=1";
				query.returnGeometry = true;
				query.outFields = ["*"];
				var queryTask = new QueryTask("https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_dss_le_walleye_hsi/MapServer/0");
				var def = queryTask.execute(query);
				var query2 = new Query();
				query2.where = "SUBBASIN = 'WER' or SUBBASIN = 'CER' or SUBBASIN = 'EER'";
				query2.returnGeometry = true;
				query2.outFields = ["*"];
				var queryTask2 = new QueryTask("https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_subbasins/MapServer/0");
				var def2 = queryTask2.execute(query2);
				all({ def, def2}).then(function(results){
					var hsiGeo = results["def"], subBasinGeo = results["def2"], basinHSI = [];
					for(var i = 0; i < subBasinGeo.features.length; i++) {
						var layer = {
							"basin name" : subBasinGeo.features[i].attributes.SUBBASIN,
							"HSI": []
						};
						for(var j = 0; j < hsiGeo.features.length; j++) {
							var inter = GeometryEngine.intersect(subBasinGeo.features[i].geometry, hsiGeo.features[j].geometry);
							if(inter){
								inter = GeometryEngine.planarArea(inter);
							} else {
								inter = 0;
							}
							layer.HSI.push({
								"Class": hsiGeo.features[j].attributes.Class,
								"Area (sq. km)": inter//GeometryEngine.planarArea(GeometryEngine.intersect(subBasinGeo.features[i].geometry, hsiGeo.features[j].geometry))
							});
						}
						basinHSI[i] = layer;
					}
					console.log(basinHSI);
				});
			});
		}
	};
});