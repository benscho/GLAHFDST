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
				about: '<b>Summary:</b> Drainage area extent of the Great Lakes basin from the Great Lakes Hydrography Dataset.',
				//url: '',
				parent: 'Hydrology'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_hydrology_subbasins/MapServer',
			title: 'Lake sub-basins',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'subbasins',
				opacity: 1.0,
				visible: true,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> Within lake sub-basins manually delineated based on dominant spring and summer ' +
				'circulation patterns, bathymetric features, and characteristic biological communities.  Land extents include the ' +
				'watershed boundaries draining into a given lake sub-basin.',
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
				about: '<b>Summary:</b> Drainage area extent of each Great Lake from the Great Lakes Hydrography Dataset.',
				//url: '',
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
				about: '<b>Summary:</b> The outlet of the watershed where it meets the Great Lakes shoreline.',
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
				about: '<b>Summary:</b> Watershed delineations from the Great Lakes Hydrography Dataset.',
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
				about: '<b>Summary:</b> Invasive species documented locations from the Great Lakes Aquatic Nonindigenous Species Information System (GLANSIS).',
				url: 'http://glahf.org/explorer/metadata/invasive_species.html',
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
				about: '<b>Summary:</b> A basin-wide distribution map of Phragmites populations, as of 2010/2011, mapped by Michigan Tech Research Institute (MTRI) ' +
				'utilized remotely sensed imagery and in collaboration with the U.S. Geological Survey Great Lakes Science Center.',
				parent: 'Biological'
			}			
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_biological_sav_mtri/MapServer',
			title: 'SAV (MTRI)',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'mtrisav',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> This layer represents the extent of submerged aquatic vegetation (SAV)in the optically shallow areas (areas where there is ' +
				'a return of light from the bottom) of Lakes Erie, Huron, Michigan, and Ontario. The SAV is predominantly Cladophora with localized areas of vascular ' + 
				'plants, other filamentous macroalgae, and diatoms. Generated by the Michigan Tech Research Institute (MTRI).',
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
				about: '<b>Summary:</b> Depth in meters from NOAA National Centers for Environmental Information Great Lakes bathymetry.',
				url: 'http://glahf.org/explorer/metadata/depth.html',
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
				about: '<b>Summary:</b> This layer represents the highest level common shoreline classes from the U.S. Army Corps of Engineers '+
				'shoreline descriptions (2012) and Environment Canada Environmental Sensitivity Atlas (1990s).',
				url: 'http://glahf.org/explorer/metadata/shoreline_classification.html',
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
				about: '<b>Summary:</b> Sinuosity is the degree of shoreline meandering, and was calculated by dividing the high resolution ' +
				'shoreline layer by the 1800 m GLAHF spatial framework grid and calculating the length of the shoreline divided by the straight line distance.',
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
				about: '<b>Summary:</b> Substrate in the Great Lakes has been compiled from many data sources including published ' +
				'journal article and books, independent research projects collecting field data, and the U.S. Army Corps of Engineers ' + 
				'shoreline descriptions (2012), and the Environment Canada Environmental Sensitivity Atlas (1990s).',
				parent: 'Geomorphology'
			}			
		}, {
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
				about: '<b>Summary:</b> Circulation magnitude (m/s) summarized for spring 2006-2012 for the offshore. Model ' +
				'data from the Great Lakes Coastal Forecasting System, NOAA Great Lakes Environmental Research Laboratory.',
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
				about: '<b>Summary:</b> Upwelling occurs when strong surface winds push warm surface water away from the ' +
				'coastline, which is replaced by cold, nutrient rich water that wells up from deeper areas below. ' +
				'This variable was calculated following the methods described in Plattner et. al., 2006 and calculated' +
				'from NOAA Great Lakes CoastWatch daily mean surface water temperature.   Units are in days.',
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
				about: '<b>Summary:</b> Maximum spring wave height for the years 2006-2012 summarized from the U.S. ' +
				'Army Corps of Engineers Wave Information Studies modeled data.',
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
				about: '<b>Summary:</b> Mean spring wave height for the years 2006-2012 summarized from the U.S. ' +
				'Army Corps of Engineers Wave Information Studies modeled data.',
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
				about: '<b>Summary:</b> Cumulative degree-days (CDD) is the accumulation of temperature over a period of ' + 
				'time whenever the temperature is above a predetermined threshold.  In this case a base temperature of ' +
				'0⁰C was used to accumulate the mean daily temperature, in ⁰C, from January 1 through December 31 for each ' +
				'year from 2006 to 2012 for the mean daily surface water temperature (coastal margin zone) and the mean ' +
				'daily vertical water temperature for the 0 to 20m water column (nearshore and offshore zones).',
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
				about: '<b>Summary:</b> Ice duration was derived from ice cover data obtained from the Great Lakes Ice ' +
				'Atlas and NOAA Great Lakes Environmental Research Laboratory.  Ice cover data are available as a daily ' +
				'percent ice cover grid for the ice season (December 1 – May 31).  Using the threshold of 10%, ' +
				'the duration, in days, was tallied for each ice season.',
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
				about: '<b>Summary:</b> The mean spring surface water temperature (degrees C) was derived from ' +
				'NOAA’s Great Lakes CoastWatch Great Lakes Surface Environmental Surface (GLSEA) mean daily ' +
				'surface water temperature product for the years 2006-2012.',
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
				about: '<b>Summary:</b>  The mean summer surface water temperature (degrees C) was derived from ' +
				'NOAA’s Great Lakes CoastWatch Great Lakes Surface Environmental Surface (GLSEA) mean daily ' +
				'surface water temperature product for the years 2006-2012.',
				parent: 'Temperature Energy',
				slider: true,
				sliderUrl: './Summertemp.html'
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
				about: '<b>Summary:</b> Bedrock geology compiled from U.S. and Canadian data sources, harmonized into 10 common classes.',
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
				about: '<b>Summary:</b> The Great Lakes Coastal Wetland Inventory was developed through theGreat Lakes Coastal '+ 
				'Wetland Consortium (GLCWC) as a bi-national initiative to create a single, hydrogeomorphically classified inventory of all ' +
				'coastal wetlands of the Great Lakes Basin, latest release: July 2003.',
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
				about: '<b>Summary:</b> A mosaic of the U.S. NLCD 11 (2011 edition) and the Canadian 2000 SOLRIS v2.0. ' + 
				'These datasets were created from imagery collected in approximately the same time frames, included similar categories, ' +
				'and covered the full extent of the Great Lakes Basin.',
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
				about: '<b>Summary:</b> A mosaic of the U.S. NLCD 01 (2011 edition) and the Canadian 2000 PLO and the ' + 
				'SOLRIS v1.2. These datasets were created from imagery collected in approximately the same time frames,' +
				'included similar categories, and covered the full extent of the Great Lakes Basin.',
				parent: 'Landscape'
			}
		}, {
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
				about: '<b>Summary:</b> The quaternary geology layer was compiled from USGS and harmonized into 17 common classes.',
				parent: 'Landscape'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/le_walleye_glfc/MapServer',
			title: 'GLFC Walleye Suitable Habitat',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'walleyesuitablehabitat',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> This layer shows waters less than 13 m of depth, which is the definition of suitable' +
				'walleye habitat by the the Great Lakes Fishery Commission Standing Technical Committee (2007).',
				url: 'http://glahf.org/explorer/metadata/le_wae_hsi_glfc.html',
				parent: 'Walleye'
			}
		}, {
			type: 'dynamic',
			url: 'https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/le_walleye_hsi_model_boundary/MapServer',
			title: 'Walleye HSI Model Boundary',
			noLegend: false,
			collapsed: true,
			options: {
				id: 'walleyehsiboundary',
				opacity: 1.0,
				visible: false,
				imageParameters: imageParameters
			},
			layerControlLayerInfos: {
				about: '<b>Summary:</b> The walleye habitat suitability index (HSI) boundary for the model published in Pandit et al. (2013) for Lake Erie.',
				url: 'http://glahf.org/explorer/metadata/le_wae_hsi_model_boundary.html',
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
				about: '<b>Summary:</b> Juvenile walleye habitat suitability index (HSI) for the bottom of Lake Erie ' +
				'for summer 2006-2010. Based on the Pandit et al. (2013) linear regression interaction model.',
				url: 'http://glahf.org/explorer/metadata/le_wae_hsi.html',
				parent: 'Walleye'
			}
		}, {
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
				about: '<b>Summary:</b> Juvenile walleye habitat suitability index (HSI) for the surface layer of ' +
				'Lake Erie for summer 2006-2010. Based on the Pandit et al. (2013) linear regression interaction model.',
				url: 'http://glahf.org/explorer/metadata/le_wae_hsi.html',
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
				about: '<b>Summary:</b> Adult walleye habitat suitability index (HSI) for the surface layer of Lake '+
				'Erie for summer 2006-2010. Based on the Pandit et al. (2013) linear regression interaction model.',
				url: 'http://glahf.org/explorer/metadata/le_wae_hsi.html',
				parent: 'Walleye'
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
				about: '<b>Summary:</b> Adult walleye habitat suitability index (HSI) for the bottom of Lake Erie ' +
				'for summer 2006-2010. Based on the Pandit et al. (2013) linear regression interaction model.',
				url: 'http://glahf.org/explorer/metadata/le_wae_hsi.html',
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
				about: '<b>Summary:</b> All walleye habitat suitability index (HSI) for the surface of Lake' +
				'Erie for summer 2006-2010. Based on the Pandit et al. (2013) linear regression interaction model.',
				url: 'http://glahf.org/explorer/metadata/le_wae_hsi.html',
				parent: 'Walleye'
			}
		}, {
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
				about: '<b>Summary:</b> All walleye habitat suitability index (HSI) for the bottom of Lake' + 
				'Erie for summer 2006-2010. Based on the Pandit et al. (2013) linear regression interaction model.',
				url: 'http://glahf.org/explorer/metadata/le_wae_hsi.html',
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
						xmin: -10625145,
						ymin: 5020496,
						xmax: -8549069,
						ymax: 6063298,
						spatialReference: {
							wkid: 102100
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
			/*help: {
				include: true,
				id: 'help',
				type: 'toolbarOption',
				path: 'gis/dijit/Help',
				title: '<i class="fa fa-question-circle fa-4x"></i><br/>Help',
				srcNodeRef: 'helpToolbar',
				open: false,
				position: 9,
				options: {}
			}*/
			help: {
				include: true,
				id: 'help',
				type: 'floating',
				path: 'gis/dijit/Help',
				title: 'GLAHF Explorer Help Menu',
				options: {
					draggable: true
					//openOnStartup: true
				}
			}
		}
	};
});