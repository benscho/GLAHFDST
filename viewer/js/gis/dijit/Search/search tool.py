#tool to generate search queries
import arcpy, json, time, urllib, urllib2

def createPolygons(layer):
	polygons = []
	array = arcpy.Array()
	point = arcpy.Point()
	for polygon in layer["features"]:
		for ring in polygon["geometry"]["rings"]:
			for coordPair in ring:
				point.X = coordPair[0]
				point.Y = coordPair[1]
				array.add(point)
			polygons.append(arcpy.Geometry("polygon", array))
			array.removeAll()
	return polygons

def getQueryUrl(layer):
	urlVars = { 'where' : '1=1', 'returnGeometry' : 'true', 'f' : 'json'}
	args = ['where', 'returnGeometry', 'f']
	queryString = "&".join([item + "=" + urllib.quote_plus(urlVars[item]) for item in args])
	return layer + "/query?" + queryString

#read in user input
results = []
rows = {}
label = raw_input("What is the name of this query?") #Test Query
baseURL = raw_input("What is the base URL for this query?") #https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_hydrology_subbasins/MapServer/0
isIntersect = raw_input("Is there an intersect layer? y/n")
start = time.time()
if isIntersect == "y":
	intersectURL = raw_input("Please enter the intersect URL") #https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_dss_le_upwelling/MapServer/0
	intersectLayer = arcpy.FeatureSet(getQueryUrl(intersectURL))

#call up server and test for time - decide whether or not to serialize the query. probably ~10s?

baseLayer = arcpy.FeatureSet(getQueryUrl(baseURL))
baseRows = arcpy.SearchCursor(baseLayer)

end = time.time()
duration = end - start
if duration > 20:
	canned = "true"
else: 
	canned = "false"
	i = 0
	rowAreas = []
	for bRow in baseRows:
		intersectRows = arcpy.SearchCursor(intersectLayer)
		rowInfo = {}
		for iRow in intersectRows:
			if not bRow.shape.disjoint(iRow.shape):
				tempPoly = bRow.shape.intersect(iRow.shape, 4)
				rowInfo.update(area = tempPoly.area, value = bRow.subbasin_Name)
				rowAreas.append(rowInfo)
		i += 1

columns = [{"field": "value"}, {"label": "Gridcode"}, {"field": "area"}, {"label": "Area (km^2)"}]

options = dict(label = "test", value = 0, param = 1, url = baseURL, index = 0, variable = "test", canned = canned, columns = columns)

rows.update(label = label, index = 0, value = 0, param = "1", url = baseURL, options = options)