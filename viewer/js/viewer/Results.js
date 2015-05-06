define([
	"dojo/_base/declare",
	"dojox/charting/Chart",
	"dojox/charting/action2d/Tooltip",
	"dojox/charting/themes/Claro",
	"dojox/gfx/fx",
	"dojo/dom",
	"dojo/on",
	"dgrid/Grid",
	"dgrid/extensions/Pagination",
	"dstore/Memory",
	"dojo/request",
	"dojox/charting/plot2d/Lines",
	"dojox/charting/axis2d/Default",
	"dojo/domReady!"
], function (declare, Chart, Tooltip, Claro, gfxFx, dom, on, Grid, Pagination, Memory, request) {
	var globalId = 0;
	return {
		initResults: function() {
/*			var chartData = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
			var chart = new Chart("chartNode");
			chart.setTheme(Claro);
			chart.addPlot("default", { type: "Lines", markers: true });
			chart.addAxis("x");
			chart.addAxis("y", { vertical: true, fixLower: "major", fixUpper: "major" });
			chart.addSeries("Fibbonaci", chartData);
			chart.render();
			var data = [
				{ first: 'Bob', last: 'Barker', age: 89 },
				{ first: 'Vanna', last: 'White', age: 55 },
				{ first: 'Pat', last: 'Sajak', age: 65 }
			];
			var grid = new Grid({
				columns: {
					first: 'First Name',
					last: 'Last Name',
					age: 'Age'
				}
			}, 'grid');
			grid.renderArray(data);*/
		},
/*		addNode: function(queryStore, queryColumns) {
			var title = "Default Title", chart, html, grid, gridData = [];
			html = "<div class='dataNode' id='" + globalId + "-node' style='border: 1px solid black'><h3 align='center'>" + title + "</h3><div id='" + globalId + "-close' align='right'>&#10006;</div>";
			html += "<div class='dataTable' id='" + globalId + "-table'></div>";
			html += "<div class='dataChart' id='" + globalId + "-chart'></div>";
			html += "</div>";
			dom.byId("results").innerHTML += html;
			grid = new (declare([ Grid, Pagination ]))({
				columns: queryColumns,
				collection: queryStore
			}, globalId+"-table");
			globalId++;
		}*/
		addNode: function (results) {
			var resultItems = [];
			var resultCount = results.features.length;
			for (var i = 0; i < resultCount; i++) {
				resultItems.push(results.features[i].attributes);
			}
//			var queryStore = new Memory({ data: resultItems });
			var queryColumns = results.fieldAliases;
			var grid = new Grid({
				columns: queryColumns
			}, "results");
			grid.renderArray(resultItems);
		}
	}
});