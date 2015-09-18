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
			basemap: 'gray',
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
            minZoom: 5,
            maxZoom: 16,
            logo: false,
			sliderStyle: 'small'
		},
		panes: {
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
		 	bottom: {
		 		id: 'sidebarBottom',
		 		placeAt: 'outer',
		 		splitter: true,
		 		collapsible: true,
		 		region: 'bottom',
				open: true,
                style: 'height:200px;',
                content: '<div id="attributesContainer"></div>'
		 	}
		// 	top: {
		// 		id: 'sidebarTop',
		// 		placeAt: 'outer',
		// 		collapsible: true,
		// 		splitter: true,
		// 		region: 'top'
		// 	}
		},
		// collapseButtonsPane: 'center', //center or outer

		// operationalLayers: Array of Layers to load on top of the basemap: valid 'type' options: 'dynamic', 'tiled', 'feature'.
		// The 'options' object is passed as the layers options for constructor. Title will be used in the legend only. id's must be unique and have no spaces.
		// 3 'mode' options: MODE_SNAPSHOT = 0, MODE_ONDEMAND = 1, MODE_SELECTION = 2
		operationalLayers: [/*{
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_glb_basin_boundary_black/MapServer',
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
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_benscho_boundaries_darkgray/MapServer',
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
		},*/
		{
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_hydrology/MapServer',
			title: 'Hydrology',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'hydro',
				opacity: 1.0,
				visible: true,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Hydrology.'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_biological/MapServer',
			title: 'Biological',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'biological',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b>Biological layers. Includes GLANSIS Invasive species occurences, MTRI Submerged aquatic vegetation, and USGS Phragmites.',
				url: ''
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_geomorphology/MapServer',
			title: 'Geomorphology',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'geomorph',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> Geomorphology layers. Includes Depth (m), Shoreline sinuosity and classification, and substrate.'
			}
		}, /*{
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
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_tributary_influence_3classes/MapServer',
			title: 'Tributaries',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'tributaries',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> Tributary & Interfluve influence.',
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
		}, */{
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_landscape/MapServer',
			title: 'Landscape',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'landscape',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> 2000-2001 NLCD Solris Land Cover data, 2003 GLCWC coastal wetlands, 2011/2012 NCLD Solris land cover, USGS quaternary geologic atlas, USGS bedrock geology',
				url: ''
			}
		}, /*{
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/benscho_glahf_subbasins_purple/MapServer',
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
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/mi_boundaries/MapServer',
			title: 'Boundaries',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'boundaries',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Boundaries. Contains management units, Watersheds, Counties, and TRS.',
				url: ''
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/benscho_glahf_pour_points_green/MapServer',
			title: 'Watershed Pour Points',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'pourpoints',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Watershed Pour Points.'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_upwelling_2011/MapServer',
			title: 'Upwelling',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'upwelling',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF 2011 Upwelling.'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_spring_rate_warming_2011/MapServer',
			title: 'Spring Rate of Warming',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'warming',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF 2011 Spring Rate of Warming.'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_dss_le_walleye_hsi/MapServer',
			title: 'Walleye HSI',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'walleyehsi',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Walleye HSI.'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_dss_le_walleye_hsi_bathymetry/MapServer',
			title: 'Walleye Bathymetry',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'walleyebathy',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Walleye Bathymetry.'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_dss_le_walleye_hsi_secchi/MapServer',
			title: 'Walleye Secchi',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'walleyesecchi',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Walleye Secchi.'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgisdev.lsa.umich.edu/arcgis/rest/services/IFR/glahf_dss_le_walleye_hsi_temp/MapServer',
			title: 'Walleye Temperature',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'walleyetemp',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Walleye Temperature.'
			}
		}*/],
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
			/*identify: {
				include: true,
				id: 'identify',
				type: 'titlePane',
				path: 'gis/dijit/Identify',
				title: 'Identify',
				open: false,
				position: 3,
				options: 'config/identify'
			},*/
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
			/*legend: {
				include: true,
				id: 'legend',
				type: 'toolbarOption',
				path: 'esri/dijit/Legend',
				title: 'Legend',
				open: false,
				position: 1,
				options: {
					map: true,
					legendLayerInfos: true
				}
			},*/
			layerControl: {
				include: true,
				id: 'layerControl',
				type: 'toolbarOption',
				path: 'gis/dijit/LayerControl',
				title: '<i class="fa fa-bars fa-4x"></i><br/>Layers',
				srcNodeRef: 'layerToolbar',
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
			criteria: {
				include: true,
				id: 'criteria',
				type: 'toolbarOption',
				canFloat: true,
				path: 'gis/dijit/Criteria',
				title: '<i class="fa fa-check-square-o fa-4x"></i><br/>Habitat<br>Criteria',
				srcNodeRef: 'criteriaToolbar',
				open: false,
				position: 1,
				options: {
					map: true
				}
			},
			draw: {
				include: true,
				id: 'draw',
				type: 'toolbarOption',
				path: 'gis/dijit/Draw',
				title: '<i class="fa fa-pencil-square-o fa-4x"></i><br/>Draw',
				srcNodeRef: 'drawToolbar',
				open: false,
				position: 2,
				options: {
					map: true,
					mapClickMode: true
				}
			},
			/*search: {
				include: true,
				id: 'search',
				type: 'toolbarOption',
				path: 'gis/dijit/Search',
				title: '<i class="fa fa-search fa-4x"></i><br/>Search',
				srcNodeRef: 'searchToolbar',
				open: false,
				position: 3,
				options: {
					map: true
				}
			},*/
			search: {
                include: true,
                id: 'search',
                type: 'toolbarOption',
				 srcNodeRef: 'searchToolbar',
                canFloat: false,
                path: 'gis/dijit/Search',
                title: '<i class="fa fa-search fa-4x"></i><br/>Search',
                open: false,
                position: 3,
                options: 'config/search'
            },
            attributesTable: {
                include: true,
                id: 'attributesContainer',
                type: 'domNode',
                srcNodeRef: 'attributesContainer',
                path: 'gis/dijit/AttributesTable',
                options: {
                    map: true,
                    mapClickMode: true,
                    // use a tab container for multiple tables or
                    // show only a single table
                    useTabs: true,
                    // used to open the sidebar after a query has completed
                    sidebarID: 'sidebarBottom',
                    // optional tables to load when the widget is first instantiated
                    tables: []
                }
            },
			save: {
				include: true,
				id: 'save',
				type: 'toolbarOption',
				canFloat: true,
				path: 'gis/dijit/Save',
				title: '<i class="fa fa-floppy-o fa-4x"></i><br/>Save',
				srcNodeRef: 'saveToolbar',
				open: false,
				position: 4,
				options: {
					map: true
				}
			},
			/*table: {
                include: true,
                id: 'table',
                type: 'domNode',
                srcNodeRef: 'table',
                path: 'gis/dijit/Table',
                options: {
                    map: true,
                    mapClickMode: true,
                    // use a tab container for multiple tables or
                    // show only a single table
                    useTabs: true,
                    // used to open the sidebar after a query has completed
                    sidebarID: 'sidebarBottom',
                    // optional tables to load when the widget is first instantiated
                    tables: []
                }
            },*/
			print: {
				include: true,
				id: 'print',
				type: 'toolbarOption',
				canFloat: true,
				path: 'gis/dijit/Print',
				title: '<i class="fa fa-print fa-4x"></i><br/>Print',
				srcNodeRef: 'printToolbar',
				open: false,
				position: 5,
				options: {
					map: true,
					printTaskURL: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
					copyrightText: 'Copyright 2014',
					authorText: 'Me',
					defaultTitle: 'Viewer Map',
					defaultFormat: 'PDF',
					defaultLayout: 'Letter ANSI A Landscape'
				}
			},
			extract: {
				include: true,
				id: 'extract',
				type: 'toolbarOption',
				canFloat: true,
				path: 'gis/dijit/Extract',
				title: '<i class="fa fa-file fa-4x"></i><br/>Export',
				srcNodeRef: 'extractToolbar',
				open: false,
				position: 6,
				options: {
					map: true,
					extractTaskURL: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/ExtractData/GPServer/Extract%20Data%20Task',
					defaultFormat: 'Shapefile - SHP - .shp',
					defaultLayer: ' Incident Points'
				}
			},
			measure: {
				include: true,
				id: 'measurement',
				type: 'toolbarOption',
				canFloat: true,
				path: 'gis/dijit/Measurement',
				title: '<i class="fa fa-cog fa-4x"></i><br/>Measure',
				srcNodeRef: 'measureToolbar',
				open: false,
				position: 7,
				options: {
					map: true,
					mapClickMode: true,
					defaultAreaUnit: units.SQUARE_MILES,
					defaultLengthUnit: units.MILES
				}
			},
			/*suitability: {
				include: true,
				id: 'suitability',
				type: 'titlePane',
				canFloat: false,
				path: 'gis/dijit/Suitability',
				title: 'Habitat Suitability Maps',
				open: false,
				position: 12,
				options:{
					map: true
				}
			},*/
			help: {
				include: true,
				id: 'help',
				type: 'toolbarOption',
				path: 'gis/dijit/Help',
				title: '<i class="fa fa-info-circle fa-4x"></i><br/>Help',
				srcNodeRef: 'helpToolbar',
				open: false,
				position: 8,
				options: {}
			}
		}
	};
});