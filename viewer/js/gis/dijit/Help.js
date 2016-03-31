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
	'dojo/text!./Help/templates/HelpDialog.html',
    'dijit/form/Button',

	'dijit/layout/TabContainer',
	'dijit/layout/ContentPane',
	'xstyle/css!./Help/css/Help.css',
	/*@KY*/
	"dijit/layout/AccordionContainer", 
	"dijit/layout/AccordionPane", 
	"dojo/parser"
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin, domConstruct, on, lang, aspect, template, Button) {
/*@ky added Button, dom*/
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FloatingWidgetMixin], {
		widgetsInTemplate: true,
		templateString: template,
		title: 'Help',
		html: '<div class="dijitContentPane" id="help_parent" style="text-align: center; cursor: pointer;"><i class="fa fa-question-circle fa-3x"></i><br/>Help</div>',
		domTarget: 'helpDijit',
		draggable: true,
		baseClass: 'helpDijit',

		postCreate: function () {
			this.inherited(arguments);
			this.parentWidget.draggable = this.draggable;
			if (this.parentWidget.toggleable) {
				this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
					this.containerNode.resize();
				})));
			} else {
				var help = domConstruct.place(this.html, "toolbar");
				on(help, 'click', lang.hitch(this.parentWidget, 'show'));
			}
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
		},
		/*@KY*/
		_onStartupChange: function (evt) {
			localStorage.setItem('hideHelpOnStartup', evt);
			//alert('onStartupChange' + localStorage.getItem('hideHelpOnStartup'));
		},
		openOnStartupFunc: function () {
			//console.log('hideHelp? ' + localStorage.getItem('hideHelpOnStartup'));
			if (localStorage.getItem('hideHelpOnStartup') == 'true') {
				// Make the check box agree with previous user setting to
				// hide help on load
				this.startupDijit.set('value', true);
            	this.startupDijit.set('checked', true);
            	return false;
			} else {
				return true;
			}
		}
	});
});