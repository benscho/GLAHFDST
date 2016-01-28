define([
	'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'gis/dijit/_FloatingWidgetMixin',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/_base/lang',
    'dojo/aspect',
	'dojo/topic',
	'dijit/Dialog',
	'dojo/text!./Help/templates/HelpDialog.html',
    'dijit/form/Button',
	'dijit/layout/TabContainer',
	'dijit/layout/ContentPane',
	'xstyle/css!./Help/css/Help.css'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin, domConstruct, on, lang, aspect, topic, Dialog, template) {

	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin], {
		widgetsInTemplate: true,
		templateString: template,
		title: 'Help',
		html: template,
		domTarget: 'helpDijit',
		draggable: false,
		baseClass: 'helpDijit',
		postCreate: function () {
			this.inherited(arguments);
			this.parentWidget.draggable = this.draggable;
			if (this.parentWidget.toggleable) {
				this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
					this.containerNode.resize();
				})));
			} else {
				var help = domConstruct.place(this.html, this.domTarget);
				//on(help, 'click', lang.hitch(this.parentWidget, 'show'));
				/*this.help = new Dialog({
					title: "Splash",
					content: "Hello, world!",
					style: "width: 300px;"
				});
				this.help.placeAt(dojo.byId("helpDijit"));
				this.help.startup();*/
			}
			topic.subscribe("help/display", lang.hitch(this, function(response) {
				console.log("display the help widget");
				//this.help.show();
			}));
		},
		onOpen: function () {
			//  Make sure the content is visible when the dialog
			//  is shown/opened. Something like this may be needed
			//  for all floating windows that don't open on startup?
			if (!this.openOnStartup) {
				this.containerNode.resize();
			}
		},
		close: function () {
			if (this.parentWidget.hide) {
				this.parentWidget.hide();
			}
		}
	});
});