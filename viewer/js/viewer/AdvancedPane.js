define([
	'dojo/json',
	'dojo/dom',
	'dojo/on',
	'dojo/request/script',
	'dojo/DeferredList',
	'dojo/promise/all',
	'dijit/form/Select',
	'dijit/layout/ContentPane',
	'dojo/store/Memory',
	'dijit/tree/ObjectStoreModel',
	'dijit/Tree',
	'dijit/form/Textarea',
	'esri/tasks/QueryTask',
	'esri/tasks/query',
	'dojox/collections/ArrayList',
	'config/viewer',
	'./Results',
	'dgrid/Grid',
	'dojo/domReady!'
//online version at: http://jsfiddle.net/hf7q9koc/43/
], function (JSON, dom, on, script, DeferredList, all, Select, ContentPane, Memory, ObjectStoreModel, Tree, Textarea, QueryTask, Query, ArrayList, viewer, Results, Grid) {
	var queryData;
	function showResults (results) {
		var grid = new Grid({
			columns: results.fieldAliases
		}, "advGrid");
		var resultItems = [];
		var resultCount = results.features.length;
		for (var i = 0; i < resultCount; i++) {
			resultItems.push(results.features[i].attributes);
		}
		grid.renderArray(resultItems);
		queryData = results;
	}
	return{
		initAdvanced: function() {
			var services = viewer.operationalLayers;
			var globalId = 0;
			var j;
			var objects = [];
			var option1;
			var layerURLs = [];
			var fieldObjs = [];
			var myStore = new Memory({
				data: [{
					id: globalId++,
					name: 'Services',
					root: true
				}],
				getChildren: function (object) {
					return this.query({
						parent: object.id
					});
				}
			});

			var i;
			for (i in services) {
				objects[i] = script.get(services[i].url + "?f=json", {
					jsonp: "callback",
					timeout: 3000
				});
			}
			all(objects).then(function (results) {
				var i;
				var j;
				for (i in results) {
					option1 = {
						value: services[i].url,
						label: services[i].title,
						selected: false,
						name: services[i].title,
						URL: services[i].url,
						parent: 0,
						id: globalId,
						type: "service"
					};
					myStore.add(option1);
					//globalId will now point to the parent's value
					for (j in results[i].layers) {
						var URL = services[i].url + "/" + j;
						option2 = {
							id: (globalId + parseInt(j, 10) + 1),
							name: results[i].layers[j].name,
							parent: globalId,
							selected: false,
							label: results[i].layers[j].name,
							URL: URL,
							value: services[i].url,
							type: "layer"
						};
						myStore.add(option2);
						layerURLs.push({
							URL: URL,
							parent: globalId,
							id: (globalId + parseInt(j, 10) + 1)
						});
					}
					globalId += parseInt(j, 10) + 2;
				}
				//initial for loop ends. layers and services populated
				for (i in layerURLs) {
					fieldObjs[i] = script.get(layerURLs[i].URL + "?f=json", {
						jsonp: "callback",
						timeout: 3000
					});
				}
				all(fieldObjs).then(function (results) {
					var i;
					var j;
					for (i in results) {
						for (j in results[i].fields) {
							option2 = {
								id: globalId++,
								name: results[i].fields[j].name,
								parent: layerURLs[i].id,
								value: results[i].fields[j].type,
								selected: false,
								URL: layerURLs[i].URL,
								label: results[i].fields[j].name,
								type: 'field'
							};
							myStore.add(option2);
						}
					}
				}).then(function () {
					var myModel = new ObjectStoreModel({
						store: myStore,
						query: {
							root: true
						}
					});

					new Tree({
						id: "myTree",
						model: myModel,
						showRoot: false
					}, "markup").startup();
				});
			});

			on(dom.byId("queryBtnEx"), "click", function () {
				var selected = dijit.byId("myTree").selectedItems;
				if (selected.length < 1) { //query btn hit with nothing selected
					alert("Error: Nothing selected. Please select at least one layer to query.");
					return;
				}
				var i;
				var parentId = selected[0].parent.id;
				var layers = new ArrayList();
				var fields = new ArrayList();
				for (i in selected) {
					if (!layers.contains(selected[i].parent)) {
						layers.add(selected[i].parent);
					}
					if (!fields.contains(selected[i].name)) {
						fields.add(selected[i].name);
					}
					if (selected[i].type !== "layer") {
						alert("Error: One of the selected items is not a layer. Please, only select layer.");
						return;
					}
					var layer = myStore.get(selected[i].parent);
					var service = myStore.get(layer.parent);
				}
				var query = new Query();
				var queryTask = new QueryTask(selected[0].URL);
				query.where = dojo.byId("queryTextEx").value;
				query.returnGeometry = false;
				query.outFields = ["*"];
				queryTask.execute(query, showResults);
			});
			on(dom.byId("advResultsBtn"), "click", function () {
				if (queryData === undefined){
					alert("No data to send to Results!");
					return;
				}
				Results.addNode(queryData);
			});
		}
	}
});