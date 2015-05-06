define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/_base/lang',
	'dojo/_base/Color',
	'esri/toolbars/draw',
	'esri/layers/GraphicsLayer',
	'esri/graphic',
	'esri/renderers/SimpleRenderer',
	'dojo/text!./InteractiveDraw/templates/Draw.html',
	'esri/renderers/UniqueValueRenderer',
	'esri/symbols/SimpleMarkerSymbol',
	'esri/symbols/SimpleLineSymbol',
	'esri/symbols/SimpleFillSymbol',
	'esri/layers/FeatureLayer',
	'esri/geometry/geometryEngine',
	'dojo/topic',
	'dojo/aspect',
	'dojo/json',
	'dojo/i18n!./Draw/nls/resource',
	'esri/tasks/query',
	'esri/tasks/QueryTask',
	'esri/tasks/FeatureSet',
	'dijit/form/Button',
	'esri/geometry/Polygon',
	'esri/geometry/Polyline',
	'esri/geometry/Point',
	'esri/SpatialReference',
	'gis/dijit/Extract',
	'dijit/registry',
	'xstyle/css!./InteractiveDraw/css/Draw.css',
	'xstyle/css!./InteractiveDraw/css/adw-icons.css'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang,
	Color, Draw, GraphicsLayer, Graphic, SimpleRenderer, drawTemplate, UniqueValueRenderer,
	SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, FeatureLayer, GeometryEngine, topic, aspect, JSON,
	i18n, Query, QueryTask, FeatureSet, Button, Polygon, Polyline, Point, spatialReference, Extract, registry) {
	
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
	    widgetsInTemplate: true,
        templateString: drawTemplate,
        i18n: i18n,
        drawToolbar: null,
        mapClickMode: null,
		postCreate: function () {
            this.inherited(arguments);
            this.drawToolbar = new Draw(this.map);
            this.drawToolbar.on('draw-end', lang.hitch(this, 'onDrawToolbarDrawEnd'));

            this.createGraphicLayers();

            this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode')));
            if (this.parentWidget && this.parentWidget.toggleable) {
                this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
                    this.onLayoutChange(this.parentWidget.open);
                })));
            }
		},
		createGraphicLayers: function () {
            this.pointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([255, 0, 0, 1.0]));
            this.polylineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 1);
            this.polygonSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.0]));
            this.pointGraphics = new GraphicsLayer({
                id: 'iDrawGraphics_point',
                title: 'Interactive Draw Graphics'
            });
            this.pointRenderer = new SimpleRenderer(this.pointSymbol);
            this.pointRenderer.label = 'User drawn points';
            this.pointRenderer.description = 'User drawn points';
            this.pointGraphics.setRenderer(this.pointRenderer);
            this.map.addLayer(this.pointGraphics);
            this.polylineGraphics = new GraphicsLayer({
                id: 'iDrawGraphics_line',
                title: 'Interactive Draw Graphics'
            });
            this.polylineRenderer = new SimpleRenderer(this.polylineSymbol);
            this.polylineRenderer.label = 'User drawn lines';
            this.polylineRenderer.description = 'User drawn lines';
            this.polylineGraphics.setRenderer(this.polylineRenderer);
            this.map.addLayer(this.polylineGraphics);

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
                id: 'iDrawGraphics_poly',
                title: 'Interactive Draw Graphics',
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
				label: 'User drawn polygons',
				description: 'User drawn polygons'
            });
            this.polygonGraphics.setRenderer(this.polygonRenderer);
            this.map.addLayer(this.polygonGraphics);
			topic.subscribe('load/idraw', lang.hitch(this, this.loadDrawnGraphics));
		},
        drawPoint: function () {
            this.disconnectMapClick();
            this.drawToolbar.activate(Draw.POINT);
            this.drawModeTextNode.innerText = this.i18n.labels.point;
        },
        drawCircle: function () {
            this.disconnectMapClick();
            this.drawToolbar.activate(Draw.CIRCLE);
            this.drawModeTextNode.innerText = this.i18n.labels.circle;
        },
        drawLine: function () {
            this.disconnectMapClick();
            this.drawToolbar.activate(Draw.POLYLINE);
            this.drawModeTextNode.innerText = this.i18n.labels.polyline;
        },
        drawFreehandLine: function () {
            this.disconnectMapClick();
            this.drawToolbar.activate(Draw.FREEHAND_POLYLINE);
            this.drawModeTextNode.innerText = this.i18n.labels.freehandPolyline;
        },
        drawPolygon: function () {
            this.disconnectMapClick();
            this.drawToolbar.activate(Draw.POLYGON);
            this.drawModeTextNode.innerText = this.i18n.labels.polygon;
        },
        drawFreehandPolygon: function () {
            this.disconnectMapClick();
            this.drawToolbar.activate(Draw.FREEHAND_POLYGON);
            this.drawModeTextNode.innerText = this.i18n.labels.freehandPolygon;
        },
        disconnectMapClick: function () {
            topic.publish('mapClickMode/setCurrent', 'draw');
            this.enableStopButtons();
            // dojo.disconnect(this.mapClickEventHandle);
            // this.mapClickEventHandle = null;
        },
        connectMapClick: function () {
            topic.publish('mapClickMode/setDefault');
            this.disableStopButtons();
            // if (this.mapClickEventHandle === null) {
            //     this.mapClickEventHandle = dojo.connect(this.map, 'onClick', this.mapClickEventListener);
            // }
        },
        onDrawToolbarDrawEnd: function (evt) {
            this.drawToolbar.deactivate();
            this.drawModeTextNode.innerText = this.i18n.labels.currentDrawModeNone;
            var graphic, geometry, query = new Query(), layerIds = this.map.layerIds,
				queryTask, layers = this.map.getLayersVisibleAtScale(), feature, i,
				j, h, features, bufferQuery, evtExtent;
            switch (evt.geometry.type) {
			case 'point':
				graphic = new Graphic(evt.geometry);
				geometry = new Point(evt.geometry);
				this.pointGraphics.add(graphic);
				break;
			case 'polyline':
				graphic = new Graphic(evt.geometry);
				geometry = new Polyline(evt.geometry);
				this.polylineGraphics.add(graphic);
				break;
			case 'polygon':
				graphic = new Graphic(evt.geometry, null, {
					ren: 1
				});
				this.polygonGraphics.add(graphic);
				evtExtent = evt.geometry.getExtent();
				var extractPoly = new Polygon({
					"rings": [[
						[evtExtent.xmin, evtExtent.ymin],
						[evtExtent.xmin, evtExtent.ymax],
						[evtExtent.xmax, evtExtent.ymax],
						[evtExtent.xmax, evtExtent.ymin],
						[evtExtent.xmin, evtExtent.ymin]
					]],
					"spatialReference": evt.geometry.spatialReference
				});
				var extract = registry.byId('extract_widget');
				extract.setExtent(extractPoly);
				geometry = new Polygon(evt.geometry);
				break;
			default:
            }
			query.outFields = ["*"];
			query.returnGeometry = true;
			query.outSpatialReference = this.map.spatialReference;
			/*not readily apparent: geometry.extent defines the BOUNDING BOX for a polygon,
			  NOT the bounds of the polygon itself (those are defined by 'rings' of points in
			  geometry.rings). so after we define the extent we must still check each point
			  but it's more efficient since we're just searching a subset of the data */
			query.geometry = geometry.getExtent();
			query.where = "1=1";
			/*only use active layers. the layer.visible property is not reliable until after
			 the layer has been enabled. suspended is reliable from the start. filtering based
			 on layer.url eliminates drawing layers, as they have no url */
			dojo.forEach(layers, function (layer) {
				if (layer.url && !layer.suspended){
					queryTask = new QueryTask(layer.url + "/0");
					queryTask.execute(query, function (results) {
						inBuffer = [];
						bufferQuery = new Query();
						features = results.features;
						for (i = 0; i < features.length; i += 1) {
							feature = features[i];
							if (GeometryEngine.contains(geometry, feature.geometry)) {
								inBuffer.push(feature.attributes);
							}
						}
						bufferQuery.objectIds = inBuffer;
						console.log(inBuffer);
						/*layer.selectFeatures(bufferQuery, FeatureLayer.SELECTION_NEW, function (results) {
							//now we have only the points in the polygon
							console.log(results);
						});*/
					});
				}
			});
            this.connectMapClick();
        },
        clearGraphics: function () {
            this.endDrawing();
            this.connectMapClick();
            this.drawModeTextNode.innerText = 'None';
        },
        stopDrawing: function () {
            this.drawToolbar.deactivate();
            this.drawModeTextNode.innerText = 'None';
            this.connectMapClick();
        },
        endDrawing: function () {
            this.pointGraphics.clear();
            this.polylineGraphics.clear();
            this.polygonGraphics.clear();
            this.drawToolbar.deactivate();
            this.disableStopButtons();
			var extract = registry.byId('extract_widget');
			extract.setExtent(null);
        },
        disableStopButtons: function () {
            this.stopDrawingButton.set('disabled', true);
            this.eraseDrawingButton.set('disabled', !this.noGraphics());
        },
        enableStopButtons: function () {
            this.stopDrawingButton.set('disabled', false);
            this.eraseDrawingButton.set('disabled', !this.noGraphics());
        },
        noGraphics: function () {

            if (this.pointGraphics.graphics.length > 0) {
                return true;
            } else if (this.polylineGraphics.graphics.length > 0) {
                return true;
            } else if (this.polygonGraphics.graphics.length > 0) {
                return true;
            }
            return false;

        },
        onLayoutChange: function (open) {
            // end drawing on close of title pane
            if (!open) {
                //this.endDrawing();
                if (this.mapClickMode === 'draw') {
                    topic.publish('mapClickMode/setDefault');
                }
            }
        },
        setMapClickMode: function (mode) {
            this.mapClickMode = mode;
        },
		loadDrawnGraphics: function (data) {
		//clear previous idraw graphics?
			var parts = data.id.split("_"), graphic;
			switch (parts[1]) {
			case 'point':
				graphic = new Graphic(data.geometry);
				this.pointGraphics.add(graphic);
				break;
			case 'polyline':
				graphic = new Graphic(data.geometry);
				this.polylineGraphics.add(graphic);
				break;
			case 'poly':
				//WHY do I have to create a polygon for this to work? 
				graphic = new Graphic(new Polygon(data.geometry), null, {
					ren: 1
				});
				this.polygonGraphics.add(graphic);
				break;
			default:
			}
			topic.publish('mapClickMode/setDefault');
		}
	});
});