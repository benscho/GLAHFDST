define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'esri/toolbars/navigation',
    'dijit/form/Button',
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuItem',
    'dijit/MenuSeparator',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/text!./NavTools/templates/NavTools.html',
    'dojo/topic',
    'xstyle/css!./NavTools/css/NavTools.css'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Navigation, Button, Menu, MenuItem, PopupMenuItem, MenuSeparator, lang, on, NavToolsTemplate, topic, css) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: NavToolsTemplate,
        navTools: null,
        postCreate: function(){
			console.log("in navTools.js");
          this.navTools = new Navigation(this.map);
          this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode', 'navTools')));
          this.navTools.on('extent-history-change', lang.hitch(this, 'extentHistoryChangeHandler'));
          if (this.mapRightClickMenu) {
            this.addRightClickMenu();
            }
        },
           addRightClickMenu: function () {
            //future functionality - zoom here, pan here
            // capture map right click position
            /*this.map.on('MouseDown', lang.hitch(this, function (evt) {
            //this.mapRightClickPoint = evt.mapPoint;
            }));*/

            this.menu = new Menu();
            this.menu.addChild(new MenuItem({
                label: 'Zoom In',
                onClick: lang.hitch(this, 'zoomIn')
            }));
            this.menu.addChild(new MenuItem({
                label: 'Zoom Out',
                onClick: lang.hitch(this, 'zoomOut')
            }));
            this.menu.addChild(new MenuItem({
                label: 'Pan',
                onClick: lang.hitch(this, 'pan')
            }));
            this.menu.addChild(new MenuSeparator());
            this.menu.addChild(new MenuItem({
                label: 'Full Extent',
                onClick: lang.hitch(this, 'fullExtent')
            }));
            this.menu.addChild(new MenuItem({
                label: 'Previous Extent',
                onClick: lang.hitch(this, 'prevExtent')
            }));
            this.menu.addChild(new MenuItem({
                label: 'Next Extent',
                onClick: lang.hitch(this, 'nextExtent')
            }));
            this.menu.addChild(new MenuSeparator());
            this.menu.addChild(new MenuItem({
                label: 'Deactivate',
                onClick: lang.hitch(this, 'deactivate')
            }));

            // add this widgets menu as a sub menu to the map right click menu
            this.mapRightClickMenu.addChild(new PopupMenuItem({
                label: 'Map NavTools',
                popup: this.menu
            }));
        },
        setMapClickMode: function (mode) {
            this.mapClickMode = mode;
            if (mode !== 'navTools') {
                this.navTools.deactivate();                
            }
        },
        deactivate: function () {
            this.navTools.deactivate();
            this.map.setMapCursor('default');
            this.connectMapClick();
        },
        zoomIn: function() {
            this.map.setMapCursor("url('js/gis/dijit/NavTools/images/zoomin.cur'),auto");
            this.disconnectMapClick();
            this.navTools.activate(Navigation.ZOOM_IN);
        },
        zoomOut: function() {
            this.map.setMapCursor("url('js/gis/dijit/NavTools/images/zoomout.cur'),auto");
            this.navTools.activate(Navigation.ZOOM_OUT);
        },
        fullExtent: function () {
            this.navTools.zoomToFullExtent();
        },		
        prevExtent: function () {
            this.navTools.zoomToPrevExtent();
        },
        nextExtent: function () {
            this.navTools.zoomToNextExtent();
        },		
        pan: function () {
            this.map.setMapCursor("url('js/gis/dijit/NavTools/images/hand.cur'),auto");
            this.navTools.activate(Navigation.PAN);
        },

        disconnectMapClick: function() {
            // cmv 1.3.0
            topic.publish('mapClickMode/setCurrent', 'navTools');
            // cmv v1.2.0
            // this.mapClickMode.current = 'nav';
            // ESRI sample
            // dojo.disconnect(this.mapClickEventHandle);
            // this.mapClickEventHandle = null;
        },
        
        connectMapClick: function() {
            // cmv 1.3.0 
            topic.publish('mapClickMode/setDefault');
            // cmv v1.2.0
            // this.mapClickMode.current = this.mapClickMode.defaultMode;
            // ESRI sample
            // if (this.mapClickEventHandle === null) {
            //     this.mapClickEventHandle = dojo.connect(this.map, 'onClick', this.mapClickEventListener);
            // }
        },
        
        extentHistoryChangeHandler: function (evt) {
           //registry.byId('zoomprev').disabled = navTools.isFirstExtent();
           //registry.byId('zoomnext').disabled = navTools.isLastExtent();
            this.deactivate();
            this.connectMapClick();
        }
    });
});
