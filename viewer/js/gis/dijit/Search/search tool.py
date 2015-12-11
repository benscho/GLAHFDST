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
			polygons.append(arcpy.Polygon(array))
			array.removeAll()
	return polygons

def getUrlData(layer):
	urlVars = { 'where' : '1=1', 'returnGeometry' : 'true', 'f' : 'json'}
	args = ['where', 'returnGeometry', 'f']
	queryString = "&".join([item + "=" + urllib.quote_plus(urlVars[item]) for item in args])
	req = urllib2.Request(layer + "/query?" + queryString)
	response = urllib2.urlopen(req)
	jsonResponse = json.load(response)
	return jsonResponse;

#read in user input
label = raw_input("What is the name of this query?")
baseLayer = raw_input("What is the base URL for this query?") #https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_hydrology_subbasins/MapServer/0
isIntersect = raw_input("Is there an intersect layer? y/n")
if isIntersect == "y":
	intersectLayer = raw_input("Please enter the intersect URL") #https://arcgis.lsa.umich.edu/arcpub/rest/services/IFR/glahf_dss_le_upwelling/MapServer/0
	start = time.time()
	intersectLayer = getUrlData(intersectLayer)
	intersectPolygons = createPolygons(intersectLayer)
else:
	start = time.time()

#call up server and test for time - decide whether or not to 'can' the query. probably ~10s?

baseLayer = getUrlData(baseLayer)
basePolygons = createPolygons(baseLayer)

for polygon in basePolygons:
	arcpy.Intersect_analysis([polygon, intersectPolygons], "in_memory/searchIntersect", "ALL", "", "")


end = time.time()

print end - start