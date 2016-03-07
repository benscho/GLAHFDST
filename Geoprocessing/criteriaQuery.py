from arcpy import FeatureSet, Intersect_analysis, Union_analysis, SetParameter, GetParameterAsText, Delete_management
import json, urllib
#layers is a json list we will use to build the queries
layers = GetParameterAsText(0)

layer_data = []
parsed_layers = json.loads(layers)
i = 1
for layer in parsed_layers:
	url = layer["URL"]
	variable = layer["param"]
	values = layer["values"]
	layer = layer["layer"]
	layers_to_merge = []
	for value in values:
		f = { 'where': (variable + "=" + value), 'f': 'json'}
		layer_string = url + layer + "/" + "query?" + urllib.urlencode(f)
		print(layer_string)
		featureset = FeatureSet(layer_string)
		layers_to_merge.append(featureset)
	Union_analysis(layers_to_merge, "in_memory/critUnion", "ALL", "", "")
	featureset = FeatureSet()
	featureset.load("in_memory/critUnion")
	featureset.save("in_memory/critUnion " + str(i))
	i += 1
	Delete_management("in_memory/critUnion")

output = FeatureSet()
for j in range(1, i):
	output.load("in_memory/critUnion " + str(j))
	layer_data.append(output)
Intersect_analysis(layer_data,"in_memory/critIntersect", "ALL", "", "")

outPolys = FeatureSet()
outPolys.load("in_memory/critIntersect")
SetParameter(1, outPolys)