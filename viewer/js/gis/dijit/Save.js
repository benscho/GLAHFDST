define([
	'dstore/LocalDB',
	
	'esri/geometry/Extent',
	
	'dojo/dom',
	'dojo/_base/declare',
	'dojo/json',
	'dojo/topic',
	'dojo/text!./Save/templates/Save.html',
	
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dijit/form/FilteringSelect'
], function (LocalDB, Extent, dom, declare, JSON, topic, saveTemplate, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
		templateString: saveTemplate,
		postCreate: function () {
			this.inherited(arguments);
			this.dbConfig = {
				version: 10,
				stores: {
					geoLayers: {
						layerId: {
							indexed: false
						}
					},
					graphicLayers: {
						layerId: {
							indexed: false
						}
					}
				}
			};
			this.geoLayerDB =  new LocalDB({
				dbConfig: this.dbConfig,
				storeName: 'geoLayers'
			});
			this.graphicLayerDB = new LocalDB({
				dbConfig: this.dbConfig,
				storeName: 'graphicLayers'
			});
			this.slot = 1;
		},
		gatherData: function () {
			var layers = this.map.getLayersVisibleAtScale();
			this.activeGeoLayers = [], this.activeGraphicsLayers = [];
			for (var i in layers) {
				if (!layers[i].suspended) {
					if (layers[i].url) {
						if (layers[i].id === "layer0") {
							continue;
						}
						var insert = {
							id: layers[i].id,
							url: layers[i].url
						}
						this.activeGeoLayers.push(insert);
					}
					else {
						if (layers[i].graphics.length > 0) {
							for (var j in layers[i].graphics) {
								var json = layers[i].graphics[j].toJson();
								var geo = json.geometry, attr = json.attributes;
								var insert = {
									id: layers[i].id,
									geometry: geo,
									attributes: attr
								}
								if (layers[i].graphics[j].symbol) {
									insert.symbol = layers[i].graphics[j].symbol.toJson();
								}
								this.activeGraphicsLayers.push(insert);
							}
						}
					}
				}
			}
			this.saveData();
		},
		saveData: function () {
			var options = { overwrite: true };
			var extent = this.map.extent;
			insert = {
				layers: this.activeGeoLayers,
				id: this.slot,
				extent: extent
			}
			this.geoLayerDB.put(insert);
			insert = {
				layers: this.activeGraphicsLayers,
				id: this.slot
			}
			this.graphicLayerDB.put(insert);
		},
		loadData: function () {
			this.geoLayerDB.get(this.slot).then(function (results) {
				topic.publish("load/data", results);
			});
			this.graphicLayerDB.get(this.slot).then(function (results) {
				for (var i in results.layers) {
					var prefix = results.layers[i].id.split("_");
					if (prefix[0] === 'drawGraphics') {
						topic.publish("load/draw", results.layers[i]);
					} else if (prefix[0] === 'criteria') {
						topic.publish("load/criteria", results.layers[i]);
					} else { //unsupported data
					
					}
				}
			});
		},
		_onSlotChange: function (slot) {
			if (slot >= 0 && slot < 4) {
				this.slot = slot;
			}
		}
	});
});