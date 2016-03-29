/* transparency component */
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/query',
    'dojo/dom-style',
    'dijit/PopupMenuItem',
    'dijit/TooltipDialog'
], function (
    declare,
    lang,
    array,
    query,
    domStyle,
    PopupMenuItem,
    TooltipDialog
) {
    'use strict';
    return declare(PopupMenuItem, {
        //layer: null,
		layerDescription: null,
		layerDescriptionUrl: null,
        constructor: function (options) {
            options = options || {};
            lang.mixin(this, options);
        },
        postCreate: function () {
			if (this.layerDescriptionUrl !== undefined) {
				var urlText = "Metadata";
				if (this.layerDescriptionText !== undefined) {
					urlText = this.layerDescriptionText;
				}
				var metadatalink = '<br><a href="' + this.layerDescriptionUrl + '" target="_blank">' + urlText + '</i></a>';
			} else {
				var metadatalink = '';
			}
			this.layerDescription = this.layerDescription + ' ' + metadatalink;
            this.popup = new TooltipDialog({
                style: 'width:300px;',
				content: this.layerDescription
            });
            domStyle.set(this.popup.connectorNode, 'display', 'none');
            this.popup.startup();
        }
    });
});