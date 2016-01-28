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
		operationalLayers: [{
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_hydrology_gl_basin_boundary/MapServer',
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
				url: '',
				parent: 'Hydrology'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_hydrology_subbasins/MapServer',
			title: 'Sub-basins',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'subbasins',
				opacity: 1.0,
				visible: true,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Watershed Sub-basins.',
				parent: 'Hydrology'
			}			
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_hydrology_lake_basin_boundaries/MapServer',
			title: 'Lake Basin Boundaries',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'lakebasin',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF GLB Basins.',
				url: '',
				parent: 'Hydrology'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_hydrology_pourpoints/MapServer',
			title: 'Pour Points',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'pourpoints',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Watershed Pour Points.',
				parent: 'Hydrology'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_hydrology_watersheds/MapServer',
			title: 'Watersheds',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'watersheds',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Watersheds.',
				parent: 'Hydrology'
			}			
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_biological_glansis/MapServer',
			title: 'Invasive Species',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'glansis',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLANSIS Invasive Species occurences.',
				parent: 'Biological'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_biological_phragmites_usgs/MapServer',
			title: 'Phragmites',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'phragmites',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Phragmites.',
				parent: 'Biological'
			}			
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_biological_sav_mtri/MapServer',
			title: 'MTRI SAV',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'mtrisav',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> MTRI Submerged Aquatic Vegetation.',
				parent: 'Biological'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_geomorphology_depth/MapServer',
			title: 'Depth',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'depth',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Depth.',
				parent: 'Geomorphology',
				slider: true,
				sliderUrl: './Bathymetry.html'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_geomorphology_shoreline_classification/MapServer',
			title: 'Shoreline Classification',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'shorelineclass',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Shoreline Classification.',
				parent: 'Geomorphology'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_geomorphology_shoreline_sinuosity/MapServer',
			title: 'Shoreline Sinuosity',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'shorelinesinu',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Shoreline Sinuosity.',
				parent: 'Geomorphology'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_geomorphology_substrate/MapServer',
			title: 'Substrate',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'substrate',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Substrate.',
				parent: 'Geomorphology'
			}			
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_landscape_bedrock_geology/MapServer',
			title: 'Bedrock Geology',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'bedrockgeo',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Bedrock Geology.',
				parent: 'Landscape'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_landscape_coastal_wetlands/MapServer',
			title: 'Coastal Wetlands',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'coastalwetlands',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Coastal Wetlands.',
				parent: 'Landscape'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_landscape_landcover_2011_2012/MapServer',
			title: 'Landcover (2010-2011)',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'landcover2010',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Landcover for 2010-2011.',
				parent: 'Landscape'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_landscape_landcover_2000_2001/MapServer',
			title: 'Landcover (2000-2001)',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'landcover2000',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Landcover for 2000-2001.',
				parent: 'Landscape'
			}
		},/* {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_landscape_quaternary_geology/MapServer',
			title: 'Quarternary Geology',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'quartgeo',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Quarternary Geology.',
				parent: 'Landscape'
			}
		},*/ {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_mechanical_energy_circulation_magnitude_spring_mean/MapServer',
			title: 'Circulation Mag. (Spring)',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'circmax',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Mean Circulation Magnitude for Spring.',
				parent: 'Mechanical Energy'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_mechanical_energy_upwelling/MapServer',
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
				about: '<b>Summary:</b> GLAHF Upwelling.',
				parent: 'Mechanical Energy'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_mechanical_energy_wave_height_spring_max/MapServer',
			title: 'Wave Height (Max)',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'wavemax',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Maximum Wave Height (Spring).',
				parent: 'Mechanical Energy'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_mechanical_energy_wave_height_spring_mean/MapServer',
			title: 'Wave Height (Mean)',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'wavemean',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Mean Wave Height (Spring).',
				parent: 'Mechanical Energy'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_temperature_energy_cdd/MapServer',
			title: 'Cumulative Degree Days',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'cdd',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Cumulative Degree Days.',
				parent: 'Temperature Energy'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_temperature_energy_ice_duration/MapServer',
			title: 'Ice Duration',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'iceduration',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Ice Duration.',
				parent: 'Temperature Energy'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_temperature_energy_surface_temp_spring/MapServer',
			title: 'Spring Temperature',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'surfacetempspring',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Spring Surface Temperature.',
				parent: 'Temperature Energy',
				slider: true,
				sliderUrl: './Springtemp.html'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_temperature_energy_surface_temp_summer/MapServer',
			title: 'Summer Temperature',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'surfacetempsummer',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Summer Surface Temperature.',
				parent: 'Temperature Energy',
				slider: true,
				sliderUrl: './Summertemp.html'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/le_walleye_hsi_adult_bottom/MapServer',
			title: 'Adult Walleye HSI (bottom)',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'walleyehsiadultbottom',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Adult Walleye HSI for the lake bottom.',
				parent: 'Walleye'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/le_walleye_hsi_adult_surface/MapServer',
			title: 'Adult Walleye HSI (surface)',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'walleyehsiadultsurface',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Adult Walleye HSI for the lake surface.',
				parent: 'Walleye'
			}
		},/* {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/le_walleye_hsi_all_bottom/MapServer',
			title: 'Walleye HSI (bottom)',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'walleyehsioverallbottom',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Overall Walleye HSI for the lake bottom.',
				parent: 'Walleye'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/le_walleye_hsi_all_surface/MapServer',
			title: 'Walleye HSI (surface)',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'walleyehsioverallsurface',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Overall Walleye HSI for the lake surface.',
				parent: 'Walleye'
			}
		},*/ {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/le_walleye_hsi_juvenile_bottom/MapServer',
			title: 'Juvenile Walleye HSI (bottom)',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'walleyehsijuvenilebottom',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Juvenile Walleye HSI for the lake bottom.',
				parent: 'Walleye'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/le_walleye_hsi_juvenile_surface/MapServer',
			title: 'Juvenile Walleye HSI (surface)',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'walleyehsijuvenilesurface',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> GLAHF Juvenile Walleye HSI for the lake surface.',
				parent: 'Walleye'
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
				title: '<i class="fa fa-list fa-4x"></i><br/>Layers',
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
			search: {
				include: true,
				id: 'search',
				type: 'toolbarOption',
				srcNodeRef: 'searchToolbar',
				canFloat: false,
				path: 'gis/dijit/Search',
				title: '<i class="fa fa-search fa-4x"></i><br/>Query',
				open: false,
				position: 3,
				options: {
					map: true
				}
			},
			identify: {
				include: true,
				id: 'identify',
				type: 'toolbarOption',
				path: 'gis/dijit/Identify',
				title: '<i class="fa fa-info fa-4x"></i><br/>Identify',
				srcNodeRef: 'identifyToolbar',
				open: false,
				position: 3,
				options: 'config/identify'
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
			/*extract: {
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
			},*/
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
			locate: {
				include: true,
				id: 'locate',
				type: 'toolbarOption',
				canFloat: true,
				path: 'gis/dijit/Locate',
				title: '<i class="fa fa-location-arrow fa-4x"></i><br/>Locate',
				srcNodeRef: 'locateToolbar',
				open: false,
				position: 8,
				options: {
					map: true
				}
			},
			help: {
				include: true,
				id: 'help',
				type: 'toolbarOption',
				path: 'gis/dijit/Help',
				title: '<i class="fa fa-question-circle fa-4x"></i><br/>Help',
				srcNodeRef: 'helpToolbar',
				open: false,
				position: 9,
				options: {}
			}
		}
	};
});