define({
	map: true,
	mapClickMode: true,
	mapRightClickMenu: true,
	identifyLayerInfos: true,
	identifyTolerance: 5,

	// config object definition:
	//	{<layer id>:{
	//		<sub layer number>:{
	//			<pop-up definition, see link below>
	//			}
	//		},
	//	<layer id>:{
	//		<sub layer number>:{
	//			<pop-up definition, see link below>
	//			}
	//		}
	//	}

	// for details on pop-up definition see: https://developers.arcgis.com/javascript/jshelp/intro_popuptemplate.html

	identifies: {
		dnroffices: {
			0: {
				title: 'DNR Fisheries Offices',
				fieldInfos: [{
					fieldName: 'Name',
					label: 'Name',
					visible: true
				}, {
					fieldName: 'Type',
					label: 'Type',
					visible: true
				}, {
					fieldName: 'Phone',
					label: 'Phone',
					visible: true
				}, {
					fieldName: 'Address',
					label: 'Address',
					visible: true
				}]
			}
		},
		lakemap: {
			0: {
				title: 'Lake Maps - Deep point',
				fieldInfos: [{
					fieldName: 'Lake_Name',
					label: 'Lake Name',
					visible: true
				}, {
					fieldName: 'New_Key',
					label: 'New Key ID',
					visible: true
				}, {
					fieldName: 'Max_Depth',
					label: 'Max Depth (feet)',
					visible: true
				}, {
					fieldName: 'County',
					label: 'County',
					visible: true
				}, {
					fieldName: 'TRS',
					label: 'Town Range Section (TRS)',
					visible: true
				}, {
					fieldName: 'Latitude',
					label: 'Latitude',
					visible: true
				}, {
					fieldName: 'Longitude',
					label: 'Longitude',
					visible: true
				}]
			},
            1: {
				title: 'Lake Maps - Fetch',
				fieldInfos: [{
					fieldName: 'Name',
					label: 'Lake Name',
					visible: true
				}, {
					fieldName: 'IHDLKID',
					label: 'IFRHD Lake ID',
					visible: true
				}, {
					fieldName: 'Length',
					label: 'Length (km)',
					visible: true
				}, {
					fieldName: 'Shape_Leng',
					label: 'Length (m)',
					visible: true
				}, {
					fieldName: 'Azimuth',
					label: 'Azimuth',
					visible: true
				}, {
					fieldName: 'R_Azimuth',
					label: 'Back Azimuth',
					visible: true
				}, {
					fieldName: 'Y1',
					label: 'Start Point Latitude',
					visible: true
				}, {
					fieldName: 'X1',
					label: 'Start Point Longitude',
					visible: true
				}, {
					fieldName: 'Y2',
					label: 'End Point Latitude',
					visible: true
				}, {
					fieldName: 'X2',
					label: 'End Point Longitude',
					visible: true
				}]
		     },
            2: {
				title: 'Lake Maps - Contours',
				fieldInfos: [{
					fieldName: 'Name',
					label: 'Lake Name',
					visible: true
				}, {
					fieldName: 'New_Key',
					label: 'New Key Lake ID',
					visible: true
				}, {
					fieldName: 'Min_Depth',
					label: 'Min Depth (feet)',
					visible: true
				}, {
					fieldName: 'Max_Depth',
					label: 'Max Depth (feet)',
					visible: true
				}, {
					fieldName: 'Length',
					label: 'Length (meter)',
					visible: true
				}]
		     }
        },
        lakestabdata: {
			0: {
				title: 'Lake Tabular Data (<a href= http://ifr.snre.umich.edu/php/lake.php?id={IHDID} style="text-decoration:none" target="_blank"> <i class="icon-bar-chart"></i> Lake Report </a>)',
				fieldInfos: [{
					fieldName: 'Comb_Name',
					label: 'Lake Name',
					visible: true
				}, {
					fieldName: 'ACRES_IHD',
					label: 'Lake Area (acres)',
					visible: true
				}, {
					fieldName: 'SDI',
					label: 'Shoreline Development Index',
					visible: true
				}, {
					fieldName: 'FMU',
					label: 'Fisheries Management Unit (FMU)',
					visible: true
				}, {
					fieldName: 'Lat_Cent',
					label: 'Centroid Latitude',
					visible: true
				}, {
					fieldName: 'Long_Cent',
					label: 'Centroid Longitude',
					visible: true
				}, {
					fieldName: 'NAMELSAD',
					label: 'County',
					visible: true
				}, {
					fieldName: 'TWNRNGSEC',
					label: 'Town Range Section (TRS)',
					visible: true
				}, {
					fieldName: 'CONNECTIVI',
					label: 'Connectivity Type',
					visible: true
				}]
			}
        },
        coldwaterlakes: {
			0: {
				title: 'Cold Water Lakes',
				fieldInfos: [{
					fieldName: 'IHDLKID',
					label: 'IHDLKID',
					visible: true
				}, {
					fieldName: 'GNIS_Name',
					label: 'Name',
					visible: true
				}, {
					fieldName: 'MU',
					label: 'Management Unit',
					visible: true
				}]
			}
		},
		streamtab: {
			0: {
				title: 'Stream Tabular Data (<a href= http://ifr.snre.umich.edu/php/stream.php?id={IHDARCID} style="text-decoration:none" target="_blank"> <i class="icon-bar-chart"></i>   Stream Report</a> )',
				fieldInfos: [{
					fieldName: 'IHDARCID',
					label: 'IHDARCID',
					visible: true
				}, {
					fieldName: 'Comb_Name',
					label: 'Stream Name',
					visible: true
				}, {
					fieldName: 'Strahler',
					label: 'Strahler',
					visible: true
				}, {
					fieldName: 'Gradient',
					label: 'Gradient',
					visible: true
				}, {
					fieldName: 'FMU',
					label: 'Fisheries Management Unit (FMU)',
					visible: true
				}, {
					fieldName: 'Len_Miles',
					label: 'Length (miles)',
					visible: true
				}, {
					fieldName: 'Lat',
					label: 'Centroid Latitude',
					visible: true
				}, {
					fieldName: 'Long',
					label: 'Centroid Longitude',
					visible: true
				}, {
					fieldName: 'HUC8_num',
					label: 'HUC8 Watershed Code',
					visible: true
				}, {
					fieldName: 'HUC8',
					label: 'HUC8 Watershed Name',
					visible: true
				}]
			}
        },
		troutstreamreg: {
			0: {
				title: 'Trout Stream Regulation',
				fieldInfos: [{
					fieldName: 'GNIS_Mod',
					label: 'Stream Name',
					visible: true
				}, {
					fieldName: 'Reg_Type',
					label: 'Regulation Type',
					visible: true
				}, {
					fieldName: 'Designated',
					label: 'Designated Trout Stream (0:No; 1:Yes)',
					visible: true
				}]
			}
        },
		troutlakereg: {
			0: {
				title: 'Trout Lake Regulation',
				fieldInfos: [{
					fieldName: 'GNIS_Name',
					label: 'Lake Name',
					visible: true
				}, {
					fieldName: 'AreaSqKm',
					label: 'Area (square miles)',
					visible: true
				}, {
					fieldName: 'Type',
					label: 'Regulation Type',
					visible: true
				}]
			}
        },
		vsec: {
			0: {
				title: 'Stream Classification (100K)',
				fieldInfos: [{
					fieldName: 'GNIS_Name',
					label: 'Lake Name',
					visible: true
				}, {
					fieldName: 'STREAMTYPE',
					label: 'Stream Type',
					visible: true
				}, {
					fieldName: 'SIZE',
					label: 'Size',
					visible: true
				}, {
					fieldName: 'MGMT_UNIT',
					label: 'Management Unit',
					visible: true
				}, {
					fieldName: 'HUC',
					label: 'HUC8 Watershed Code',
					visible: true
				}, {
					fieldName: 'HUC_BASIN',
					label: 'HUC8 Watershed Name',
					visible: true
				}, {
					fieldName: 'Len_Miles',
					label: 'Length (miles)',
					visible: true
				}, {
					fieldName: 'AREA_MI2',
					label: 'Catchment Area (square miles)',
					visible: true
				}]
			}
        },
		
		sgcn: {
			0: {
				title: 'Fish Species of the Greatest Conservation Need (SGCN)',
				fieldInfos: [{
					fieldName: 'TAXON',
					label: 'Scientific Name',
					visible: true
				}, {
					fieldName: 'COMMON_NM',
					label: 'Common Name',
					visible: true
				}, {
					fieldName: 'LOC_ID',
					label: 'Location ID',
					visible: true
				}, {
					fieldName: 'WATER',
					label: 'Water Type (stm: Stream; inlk: Inland Lake)',
					visible: true
				}, {
					fieldName: 'YEAR',
					label: 'Year',
					visible: true
				}, {
					fieldName: 'TRS',
					label: 'Town Range Section',
					visible: true
				}, {
					fieldName: 'Y',
					label: 'Latitude',
					visible: true
				}, {
					fieldName: 'X',
					label: 'Longitude',
					visible: true
				}]
			}
        },
		boundary: {
			0: {
				title: 'Management Unit',
				fieldInfos: [{
					fieldName: 'Mgmt_Unit',
					label: 'Management Unit',
					visible: true
				}, {
					fieldName: 'FMU',
					label: 'Management Unit Initials',
					visible: true
				}]
			},
			1: {
				title: 'Watershed',
				fieldInfos: [{
					fieldName: 'HUC_8n',
					label: 'HUC8 Code',
					visible: true
				}, {
					fieldName: 'HUC8',
					label: 'HUC8 Basin Name',
					visible: true
				}]
			},
			2: {
				title: 'County',
				fieldInfos: [{
					fieldName: 'NAME',
					label: 'Name',
					visible: true
				}]
			},
			3: {
				title: 'County',
				fieldInfos: [{
					fieldName: 'TOWN',
					label: 'Town',
					visible: true
				},{
					fieldName: 'RANGE',
					label: 'Range',
					visible: true
				},{
					fieldName: 'SECTION',
					label: 'Section',
					visible: true
				},{
					fieldName: 'TWNRNGSEC',
					label: 'Town Range Section',
					visible: true
				}]
			}
        }
        
        
		
		
	}
});