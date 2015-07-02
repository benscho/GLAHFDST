define([
	'dojo/_base/declare',
	'dojo/on',
	'dijit/layout/ContentPane',
	'xstyle/css!./ToolbarOption/css/ToolbarOption.css'
], function (declare, on, ContentPane) {
	return declare([ContentPane], {
		postCreate: function () {
			this.inherited(arguments);
		},
		startup: function () {
			this.inherited(arguments);
		}
	});
});