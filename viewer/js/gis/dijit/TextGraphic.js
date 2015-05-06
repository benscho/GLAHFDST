define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'esri/graphic'
], function(declare, lang, Graphic) {
	return declare(Graphic, {
		textSymbol: null,
		simpleTest: function () {
			console.log("it works!");
		},
		setTextSymbol: function(a) {
            var c = this._graphicsLayer,
                e = this._shape;
            this.textSymbol = a;
            c && (e && c._removeShape(this), c._draw(this, !0));
            return this		
		}
	});
});