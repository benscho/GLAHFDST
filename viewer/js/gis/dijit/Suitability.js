define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
	
	'dojo/topic',
	
	'dojo/text!./Suitability/Templates/Suitability.html'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, topic, suitabilityTemplate) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
        templateString: suitabilityTemplate,
		isActive: false,
		postCreate: function () {
			topic.subscribe('suitability/showWidget', this.show);
		},
		show: function () {
			
		}
	});
}); 