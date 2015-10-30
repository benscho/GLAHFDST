define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/io-query',
	'dojo/request',
	
	'dijit/form/Select',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	
	'dstore/Memory',
	
	'dojo/text!./Search/templates/Search.html',
	'xstyle/css!./Search/css/Search.css'
], function (declare, lang, Array, ioQuery, request, Select, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Memory, SearchTemplate) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		widgetsInTemplate: true,
		templateString: SearchTemplate,
		postCreate: function() {
			this.inherited(arguments);

			this.topics = [];
			this.subTopics = [];
			request.get("js/gis/dijit/Search/json/search.json", {
				handleAs: "json"
			}).then(lang.hitch(this, function (results) {
				console.log("reading search.json...");
				for (var i in results) {
					this.topics.push(results[i]);
					var options = results[i].options;
					for (var j in options) {
						this.subTopics.push(options[j]);
					}
				}
				console.log("done reading search.json");
				this.topicSelect = new Select({
					name: "topicSelect"
				}, dojo.byId("topicSelect"));
				this.topicSelect.addOption(this.topics);
				this.topicSelect.startup();
				this.subSelect = new Select({
					name: "subSelect"
				}, dojo.byId("subSelect"));
				this.subSelect.addOption(this.subTopics);
				this.subSelect.startup();
			}));
		}
	});
});