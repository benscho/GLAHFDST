define([
	'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
	'./Extract'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Extract) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		simpleTest: function () {
			console.log(Extract);
		}
	});
});