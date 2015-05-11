define([
	'esri/units',
	'esri/geometry/Extent',
	'esri/config',
	'esri/tasks/GeometryService',
	'esri/layers/ImageParameters'
], function (units, Extent, esriConfig, GeometryService, ImageParameters) {

	// url to your proxy page, must be on same machine hosting you app. See proxy folder for readme.
	esriConfig.defaults.io.proxyUrl = 'proxy/proxy.ashx';
	esriConfig.defaults.io.alwaysUseProxy = false;
	// url to your geometry server.
	esriConfig.defaults.geometryService = new GeometryService('https://arcgis.lsa.umich.edu/arcgis/rest/services/Utilities/Geometry/GeometryServer');

	//image parameters for dynamic services, set to png32 for higher quality exports.
	var imageParameters = new ImageParameters();
	imageParameters.format = 'png32';

	return {
		// used for debugging your app
		isDebug: false,

		//default mapClick mode, mapClickMode lets widgets know what mode the map is in to avoid multipult map click actions from taking place (ie identify while drawing).
		defaultMapClickMode: 'identify',
		// map options, passed to map constructor. see: https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1
		mapOptions: {
			basemap: 'satellite',
			extent: new Extent({
				xmin: -10625145,
				ymin: 5020496,
				xmax: -8549069,
				ymax: 6063298,
				spatialReference: {
					wkid: 102100
				}
			}),
			zoom: 7,
            minZoom: 7,
            maxZoom: 16,
            logo: false,
			sliderStyle: 'small'
		},
		// panes: {
		// 	left: {
		// 		splitter: true
		// 	},
		// 	right: {
		// 		id: 'sidebarRight',
		// 		placeAt: 'outer',
		// 		region: 'right',
		// 		splitter: true,
		// 		collapsible: true
		// 	},
		// 	bottom: {
		// 		id: 'sidebarBottom',
		// 		placeAt: 'outer',
		// 		splitter: true,
		// 		collapsible: true,
		// 		region: 'bottom'
		// 	},
		// 	top: {
		// 		id: 'sidebarTop',
		// 		placeAt: 'outer',
		// 		collapsible: true,
		// 		splitter: true,
		// 		region: 'top'
		// 	}
		// },
		// collapseButtonsPane: 'center', //center or outer

		// operationalLayers: Array of Layers to load on top of the basemap: valid 'type' options: 'dynamic', 'tiled', 'feature'.
		// The 'options' object is passed as the layers options for constructor. Title will be used in the legend only. id's must be unique and have no spaces.
		// 3 'mode' options: MODE_SNAPSHOT = 0, MODE_ONDEMAND = 1, MODE_SELECTION = 2
/*		operationalLayers: [{
			type: 'feature',
			url: 'http://services1.arcgis.com/g2TonOxuRkIqSOFx/arcgis/rest/services/MeetUpHomeTowns/FeatureServer/0',
			title: 'STLJS Meetup Home Towns',
			options: {
				id: 'meetupHometowns',
				opacity: 1.0,
				visible: true,
				outFields: ['*'],
				mode: 0
			},
			editorLayerInfos: {
				disableGeometryUpdate: false
			}
		}, {
			type: 'feature',
			url: 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/SanFrancisco/311Incidents/FeatureServer/0',
			title: 'San Francisco 311 Incidents',
			options: {
				id: 'sf311Incidents',
				opacity: 1.0,
				visible: true,
				outFields: ['req_type', 'req_date', 'req_time', 'address', 'district'],
				mode: 0
			}
		}, {
			type: 'dynamic',
			url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyOperationalLayers/MapServer',
			title: 'Louisville Public Safety',
			options: {
				id: 'louisvillePubSafety',
				opacity: 1.0,
				visible: true,
				imageParameters: imageParameters
			},
			identifyLayerInfos: {
				layerIds: [2, 4, 5, 8, 12, 21]
			}
		}, {
			type: 'dynamic',
			url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/DamageAssessment/MapServer',
			title: 'Damage Assessment',
			options: {
				id: 'DamageAssessment',
				opacity: 1.0,
				visible: true,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				swipe: true,
				metadataUrl: true,
				expanded: true
			}
		}],*/
		operationalLayers: [{
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_aquatic_invasive_species_glansis/MapServer',
			title: 'Aquatic Invasive Species',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'aquaticinvasivespecies',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b>Aquatic Invasive Species GLANSIS.',
				url: 'http://www.eregulations.com/michigan/fishing/great-lakes-trout-salmon-regulations/'
			}
		},{
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_bathymetry_noaa/MapServer',
			title: 'Bathymetry',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'bathymetry',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> NOAA Bathymetry.',
				url: 'http://www.eregulations.com/michigan/fishing/great-lakes-trout-salmon-regulations/'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_diporeia_2010_glinpo/MapServer',
			title: 'Diporeia',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'diporeia',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> 2010 GLINPO Diporeia.',
				url: ''
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_glb_boundaries/MapServer',
			title: 'Lake Basin Boundaries',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'lakebasin',
				opacity: 1.0,
				visible: true,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF GLB Basins.',
				url: ''
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_glb_boundary/MapServer',
			title: 'Great Lakes Basin',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'greatlakebasin',
				opacity: 1.0,
				visible: true,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF GLB Great Lakes Basin Extent.',
				url: ''
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_land_cover_2000_2001_nlcd_solris_plo/MapServer',
			title: 'Land Cover',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'landcover',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> 2000-2001 NLCD Solris Land Cover data.',
				url: ''
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_subbasins/MapServer',
			title: 'Sub-Basins',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'subbasins',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Sub-basins.'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_substrate/MapServer',
			title: 'Substrate',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'sgcn',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Substrate data.',
				url: 'http://www.michigan.gov/dnr/1,1607,7-153-10371_14793-30538--,00.html'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_watershed_boundaries/MapServer',
			title: 'Watershed Boundaries',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'watershedbound',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Watershed Boundaries',
				url: ''
			}
		},{
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_watershed_pour_points/MapServer',
			title: 'Watershed Pour Points',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'boundary',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Watershed Pour Points.'
			}
		}],
		// set include:true to load. For titlePane type set position the the desired order in the sidebar
		widgets: {
			growler: {
				include: true,
				id: 'growler',
				type: 'domNode',
				path: 'gis/dijit/Growler',
				srcNodeRef: 'growlerDijit',
				options: {}
			},
			geocoder: {
				include: true,
				id: 'geocoder',
				type: 'domNode',
				path: 'gis/dijit/Geocoder',
				srcNodeRef: 'geocodeDijit',
				options: {
					map: true,
					mapRightClickMenu: true,
					geocoderOptions: {
						autoComplete: true,
						arcgisGeocoder: {
							placeholder: 'Enter an address or place'
						}
					}
				}
			},
			identify: {
				include: true,
				id: 'identify',
				type: 'titlePane',
				path: 'gis/dijit/Identify',
				title: 'Identify',
				open: false,
				position: 3,
				options: 'config/identify'
			},
			basemaps: {
				include: true,
				id: 'basemaps',
				type: 'domNode',
				path: 'gis/dijit/Basemaps',
				srcNodeRef: 'basemapsDijit',
				options: 'config/basemaps'
			},
			mapInfo: {
				include: false,
				id: 'mapInfo',
				type: 'domNode',
				path: 'gis/dijit/MapInfo',
				srcNodeRef: 'mapInfoDijit',
				options: {
					map: true,
					mode: 'dms',
					firstCoord: 'y',
					unitScale: 3,
					showScale: true,
					xLabel: '',
					yLabel: '',
					minWidth: 286
				}
			},
			scalebar: {
				include: true,
				id: 'scalebar',
				type: 'map',
				path: 'esri/dijit/Scalebar',
				options: {
					map: true,
					attachTo: 'bottom-left',
					scalebarStyle: 'line',
					scalebarUnit: 'dual'
				}
			},
			locateButton: {
				include: true,
				id: 'locateButton',
				type: 'domNode',
				path: 'gis/dijit/LocateButton',
				srcNodeRef: 'locateButton',
				options: {
					map: true,
					publishGPSPosition: true,
					highlightLocation: true,
					useTracking: true,
					geolocationOptions: {
						maximumAge: 0,
						timeout: 15000,
						enableHighAccuracy: true
					}
				}
			},
			overviewMap: {
				include: true,
				id: 'overviewMap',
				type: 'map',
				path: 'esri/dijit/OverviewMap',
				options: {
					map: true,
					attachTo: 'bottom-right',
					color: '#0000CC',
					height: 100,
					width: 125,
					opacity: 0.30,
					visible: false
				}
			},
			homeButton: {
				include: true,
				id: 'homeButton',
				type: 'domNode',
				path: 'esri/dijit/HomeButton',
				srcNodeRef: 'homeButton',
				options: {
					map: true,
					extent: new Extent({
						xmin: -180,
						ymin: -85,
						xmax: 180,
						ymax: 85,
						spatialReference: {
							wkid: 4326
						}
					})
				}
			},
			legend: {
				include: true,
				id: 'legend',
				type: 'titlePane',
				path: 'esri/dijit/Legend',
				title: 'Legend',
				open: false,
				position: 1,
				options: {
					map: true,
					legendLayerInfos: true
				}
			},
			layerControl: {
				include: true,
				id: 'layerControl',
				type: 'titlePane',
				path: 'gis/dijit/LayerControl',
				title: 'Layers',
				open: false,
				position: 0,
				options: {
					map: true,
					layerControlLayerInfos: true,
					separated: true,
					vectorReorder: true,
					overlayReorder: true
				}
			},
			bookmarks: {
				include: true,
				id: 'bookmarks',
				type: 'titlePane',
				path: 'gis/dijit/Bookmarks',
				title: 'Bookmarks',
				open: false,
				position: 2,
				options: 'config/bookmarks'
			},
			find: {
				include: true,
				id: 'find',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/Find',
				title: 'Find',
				open: false,
				position: 3,
				options: 'config/find'
			},
			draw: {
				include: true,
				id: 'draw',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/Draw',
				title: 'Draw',
				open: false,
				position: 4,
				options: {
					map: true,
					mapClickMode: true
				}
			},
			interactiveDraw: {
				include: true,
				id: 'idraw',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/InteractiveDraw',
				title: 'Interactive Draw',
				open: false,
				position: 5,
				options: {
					map: true,
					mapClickMode: true
				}
			},
			/*measure: {
				include: true,
				id: 'measurement',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/Measurement',
				title: 'Measurement',
				open: false,
				position: 6,
				options: {
					map: true,
					mapClickMode: true,
					defaultAreaUnit: units.SQUARE_MILES,
					defaultLengthUnit: units.MILES
				}
			},
			print: {
				include: true,
				id: 'print',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/Print',
				title: 'Print',
				open: false,
				position: 7,
				options: {
					map: true,
					printTaskURL: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
					copyrightText: 'Copyright 2014',
					authorText: 'Me',
					defaultTitle: 'Viewer Map',
					defaultFormat: 'PDF',
					defaultLayout: 'Letter ANSI A Landscape'
				}
			},*/
			criteria: {
				include: true,
				id: 'criteria',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/Criteria',
				title: 'Define Criteria',
				open: false,
				position: 9,
				options: {
					map: true
				}
			},
			extract: {
				include: true,
				id: 'extract',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/Extract',
				title: 'Export',
				open: false,
				position: 10,
				options: {
					map: true,
					extractTaskURL: 'http://sampleserver4.arcgisonline.com/ArcGIS/rest/services/HomelandSecurity/Incident_Data_Extraction/MapServer',
					defaultFormat: 'Shapefile - SHP - .shp',
					defaultLayer: ' Incident Points'
				}
			},
			save: {
				include: true,
				id: 'save',
				type: 'titlePane',
				canFloat: true,
				path: 'gis/dijit/Save',
				title: 'Save',
				open: false,
				position: 11,
				options: {
					map: true
				}
			},
			toolbar: {
				include: true, // false will not load widget
				id: 'toolbar',
				type: 'contentPane', // can be contentPane
				canFloat: false, // if contentPane, use false
				path: 'gis/dijit/Toolbar',
				title: 'Toolbar', // title will appear if type: titlePane
				open: false, // option only applies if type: titlePane
				position: 12, // use your position value as needed
				placeAt: 'top', // right or left if type: titlePane, can use top or bottom if type: contentPane
				options: { // map and mapClickMode are required to use the widget
					map: true, // required
					mapClickMode: true, // required
					mapRightClickMenu: true // optional, can use right click context tools
				}
			},
			help: {
				include: true,
				id: 'help',
				type: 'floating',
				path: 'gis/dijit/Help',
				title: 'Help',
				options: {}
			}

		}
	};
});