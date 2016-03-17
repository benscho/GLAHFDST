from arcpy import FeatureSet, Intersect_analysis, SetParameter, GetParameterAsText
#layers is a list of layer ULRs we will read polygon info from
def criteriaIntersect(layers):
	layerData = []
	outPolys = FeatureSet
	sepLayers = layers.split(",")
	for i in sepLayers:
		featureset = FeatureSet(i)
		layerData.append(featureset)

	if len(layerData) == 1:
		layerData[0].save("in_memory/critIntersect")
	else:
		Intersect_analysis(layerData,"in_memory/critIntersect", "ALL", "", "")

layers = GetParameterAsText(0) #list of layer URLs

criteriaIntersect(layers)
outPolys = FeatureSet()
outPolys.load("in_memory/critIntersect")
SetParameter(1, outPolys) #intersection polygon