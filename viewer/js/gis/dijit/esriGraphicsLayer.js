define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'esri/layers/GraphicsLayer',
	'./TextGraphic'
], function (declare, lang, GraphicsLayer, Graphic) {
	return lang.extend(GraphicsLayer, {
		addTextGraphic: function (graphic) {
			this.add(graphic);
			this.add(new Graphic(graphic.geometry, graphic.textSymbol));
		}
	});
});