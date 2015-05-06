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
	"./Results"
	//http://jsfiddle.net/fz08dh16/4/ for online version
], function (declare, request, arrayUtil, Select, on, dom, Query, QueryTask, Grid, Pagination, Memory, Results) {
	var queryStore, queryColumns;
	function showResults (results) {
		var resultItems = [];
		var resultCount = results.features.length;
		for (var i = 0; i < resultCount; i++) {
			resultItems.push(results.features[i].attributes);
		}
		//queryStore = new Memory({ data: resultItems });
		queryData = results;
		queryColumns = results.fieldAliases;
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
						description: query.description
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
		}
	};
});