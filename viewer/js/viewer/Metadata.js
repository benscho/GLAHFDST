define([
	'dojo/dom',
	'dojo/on',
	'dojo/query',
	'dojo/fx/Toggler'

], function (dom, on, query, Toggler) {
	return {
		postCreate: function () {
			this.inherited(arguments);
			this.initMeta();
			console.log("In Metadata.js postCreate");
		},
		initMeta: function () {
			query('h3').forEach(function (node) {
				on(node, 'click', function (evt) {
					var domNode = dom.byId(evt.target.id + "Text");
					if (domNode.style.display === 'none'){
						domNode.style.display = 'block';
					} else {
						domNode.style.display = 'none';
					}
				});
				var contents = "<li><a href='#" + node.id + "' rel='internal' target='_parent'>" + node.innerText + "</a></li>";
				dom.byId("contents").innerHTML += contents;
			});
		}
	}
});