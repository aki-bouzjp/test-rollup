define(['exports', './feature-c68a0082', './browser-1423c416', './promotionPopup', './promotionCard', './promotionSideCard'], (function (exports, feature, browser, promotionPopup, promotionCard, promotionSideCard) { 'use strict';

    const getImageUrl = (imageId) => (`${feature.config.BASE_URL}/ads/v1/campaign/resources/creatives/${imageId}?access_token=${feature.config.ACCESS_TOKEN}`);

    const COLORS = {
        FONT_COLOR_LIGHT: '#373737',
        FONT_COLOR_DARK: '#6e523c',
        FONT_HALO_COLOR_LIGHT: '#000000',
        FONT_HALO_COLOR_DARK: '#f1f1f1',
        SELECTED_FONT_COLOR_LIGHT: '#373737',
        SELECTED_FONT_COLOR_DARK: '#f1f1f1',
        SELECTED_FONT_HALO_COLOR_LIGHT: '#000000',
        SELECTED_FONT_HALO_COLOR_DARK: '#6e523c',
    };

    const LAYOUT_PARAMS = {
        'icon-image': ['get', 'icon'],
        'icon-size': [
            'interpolate',
            ['exponential', 1.5],
            ['zoom'],
            10, 0.5,
            16, 1.0, // zoom is 16 (or greater) -> icon size will be 1.0
        ],
        'text-field': ['get', 'name_ja'],
        'text-anchor': 'top',
        'text-size': [
            'interpolate',
            ['exponential', 1.5],
            ['zoom'],
            10, 9,
            16, 12,
        ]
    };
    const PAINT_PARAMS = {
        'text-color': COLORS.FONT_COLOR_DARK,
        'text-halo-color': COLORS.FONT_HALO_COLOR_DARK,
        'text-halo-width': 1.0,
        'icon-halo-color': COLORS.FONT_COLOR_DARK,
        'icon-halo-width': 1.5,
        'text-translate': [
            'interpolate',
            ['exponential', 1.5],
            ['zoom'],
            10,
            ['literal', [0.0, 12.0]],
            16,
            ['literal', [0.0, 24.0]],
        ],
        'text-translate-anchor': 'viewport',
        'text-opacity': [
            'step',
            ['zoom'],
            0,
            14,
            1
        ]
    };
    const FILTER = [
        'all',
        ['>=', ['zoom'], ['get', 'min_zoom']],
    ];
    const createSelectedTextColor = (adid, isDarkMode) => {
        return [
            'case',
            ['==', ['get', 'adid'], adid],
            isDarkMode ? COLORS.SELECTED_FONT_COLOR_LIGHT : COLORS.SELECTED_FONT_COLOR_DARK,
            isDarkMode ? COLORS.FONT_COLOR_LIGHT : COLORS.FONT_COLOR_DARK,
        ];
    };
    const createSelectedTextHaloColor = (adid, isDarkMode) => {
        return [
            'case',
            ['==', ['get', 'adid'], adid],
            isDarkMode ? COLORS.SELECTED_FONT_HALO_COLOR_LIGHT : COLORS.SELECTED_FONT_HALO_COLOR_DARK,
            isDarkMode ? COLORS.FONT_HALO_COLOR_LIGHT : COLORS.FONT_HALO_COLOR_DARK,
        ];
    };

    class MapboxPromoted {
        _map;
        _source;
        _layer;
        _layerId = 'promotion-symbols';
        _sourceId = 'promotions-source';
        _isDarkMode;
        _enablePromotionCard;
        _enablePromotionSideCard;
        _promotionCard;
        _promotionPopup;
        _promotionSideCard;
        _listeners = {};
        _renderedFeaturesAdids = [];
        constructor(map, token, options = {}) {
            this.accessToken = token;
            const { baseUrl, sourceUrl, telemetryUrl, mobileMaxWidth, enablePromotionCard, enablePromotionSideCard, isDarkMode, debug, } = options;
            baseUrl && (this.baseUrl = baseUrl);
            sourceUrl && (this.sourceUrl = sourceUrl);
            telemetryUrl && (this.telemetryUrl = telemetryUrl);
            debug && (this.debug = debug);
            mobileMaxWidth && (this.mobileMaxWidth = mobileMaxWidth);
            this._map = map;
            this._source = {
                type: 'vector',
                url: this.sourceUrl,
            };
            this._layer = {
                id: this._layerId,
                type: 'symbol',
                source: this._sourceId,
                'source-layer': this.layerSourceId,
                layout: LAYOUT_PARAMS,
                paint: PAINT_PARAMS,
                filter: FILTER,
            };
            this._enablePromotionCard = enablePromotionCard || false;
            this._enablePromotionSideCard = enablePromotionSideCard || false;
            this._isDarkMode = isDarkMode || false;
            this._map.on('load', this.load.bind(this));
            this._map.on('render', this.render.bind(this));
            this._map.on('move', this.move.bind(this));
            this._map.on('styleimagemissing', this.styleImageMissing.bind(this));
            this._map.on('click', this._layerId, this.click.bind(this));
            this._map.on('idle', this.idle.bind(this));
            browser.insertElementEndpoint('mapboxgl-global-style');
            window.addEventListener('load', () => this.activate());
            document.readyState === 'complete' && this.activate();
        }
        get accessToken() {
            return feature.config.ACCESS_TOKEN;
        }
        set accessToken(token) {
            feature.config.ACCESS_TOKEN = token;
        }
        get baseUrl() {
            return feature.config.BASE_URL;
        }
        set baseUrl(url) {
            feature.config.BASE_URL = url;
        }
        get sourceUrl() {
            return feature.config.SOURCE_URL;
        }
        set sourceUrl(sourceUrl) {
            feature.config.SOURCE_URL = sourceUrl;
        }
        get telemetryUrl() {
            return feature.config.TELEMETRY_URL;
        }
        set telemetryUrl(telemetryUrl) {
            feature.config.TELEMETRY_URL = telemetryUrl;
        }
        get debug() {
            return feature.config.DEBUG;
        }
        set debug(debug) {
            feature.config.DEBUG = debug;
        }
        get layerSourceId() {
            return feature.config.LAYER_SOURCE_ID;
        }
        set layerSourceId(layerSourceId) {
            feature.config.LAYER_SOURCE_ID = layerSourceId;
        }
        get mobileMaxWidth() {
            return feature.config.MOBILE_MAX_WIDTH;
        }
        set mobileMaxWidth(mobileMaxWidth) {
            feature.config.MOBILE_MAX_WIDTH = mobileMaxWidth;
        }
        get isDarkMode() {
            return this._isDarkMode;
        }
        set isDarkMode(isDarkMode) {
            this._isDarkMode = isDarkMode;
        }
        get map() {
            return this._map;
        }
        get layer() {
            return this._map.getLayer(this._layerId);
        }
        get enablePromotionPopup() {
            return !this._enablePromotionCard && !this._enablePromotionSideCard;
        }
        set enablePromotionPopup(enablePromotionPopup) {
            if (enablePromotionPopup) {
                this._enablePromotionCard = false;
                this._enablePromotionSideCard = false;
            }
            else {
                this._enablePromotionCard = true;
                this._enablePromotionSideCard = false;
            }
        }
        get enablePromotionCard() {
            return this._enablePromotionCard;
        }
        set enablePromotionCard(enablePromotionCard) {
            this._enablePromotionCard = enablePromotionCard;
            this._enablePromotionSideCard = false;
        }
        get enablePromotionSideCard() {
            return this._enablePromotionSideCard;
        }
        set enablePromotionSideCard(enablePromotionSideCard) {
            this._enablePromotionCard = false;
            this._enablePromotionSideCard = enablePromotionSideCard;
        }
        activate() {
            window.renderApp && window.renderApp(feature.config);
            feature.sessionStart();
        }
        reloadPromotionLalyer() {
            if (this._map.getSource(this._sourceId)) {
                this._map.removeSource(this._sourceId);
            }
            if (this._map.getLayer(this._layerId)) {
                this._map.removeLayer(this._layerId);
            }
            this._map.addSource(this._sourceId, this._source);
            this._map.addLayer(this._layer);
        }
        load(event) {
            this.fire(new feature.Event(feature.EVENT_TYPES.LOAD, { map: event.target }));
            this.reloadPromotionLalyer();
        }
        render(_event) {
            this.updateRenderedFeatures();
        }
        move(event) {
            const features = this.map.queryRenderedFeatures(undefined, { layers: [this._layerId] });
            const promotionFeatures = [];
            for (const feature of features) {
                feature.properties && feature.properties['adid'] && promotionFeatures.push(feature);
            }
            this.fire(new feature.Event(feature.EVENT_TYPES.MOVE, {
                map: event.target,
                originalEvent: event.originalEvent,
                features: promotionFeatures
            }));
        }
        async show(feature) {
            if (this._enablePromotionSideCard) {
                if (!this._promotionSideCard) {
                    throw new Error('It needs to be added PromotionSideCard handler.');
                }
                this._promotionSideCard.show(feature);
            }
            else if (this._enablePromotionCard) {
                if (!this._promotionCard) {
                    throw new Error('It needs to be added PromotionCard handler.');
                }
                this._promotionCard.show(feature);
            }
            else {
                if (!this._promotionPopup) {
                    throw new Error('It needs to be added PromotionPopup handler.');
                }
                this._promotionPopup.show(feature);
            }
        }
        click(event) {
            try {
                const feature$1 = event.features && event.features[0];
                if (!feature$1) {
                    return;
                }
                const { properties } = feature$1;
                const { adid } = properties;
                if (!adid) {
                    return;
                }
                feature.sendSelection(adid, this.map.getZoom());
                this.fire(new feature.Event(feature.EVENT_TYPES.CLICK_PIN, {
                    map: event.target,
                    originalEvent: event.originalEvent,
                    feature: feature$1,
                }));
                this.show(feature$1);
            }
            catch (error) {
                console.error(error);
            }
        }
        idle(_event) {
            if (!this.map.getLayer(this._layerId) ||
                !this.map.getSource(this._sourceId)) {
                this.reloadPromotionLalyer();
            }
        }
        on(type, listener) {
            const listenerExists = this._listeners[type] && this._listeners[type].indexOf(listener) !== -1;
            if (!listenerExists) {
                this._listeners[type] = this._listeners[type] || [];
                this._listeners[type].push(listener);
            }
        }
        off(type, listener) {
            if (this._listeners && this._listeners[type]) {
                const index = this._listeners[type].indexOf(listener);
                if (index !== -1) {
                    this._listeners[type].splice(index, 1);
                }
            }
        }
        fire(event) {
            const { type, data } = event;
            const listeners = this._listeners && this._listeners[type] ? this._listeners[type].slice() : [];
            for (const listener of listeners) {
                listener.call(this, type, data);
            }
        }
        selectPin(feature) {
            const { adid } = feature.properties;
            if (!adid) {
                return;
            }
            const textColor = createSelectedTextColor(adid);
            const textHaloColor = createSelectedTextHaloColor(adid);
            this._map.setPaintProperty(this._layerId, 'text-color', textColor);
            this._map.setPaintProperty(this._layerId, 'text-halo-color', textHaloColor);
        }
        deselectPin() {
            this._map.setPaintProperty(this._layerId, 'text-color', this.isDarkMode ? COLORS.FONT_COLOR_LIGHT : COLORS.FONT_COLOR_DARK);
            this._map.setPaintProperty(this._layerId, 'text-halo-color', this.isDarkMode ? COLORS.FONT_HALO_COLOR_LIGHT : COLORS.FONT_HALO_COLOR_DARK);
        }
        async styleImageMissing(event) {
            try {
                const imageId = event.id;
                if (imageId &&
                    !this._map.hasImage(imageId) &&
                    imageId.match(/^([a-zA-Z0-9]{21,22})$/)) {
                    const url = getImageUrl(imageId);
                    this._map.loadImage(url, (error, image) => {
                        if (error) {
                            throw error;
                        }
                        if (!image) {
                            throw new Error('getting image failed.');
                        }
                        this._map.addImage(imageId, image);
                    });
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        updateRenderedFeatures() {
            const features = this.promotionFeatures();
            const disappearedFeatures = [];
            // disappeared feature objects that was rendered before
            this._renderedFeaturesAdids = this._renderedFeaturesAdids.filter(({ adid, visibleStartTime }) => {
                const isExisted = !!features.find(feature => adid === feature.properties.adid);
                if (!isExisted) {
                    disappearedFeatures.push({ adid, visibleStartTime, visibleEndTime: Date.now() });
                    return false;
                }
                return true;
            });
            // adding appeared new feature objects
            features.forEach(feature => {
                const isExisted = !!this._renderedFeaturesAdids.find(({ adid }) => adid === feature.properties.adid);
                if (!isExisted && feature.properties.adid) {
                    this._renderedFeaturesAdids.push({
                        adid: feature.properties.adid,
                        visibleStartTime: Date.now()
                    });
                }
            });
            disappearedFeatures.length && (feature.sendVisibilities(disappearedFeatures));
        }
        // private hasListener(type: EventTypes) {
        //   return !!this._listeners && this._listeners[type] && this._listeners[type].length > 0;
        // }
        addHandler(handler) {
            handler.initPromoted(this);
            switch (handler.id) {
                case 'PromotionPopup': {
                    this._promotionPopup = handler;
                    break;
                }
                case 'PromotionCard': {
                    this._promotionCard = handler;
                    break;
                }
                case 'PromotionSideCard': {
                    this._promotionSideCard = handler;
                    break;
                }
            }
        }
        promotionFeatures() {
            if (!this.map.getLayer(this._layerId)) {
                return [];
            }
            const features = this.map.queryRenderedFeatures(undefined, { layers: [this._layerId] });
            const promotionFeatures = [];
            for (const feature of features) {
                feature.properties && feature.properties['adid'] && (promotionFeatures.push(feature));
            }
            return promotionFeatures;
        }
        showLayer() {
            this._map.setLayoutProperty(this._layerId, 'visibility', 'none');
        }
        hideLayer() {
            this._map.setLayoutProperty(this._layerId, 'visibility', 'visible');
        }
        deselectLayer() {
            this.deselectPin();
        }
    }

    exports.PromotionPopup = promotionPopup;
    exports.PromotionCard = promotionCard;
    exports.PromotionSideCard = promotionSideCard;
    exports.MapboxPromoted = MapboxPromoted;
    exports["default"] = MapboxPromoted;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy91cmxzLnRzIiwiLi4vLi4vc3JjL3V0aWxzL2NvbG9yLnRzIiwiLi4vLi4vc3JjL3V0aWxzL2xheWVyLnRzIiwiLi4vLi4vc3JjL2NvcmUvcHJvbW90ZWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAndXRpbHMvY29uZmlnJztcblxuZXhwb3J0IGNvbnN0IGdldEltYWdlVXJsID0gKGltYWdlSWQ6IHN0cmluZyk6IHN0cmluZyA9PiAoXG4gIGAke2NvbmZpZy5CQVNFX1VSTH0vYWRzL3YxL2NhbXBhaWduL3Jlc291cmNlcy9jcmVhdGl2ZXMvJHtpbWFnZUlkfT9hY2Nlc3NfdG9rZW49JHtjb25maWcuQUNDRVNTX1RPS0VOfWBcbik7XG4iLCJleHBvcnQgY29uc3QgQ09MT1JTID0ge1xuICBGT05UX0NPTE9SX0xJR0hUOiAnIzM3MzczNycsXG4gIEZPTlRfQ09MT1JfREFSSzogJyM2ZTUyM2MnLFxuICBGT05UX0hBTE9fQ09MT1JfTElHSFQ6ICcjMDAwMDAwJyxcbiAgRk9OVF9IQUxPX0NPTE9SX0RBUks6ICcjZjFmMWYxJyxcbiAgU0VMRUNURURfRk9OVF9DT0xPUl9MSUdIVDogJyMzNzM3MzcnLFxuICBTRUxFQ1RFRF9GT05UX0NPTE9SX0RBUks6ICcjZjFmMWYxJyxcbiAgU0VMRUNURURfRk9OVF9IQUxPX0NPTE9SX0xJR0hUOiAnIzAwMDAwMCcsXG4gIFNFTEVDVEVEX0ZPTlRfSEFMT19DT0xPUl9EQVJLOiAnIzZlNTIzYycsXG59O1xuIiwiaW1wb3J0IHsgQ09MT1JTIH0gZnJvbSAndXRpbHMvY29sb3InO1xuXG5leHBvcnQgY29uc3QgTEFZT1VUX1BBUkFNUyA9IHtcbiAgJ2ljb24taW1hZ2UnOiBbJ2dldCcsICdpY29uJ10sXG4gICdpY29uLXNpemUnOiBbXG4gICAgJ2ludGVycG9sYXRlJyxcbiAgICBbJ2V4cG9uZW50aWFsJywgMS41XSxcbiAgICBbJ3pvb20nXSxcbiAgICAxMCwgMC41LCAvLyB6b29tIGlzIDEwIChvciBsZXNzKSAgICAtPiBpY29uIHNpemUgd2lsbCBiZSAwLjVcbiAgICAxNiwgMS4wLCAvLyB6b29tIGlzIDE2IChvciBncmVhdGVyKSAtPiBpY29uIHNpemUgd2lsbCBiZSAxLjBcbiAgXSxcbiAgJ3RleHQtZmllbGQnOiBbJ2dldCcsICduYW1lX2phJ10sXG4gICd0ZXh0LWFuY2hvcic6ICd0b3AnLFxuICAndGV4dC1zaXplJzogW1xuICAgICdpbnRlcnBvbGF0ZScsXG4gICAgWydleHBvbmVudGlhbCcsIDEuNV0sXG4gICAgWyd6b29tJ10sXG4gICAgMTAsIDksXG4gICAgMTYsIDEyLFxuICBdXG59O1xuXG5leHBvcnQgY29uc3QgUEFJTlRfUEFSQU1TID0ge1xuICAndGV4dC1jb2xvcic6IENPTE9SUy5GT05UX0NPTE9SX0RBUkssXG4gICd0ZXh0LWhhbG8tY29sb3InOiBDT0xPUlMuRk9OVF9IQUxPX0NPTE9SX0RBUkssXG4gICd0ZXh0LWhhbG8td2lkdGgnOiAxLjAsXG4gICdpY29uLWhhbG8tY29sb3InOiBDT0xPUlMuRk9OVF9DT0xPUl9EQVJLLFxuICAnaWNvbi1oYWxvLXdpZHRoJzogMS41LFxuICAndGV4dC10cmFuc2xhdGUnOiBbXG4gICAgJ2ludGVycG9sYXRlJyxcbiAgICBbJ2V4cG9uZW50aWFsJywgMS41XSxcbiAgICBbJ3pvb20nXSxcbiAgICAxMCxcbiAgICBbJ2xpdGVyYWwnLCBbMC4wLCAxMi4wXV0sXG4gICAgMTYsXG4gICAgWydsaXRlcmFsJywgWzAuMCwgMjQuMF1dLFxuICBdLFxuICAndGV4dC10cmFuc2xhdGUtYW5jaG9yJzogJ3ZpZXdwb3J0JyxcbiAgJ3RleHQtb3BhY2l0eSc6IFtcbiAgICAnc3RlcCcsXG4gICAgWyd6b29tJ10sXG4gICAgMCxcbiAgICAxNCxcbiAgICAxXG4gIF1cbn07XG5cbmV4cG9ydCBjb25zdCBGSUxURVIgPSBbXG4gICdhbGwnLFxuICBbJz49JywgWyd6b29tJ10sIFsnZ2V0JywgJ21pbl96b29tJ11dLFxuXTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVNlbGVjdGVkVGV4dENvbG9yID0gKGFkaWQ6IHN0cmluZywgaXNEYXJrTW9kZT86IGJvb2xlYW4pID0+IHtcbiAgcmV0dXJuIFtcbiAgICAnY2FzZScsXG4gICAgWyc9PScsIFsnZ2V0JywgJ2FkaWQnXSwgYWRpZF0sXG4gICAgaXNEYXJrTW9kZSA/IENPTE9SUy5TRUxFQ1RFRF9GT05UX0NPTE9SX0xJR0hUIDogQ09MT1JTLlNFTEVDVEVEX0ZPTlRfQ09MT1JfREFSSyxcbiAgICBpc0RhcmtNb2RlID8gQ09MT1JTLkZPTlRfQ09MT1JfTElHSFQgOiBDT0xPUlMuRk9OVF9DT0xPUl9EQVJLLFxuICBdO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVNlbGVjdGVkVGV4dEhhbG9Db2xvciA9IChhZGlkOiBzdHJpbmcsIGlzRGFya01vZGU/OiBib29sZWFuKSA9PiB7XG4gIHJldHVybiBbXG4gICAgJ2Nhc2UnLFxuICAgIFsnPT0nLCBbJ2dldCcsICdhZGlkJ10sIGFkaWRdLFxuICAgIGlzRGFya01vZGUgPyBDT0xPUlMuU0VMRUNURURfRk9OVF9IQUxPX0NPTE9SX0xJR0hUIDogQ09MT1JTLlNFTEVDVEVEX0ZPTlRfSEFMT19DT0xPUl9EQVJLLFxuICAgIGlzRGFya01vZGUgPyBDT0xPUlMuRk9OVF9IQUxPX0NPTE9SX0xJR0hUIDogQ09MT1JTLkZPTlRfSEFMT19DT0xPUl9EQVJLLFxuICBdO1xufTtcbiIsImltcG9ydCBtYXBib3hnbCwgeyBNYXAgfSBmcm9tICdtYXBib3gtZ2wnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAndXRpbHMvY29uZmlnJztcbmltcG9ydCB7IGdldEltYWdlVXJsIH0gZnJvbSAndXRpbHMvdXJscyc7XG5pbXBvcnQgeyBDT0xPUlMgfSBmcm9tICd1dGlscy9jb2xvcic7XG5pbXBvcnQgeyBpbnNlcnRFbGVtZW50RW5kcG9pbnQgfSBmcm9tICd1dGlscy9icm93c2VyJztcbmltcG9ydCB7XG4gIExBWU9VVF9QQVJBTVMsXG4gIFBBSU5UX1BBUkFNUyxcbiAgRklMVEVSLFxuICBjcmVhdGVTZWxlY3RlZFRleHRDb2xvcixcbiAgY3JlYXRlU2VsZWN0ZWRUZXh0SGFsb0NvbG9yLFxufSBmcm9tICd1dGlscy9sYXllcic7XG5pbXBvcnQgeyBFdmVudCB9IGZyb20gJy4vZXZlbnQnO1xuaW1wb3J0IHsgRVZFTlRfVFlQRVMgfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5pbXBvcnQgKiBhcyB0ZWxlbWV0cnlBUElzIGZyb20gJ2FwaXMvdGVsZW1ldHJ5JztcblxuY2xhc3MgTWFwYm94UHJvbW90ZWQgaW1wbGVtZW50cyBNYXBib3hQcm9tb3RlZCB7XG4gIHByaXZhdGUgX21hcDogbWFwYm94Z2wuTWFwO1xuICBwcml2YXRlIF9zb3VyY2U6IG1hcGJveGdsLlZlY3RvclNvdXJjZTtcbiAgcHJpdmF0ZSBfbGF5ZXI6IG1hcGJveGdsLlN5bWJvbExheWVyO1xuICBwcml2YXRlIF9sYXllcklkID0gJ3Byb21vdGlvbi1zeW1ib2xzJztcbiAgcHJpdmF0ZSBfc291cmNlSWQgPSAncHJvbW90aW9ucy1zb3VyY2UnO1xuICBwcml2YXRlIF9pc0RhcmtNb2RlOiBib29sZWFuO1xuICBwcml2YXRlIF9lbmFibGVQcm9tb3Rpb25DYXJkOiBib29sZWFuO1xuICBwcml2YXRlIF9lbmFibGVQcm9tb3Rpb25TaWRlQ2FyZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfcHJvbW90aW9uQ2FyZD86IFByb21vdGlvbkNhcmQ7XG4gIHByaXZhdGUgX3Byb21vdGlvblBvcHVwPzogUHJvbW90aW9uUG9wdXA7XG4gIHByaXZhdGUgX3Byb21vdGlvblNpZGVDYXJkPzogUHJvbW90aW9uU2lkZUNhcmQ7XG4gIHByaXZhdGUgX2xpc3RlbmVyczogTWFwYm94UHJvbW90ZWQuTGlzdGVuZXJzID0ge307XG4gIHByaXZhdGUgX3JlbmRlcmVkRmVhdHVyZXNBZGlkczogeyBhZGlkOiBzdHJpbmc7IHZpc2libGVTdGFydFRpbWU6IG51bWJlcjsgfVtdID0gW107XG5cbiAgY29uc3RydWN0b3IobWFwOiBtYXBib3hnbC5NYXAsIHRva2VuOiBzdHJpbmcsIG9wdGlvbnM6IE1hcGJveFByb21vdGVkLk9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuYWNjZXNzVG9rZW4gPSB0b2tlbjtcblxuICAgIGNvbnN0IHtcbiAgICAgIGJhc2VVcmwsXG4gICAgICBzb3VyY2VVcmwsXG4gICAgICB0ZWxlbWV0cnlVcmwsXG4gICAgICBtb2JpbGVNYXhXaWR0aCxcbiAgICAgIGVuYWJsZVByb21vdGlvbkNhcmQsXG4gICAgICBlbmFibGVQcm9tb3Rpb25TaWRlQ2FyZCxcbiAgICAgIGlzRGFya01vZGUsXG4gICAgICBkZWJ1ZyxcbiAgICB9ID0gb3B0aW9ucztcbiAgICBiYXNlVXJsICYmICh0aGlzLmJhc2VVcmwgPSBiYXNlVXJsKTtcbiAgICBzb3VyY2VVcmwgJiYgKHRoaXMuc291cmNlVXJsID0gc291cmNlVXJsKTtcbiAgICB0ZWxlbWV0cnlVcmwgJiYgKHRoaXMudGVsZW1ldHJ5VXJsID0gdGVsZW1ldHJ5VXJsKTtcbiAgICBkZWJ1ZyAmJiAodGhpcy5kZWJ1ZyA9IGRlYnVnKTtcbiAgICBtb2JpbGVNYXhXaWR0aCAmJiAodGhpcy5tb2JpbGVNYXhXaWR0aCA9IG1vYmlsZU1heFdpZHRoKTtcblxuICAgIHRoaXMuX21hcCA9IG1hcDtcbiAgICB0aGlzLl9zb3VyY2UgPSB7XG4gICAgICB0eXBlOiAndmVjdG9yJyxcbiAgICAgIHVybDogdGhpcy5zb3VyY2VVcmwsXG4gICAgfTtcbiAgICB0aGlzLl9sYXllciA9IHtcbiAgICAgIGlkOiB0aGlzLl9sYXllcklkLFxuICAgICAgdHlwZTogJ3N5bWJvbCcsXG4gICAgICBzb3VyY2U6IHRoaXMuX3NvdXJjZUlkLFxuICAgICAgJ3NvdXJjZS1sYXllcic6IHRoaXMubGF5ZXJTb3VyY2VJZCxcbiAgICAgIGxheW91dDogTEFZT1VUX1BBUkFNUyBhcyBhbnksXG4gICAgICBwYWludDogUEFJTlRfUEFSQU1TIGFzIGFueSxcbiAgICAgIGZpbHRlcjogRklMVEVSLFxuICAgIH07XG5cbiAgICB0aGlzLl9lbmFibGVQcm9tb3Rpb25DYXJkID0gZW5hYmxlUHJvbW90aW9uQ2FyZCB8fCBmYWxzZTtcbiAgICB0aGlzLl9lbmFibGVQcm9tb3Rpb25TaWRlQ2FyZCA9IGVuYWJsZVByb21vdGlvblNpZGVDYXJkIHx8IGZhbHNlO1xuICAgIHRoaXMuX2lzRGFya01vZGUgPSBpc0RhcmtNb2RlIHx8IGZhbHNlO1xuXG4gICAgdGhpcy5fbWFwLm9uKCdsb2FkJywgdGhpcy5sb2FkLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX21hcC5vbigncmVuZGVyJywgdGhpcy5yZW5kZXIuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fbWFwLm9uKCdtb3ZlJywgdGhpcy5tb3ZlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX21hcC5vbignc3R5bGVpbWFnZW1pc3NpbmcnLCB0aGlzLnN0eWxlSW1hZ2VNaXNzaW5nLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX21hcC5vbignY2xpY2snLCB0aGlzLl9sYXllcklkLCB0aGlzLmNsaWNrLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX21hcC5vbignaWRsZScsIHRoaXMuaWRsZS5iaW5kKHRoaXMpKTtcblxuICAgIGluc2VydEVsZW1lbnRFbmRwb2ludCgnbWFwYm94Z2wtZ2xvYmFsLXN0eWxlJyk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHRoaXMuYWN0aXZhdGUoKSk7XG4gICAgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJyAmJiB0aGlzLmFjdGl2YXRlKCk7XG4gIH1cblxuICBnZXQgYWNjZXNzVG9rZW4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gY29uZmlnLkFDQ0VTU19UT0tFTjtcbiAgfVxuXG4gIHNldCBhY2Nlc3NUb2tlbih0b2tlbjogc3RyaW5nKSB7XG4gICAgY29uZmlnLkFDQ0VTU19UT0tFTiA9IHRva2VuO1xuICB9XG5cbiAgZ2V0IGJhc2VVcmwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gY29uZmlnLkJBU0VfVVJMO1xuICB9XG5cbiAgc2V0IGJhc2VVcmwodXJsOiBzdHJpbmcpIHtcbiAgICBjb25maWcuQkFTRV9VUkwgPSB1cmw7XG4gIH1cblxuICBnZXQgc291cmNlVXJsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGNvbmZpZy5TT1VSQ0VfVVJMO1xuICB9XG5cbiAgc2V0IHNvdXJjZVVybChzb3VyY2VVcmw6IHN0cmluZykge1xuICAgIGNvbmZpZy5TT1VSQ0VfVVJMID0gc291cmNlVXJsO1xuICB9XG5cbiAgZ2V0IHRlbGVtZXRyeVVybCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBjb25maWcuVEVMRU1FVFJZX1VSTDtcbiAgfVxuXG4gIHNldCB0ZWxlbWV0cnlVcmwodGVsZW1ldHJ5VXJsOiBzdHJpbmcpIHtcbiAgICBjb25maWcuVEVMRU1FVFJZX1VSTCA9IHRlbGVtZXRyeVVybDtcbiAgfVxuXG4gIGdldCBkZWJ1ZygpIHtcbiAgICByZXR1cm4gY29uZmlnLkRFQlVHO1xuICB9XG5cbiAgc2V0IGRlYnVnKGRlYnVnOiBib29sZWFuKSB7XG4gICAgY29uZmlnLkRFQlVHID0gZGVidWc7XG4gIH1cblxuICBnZXQgbGF5ZXJTb3VyY2VJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBjb25maWcuTEFZRVJfU09VUkNFX0lEO1xuICB9XG5cbiAgc2V0IGxheWVyU291cmNlSWQobGF5ZXJTb3VyY2VJZDogc3RyaW5nKSB7XG4gICAgY29uZmlnLkxBWUVSX1NPVVJDRV9JRCA9IGxheWVyU291cmNlSWQ7XG4gIH1cblxuICBnZXQgbW9iaWxlTWF4V2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29uZmlnLk1PQklMRV9NQVhfV0lEVEg7XG4gIH1cblxuICBzZXQgbW9iaWxlTWF4V2lkdGgobW9iaWxlTWF4V2lkdGg6IG51bWJlcikge1xuICAgIGNvbmZpZy5NT0JJTEVfTUFYX1dJRFRIID0gbW9iaWxlTWF4V2lkdGg7XG4gIH1cblxuICBnZXQgaXNEYXJrTW9kZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNEYXJrTW9kZTtcbiAgfVxuXG4gIHNldCBpc0RhcmtNb2RlKGlzRGFya01vZGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pc0RhcmtNb2RlID0gaXNEYXJrTW9kZTtcbiAgfVxuXG4gIGdldCBtYXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcDtcbiAgfVxuXG4gIGdldCBsYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwLmdldExheWVyKHRoaXMuX2xheWVySWQpO1xuICB9XG5cbiAgZ2V0IGVuYWJsZVByb21vdGlvblBvcHVwKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5fZW5hYmxlUHJvbW90aW9uQ2FyZCAmJiAhdGhpcy5fZW5hYmxlUHJvbW90aW9uU2lkZUNhcmQ7XG4gIH1cblxuICBzZXQgZW5hYmxlUHJvbW90aW9uUG9wdXAoZW5hYmxlUHJvbW90aW9uUG9wdXA6IGJvb2xlYW4pIHtcbiAgICBpZiAoZW5hYmxlUHJvbW90aW9uUG9wdXApIHtcbiAgICAgIHRoaXMuX2VuYWJsZVByb21vdGlvbkNhcmQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2VuYWJsZVByb21vdGlvblNpZGVDYXJkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VuYWJsZVByb21vdGlvbkNhcmQgPSB0cnVlO1xuICAgICAgdGhpcy5fZW5hYmxlUHJvbW90aW9uU2lkZUNhcmQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBnZXQgZW5hYmxlUHJvbW90aW9uQ2FyZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlUHJvbW90aW9uQ2FyZDtcbiAgfVxuXG4gIHNldCBlbmFibGVQcm9tb3Rpb25DYXJkKGVuYWJsZVByb21vdGlvbkNhcmQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbmFibGVQcm9tb3Rpb25DYXJkID0gZW5hYmxlUHJvbW90aW9uQ2FyZDtcbiAgICB0aGlzLl9lbmFibGVQcm9tb3Rpb25TaWRlQ2FyZCA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0IGVuYWJsZVByb21vdGlvblNpZGVDYXJkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9lbmFibGVQcm9tb3Rpb25TaWRlQ2FyZDtcbiAgfVxuXG4gIHNldCBlbmFibGVQcm9tb3Rpb25TaWRlQ2FyZChlbmFibGVQcm9tb3Rpb25TaWRlQ2FyZDogYm9vbGVhbikge1xuICAgIHRoaXMuX2VuYWJsZVByb21vdGlvbkNhcmQgPSBmYWxzZTtcbiAgICB0aGlzLl9lbmFibGVQcm9tb3Rpb25TaWRlQ2FyZCA9IGVuYWJsZVByb21vdGlvblNpZGVDYXJkO1xuICB9XG5cbiAgcHJpdmF0ZSBhY3RpdmF0ZSgpIHtcbiAgICB3aW5kb3cucmVuZGVyQXBwICYmIHdpbmRvdy5yZW5kZXJBcHAoY29uZmlnKTtcbiAgICB0ZWxlbWV0cnlBUElzLnNlc3Npb25TdGFydCgpO1xuICB9XG4gIFxuICBwcml2YXRlIHJlbG9hZFByb21vdGlvbkxhbHllcigpIHtcbiAgICBpZiAodGhpcy5fbWFwLmdldFNvdXJjZSh0aGlzLl9zb3VyY2VJZCkpIHtcbiAgICAgIHRoaXMuX21hcC5yZW1vdmVTb3VyY2UodGhpcy5fc291cmNlSWQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fbWFwLmdldExheWVyKHRoaXMuX2xheWVySWQpKSB7XG4gICAgICB0aGlzLl9tYXAucmVtb3ZlTGF5ZXIodGhpcy5fbGF5ZXJJZCk7XG4gICAgfVxuICAgIHRoaXMuX21hcC5hZGRTb3VyY2UodGhpcy5fc291cmNlSWQsIHRoaXMuX3NvdXJjZSk7XG4gICAgdGhpcy5fbWFwLmFkZExheWVyKHRoaXMuX2xheWVyKTtcbiAgfVxuXG4gIHByaXZhdGUgbG9hZChldmVudDogeyB0YXJnZXQ6IE1hcCB9KSB7XG4gICAgdGhpcy5maXJlKG5ldyBFdmVudChFVkVOVF9UWVBFUy5MT0FELCB7IG1hcDogZXZlbnQudGFyZ2V0IH0pKTtcbiAgICB0aGlzLnJlbG9hZFByb21vdGlvbkxhbHllcigpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXIoX2V2ZW50OiB7IHRhcmdldDogTWFwIH0pIHtcbiAgICB0aGlzLnVwZGF0ZVJlbmRlcmVkRmVhdHVyZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZShldmVudDogbWFwYm94Z2wuTWFwYm94RXZlbnQ8YW55PiAmIG1hcGJveGdsLkV2ZW50RGF0YSkge1xuICAgIGNvbnN0IGZlYXR1cmVzID0gdGhpcy5tYXAucXVlcnlSZW5kZXJlZEZlYXR1cmVzKHVuZGVmaW5lZCwgeyBsYXllcnM6IFt0aGlzLl9sYXllcklkXSB9KTtcbiAgICBjb25zdCBwcm9tb3Rpb25GZWF0dXJlcyA9IFtdO1xuICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiBmZWF0dXJlcykge1xuICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzICYmIGZlYXR1cmUucHJvcGVydGllc1snYWRpZCddICYmIHByb21vdGlvbkZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgfVxuICAgIHRoaXMuZmlyZShcbiAgICAgIG5ldyBFdmVudChFVkVOVF9UWVBFUy5NT1ZFLCB7XG4gICAgICAgIG1hcDogZXZlbnQudGFyZ2V0LFxuICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudC5vcmlnaW5hbEV2ZW50LFxuICAgICAgICBmZWF0dXJlczogcHJvbW90aW9uRmVhdHVyZXNcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2hvdyhmZWF0dXJlOiBGZWF0dXJlKSB7XG4gICAgaWYgKHRoaXMuX2VuYWJsZVByb21vdGlvblNpZGVDYXJkKSB7XG4gICAgICBpZiAoIXRoaXMuX3Byb21vdGlvblNpZGVDYXJkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSXQgbmVlZHMgdG8gYmUgYWRkZWQgUHJvbW90aW9uU2lkZUNhcmQgaGFuZGxlci4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3Byb21vdGlvblNpZGVDYXJkLnNob3coZmVhdHVyZSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2VuYWJsZVByb21vdGlvbkNhcmQpIHtcbiAgICAgIGlmICghdGhpcy5fcHJvbW90aW9uQ2FyZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0l0IG5lZWRzIHRvIGJlIGFkZGVkIFByb21vdGlvbkNhcmQgaGFuZGxlci4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3Byb21vdGlvbkNhcmQuc2hvdyhmZWF0dXJlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCF0aGlzLl9wcm9tb3Rpb25Qb3B1cCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0l0IG5lZWRzIHRvIGJlIGFkZGVkIFByb21vdGlvblBvcHVwIGhhbmRsZXIuJyk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wcm9tb3Rpb25Qb3B1cC5zaG93KGZlYXR1cmUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2xpY2soZXZlbnQ6IG1hcGJveGdsLk1hcE1vdXNlRXZlbnQgJiB7IGZlYXR1cmVzPzogbWFwYm94Z2wuTWFwYm94R2VvSlNPTkZlYXR1cmVbXSB8IHVuZGVmaW5lZDsgfSAmIG1hcGJveGdsLkV2ZW50RGF0YSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBmZWF0dXJlID0gZXZlbnQuZmVhdHVyZXMgJiYgZXZlbnQuZmVhdHVyZXNbMF0gYXMgRmVhdHVyZTtcbiAgICAgIGlmICghZmVhdHVyZSkgeyByZXR1cm47IH1cbiAgICAgIGNvbnN0IHsgcHJvcGVydGllcyB9ID0gZmVhdHVyZTtcbiAgICAgIGNvbnN0IHsgYWRpZCB9ID0gcHJvcGVydGllcztcbiAgICAgIGlmICghYWRpZCkgeyByZXR1cm47IH1cblxuICAgICAgdGVsZW1ldHJ5QVBJcy5zZW5kU2VsZWN0aW9uKGFkaWQsIHRoaXMubWFwLmdldFpvb20oKSk7XG4gICAgICB0aGlzLmZpcmUobmV3IEV2ZW50KEVWRU5UX1RZUEVTLkNMSUNLX1BJTiwge1xuICAgICAgICBtYXA6IGV2ZW50LnRhcmdldCxcbiAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQub3JpZ2luYWxFdmVudCxcbiAgICAgICAgZmVhdHVyZSxcbiAgICAgIH0pKTtcbiAgICAgIHRoaXMuc2hvdyhmZWF0dXJlKTtcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGlkbGUoX2V2ZW50OiBtYXBib3hnbC5NYXBib3hFdmVudCkge1xuICAgIGlmIChcbiAgICAgICF0aGlzLm1hcC5nZXRMYXllcih0aGlzLl9sYXllcklkKSB8fFxuICAgICAgIXRoaXMubWFwLmdldFNvdXJjZSh0aGlzLl9zb3VyY2VJZClcbiAgICApIHtcbiAgICAgIHRoaXMucmVsb2FkUHJvbW90aW9uTGFseWVyKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uKHR5cGU6IE1hcGJveFByb21vdGVkLkV2ZW50VHlwZXMsIGxpc3RlbmVyOiBNYXBib3hQcm9tb3RlZC5MaXN0ZW5lcikge1xuICAgIGNvbnN0IGxpc3RlbmVyRXhpc3RzID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdICYmIHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKSAhPT0gLTE7XG4gICAgaWYgKCFsaXN0ZW5lckV4aXN0cykge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW3R5cGVdID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdIHx8IFtdO1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvZmYodHlwZTogTWFwYm94UHJvbW90ZWQuRXZlbnRUeXBlcywgbGlzdGVuZXI6IE1hcGJveFByb21vdGVkLkxpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycyAmJiB0aGlzLl9saXN0ZW5lcnNbdHlwZV0pIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnNbdHlwZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZmlyZShldmVudDogRXZlbnQpIHtcbiAgICBjb25zdCB7IHR5cGUsIGRhdGEgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycyAmJiB0aGlzLl9saXN0ZW5lcnNbdHlwZV0gPyB0aGlzLl9saXN0ZW5lcnNbdHlwZV0uc2xpY2UoKSA6IFtdO1xuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgbGlzdGVuZXJzKSB7XG4gICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIHR5cGUsIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZWxlY3RQaW4oZmVhdHVyZTogRmVhdHVyZSkge1xuICAgIGNvbnN0IHsgYWRpZCB9ID0gZmVhdHVyZS5wcm9wZXJ0aWVzIGFzIEZlYXR1cmUuUHJvcGVydGllcztcbiAgICBpZiAoIWFkaWQpIHsgcmV0dXJuOyB9XG4gICAgY29uc3QgdGV4dENvbG9yID0gY3JlYXRlU2VsZWN0ZWRUZXh0Q29sb3IoYWRpZCk7XG4gICAgY29uc3QgdGV4dEhhbG9Db2xvciA9IGNyZWF0ZVNlbGVjdGVkVGV4dEhhbG9Db2xvcihhZGlkKTtcbiAgICB0aGlzLl9tYXAuc2V0UGFpbnRQcm9wZXJ0eSh0aGlzLl9sYXllcklkLCAndGV4dC1jb2xvcicsIHRleHRDb2xvcik7XG4gICAgdGhpcy5fbWFwLnNldFBhaW50UHJvcGVydHkodGhpcy5fbGF5ZXJJZCwgJ3RleHQtaGFsby1jb2xvcicsIHRleHRIYWxvQ29sb3IpO1xuICB9XG5cbiAgcHVibGljIGRlc2VsZWN0UGluKCkge1xuICAgIHRoaXMuX21hcC5zZXRQYWludFByb3BlcnR5KFxuICAgICAgdGhpcy5fbGF5ZXJJZCxcbiAgICAgICd0ZXh0LWNvbG9yJyxcbiAgICAgIHRoaXMuaXNEYXJrTW9kZSA/IENPTE9SUy5GT05UX0NPTE9SX0xJR0hUIDogQ09MT1JTLkZPTlRfQ09MT1JfREFSSyxcbiAgICApO1xuICAgIHRoaXMuX21hcC5zZXRQYWludFByb3BlcnR5KFxuICAgICAgdGhpcy5fbGF5ZXJJZCxcbiAgICAgICd0ZXh0LWhhbG8tY29sb3InLFxuICAgICAgdGhpcy5pc0RhcmtNb2RlID8gQ09MT1JTLkZPTlRfSEFMT19DT0xPUl9MSUdIVCA6IENPTE9SUy5GT05UX0hBTE9fQ09MT1JfREFSSyxcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzdHlsZUltYWdlTWlzc2luZyhldmVudDogYW55KSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGltYWdlSWQ6IHN0cmluZyA9IGV2ZW50LmlkO1xuICAgICAgaWYgKFxuICAgICAgICBpbWFnZUlkICYmXG4gICAgICAgICF0aGlzLl9tYXAuaGFzSW1hZ2UoaW1hZ2VJZCkgJiZcbiAgICAgICAgaW1hZ2VJZC5tYXRjaCgvXihbYS16QS1aMC05XXsyMSwyMn0pJC8pXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgdXJsID0gZ2V0SW1hZ2VVcmwoaW1hZ2VJZCk7XG4gICAgICAgIHRoaXMuX21hcC5sb2FkSW1hZ2UodXJsLCAoZXJyb3I/OiBFcnJvciwgaW1hZ2U/OiBIVE1MSW1hZ2VFbGVtZW50IHwgSW1hZ2VCaXRtYXApID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHsgdGhyb3cgZXJyb3I7IH1cbiAgICAgICAgICBpZiAoIWltYWdlKSB7IHRocm93IG5ldyBFcnJvcignZ2V0dGluZyBpbWFnZSBmYWlsZWQuJyk7IH1cbiAgICAgICAgICB0aGlzLl9tYXAuYWRkSW1hZ2UoaW1hZ2VJZCwgaW1hZ2UpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVJlbmRlcmVkRmVhdHVyZXMoKSB7XG4gICAgY29uc3QgZmVhdHVyZXMgPSB0aGlzLnByb21vdGlvbkZlYXR1cmVzKCk7XG4gICAgY29uc3QgZGlzYXBwZWFyZWRGZWF0dXJlczogVGVsZW1ldHJ5QVBJLkZlYXR1cmVbXSA9IFtdO1xuXG4gICAgLy8gZGlzYXBwZWFyZWQgZmVhdHVyZSBvYmplY3RzIHRoYXQgd2FzIHJlbmRlcmVkIGJlZm9yZVxuICAgIHRoaXMuX3JlbmRlcmVkRmVhdHVyZXNBZGlkcyA9IHRoaXMuX3JlbmRlcmVkRmVhdHVyZXNBZGlkcy5maWx0ZXIoKHsgYWRpZCwgdmlzaWJsZVN0YXJ0VGltZSB9KSA9PiB7XG4gICAgICBjb25zdCBpc0V4aXN0ZWQgPSAhIWZlYXR1cmVzLmZpbmQoZmVhdHVyZSA9PiBhZGlkID09PSBmZWF0dXJlLnByb3BlcnRpZXMuYWRpZCk7XG4gICAgICBpZiAoIWlzRXhpc3RlZCkge1xuICAgICAgICBkaXNhcHBlYXJlZEZlYXR1cmVzLnB1c2goeyBhZGlkLCB2aXNpYmxlU3RhcnRUaW1lLCB2aXNpYmxlRW5kVGltZTogRGF0ZS5ub3coKSB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICAvLyBhZGRpbmcgYXBwZWFyZWQgbmV3IGZlYXR1cmUgb2JqZWN0c1xuICAgIGZlYXR1cmVzLmZvckVhY2goZmVhdHVyZSA9PiB7XG4gICAgICBjb25zdCBpc0V4aXN0ZWQgPSAhIXRoaXMuX3JlbmRlcmVkRmVhdHVyZXNBZGlkcy5maW5kKCh7IGFkaWQgfSkgPT4gYWRpZCA9PT0gZmVhdHVyZS5wcm9wZXJ0aWVzLmFkaWQpO1xuICAgICAgaWYgKCFpc0V4aXN0ZWQgJiYgZmVhdHVyZS5wcm9wZXJ0aWVzLmFkaWQpIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZWRGZWF0dXJlc0FkaWRzLnB1c2goe1xuICAgICAgICAgIGFkaWQ6IGZlYXR1cmUucHJvcGVydGllcy5hZGlkLFxuICAgICAgICAgIHZpc2libGVTdGFydFRpbWU6IERhdGUubm93KClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBkaXNhcHBlYXJlZEZlYXR1cmVzLmxlbmd0aCAmJiAoXG4gICAgICB0ZWxlbWV0cnlBUElzLnNlbmRWaXNpYmlsaXRpZXMoZGlzYXBwZWFyZWRGZWF0dXJlcylcbiAgICApO1xuICB9XG5cbiAgLy8gcHJpdmF0ZSBoYXNMaXN0ZW5lcih0eXBlOiBFdmVudFR5cGVzKSB7XG4gIC8vICAgcmV0dXJuICEhdGhpcy5fbGlzdGVuZXJzICYmIHRoaXMuX2xpc3RlbmVyc1t0eXBlXSAmJiB0aGlzLl9saXN0ZW5lcnNbdHlwZV0ubGVuZ3RoID4gMDtcbiAgLy8gfVxuXG4gIHB1YmxpYyBhZGRIYW5kbGVyKGhhbmRsZXI6IE1hcGJveFByb21vdGVkLkhhbmRsZXJzKSB7XG4gICAgaGFuZGxlci5pbml0UHJvbW90ZWQodGhpcyBhcyBhbnkpO1xuICAgIHN3aXRjaCAoaGFuZGxlci5pZCkge1xuICAgICAgY2FzZSAnUHJvbW90aW9uUG9wdXAnOiB7XG4gICAgICAgIHRoaXMuX3Byb21vdGlvblBvcHVwID0gaGFuZGxlciBhcyBQcm9tb3Rpb25Qb3B1cDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGNhc2UgJ1Byb21vdGlvbkNhcmQnOiB7XG4gICAgICAgIHRoaXMuX3Byb21vdGlvbkNhcmQgPSBoYW5kbGVyIGFzIFByb21vdGlvbkNhcmQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBjYXNlICdQcm9tb3Rpb25TaWRlQ2FyZCc6IHtcbiAgICAgICAgdGhpcy5fcHJvbW90aW9uU2lkZUNhcmQgPSBoYW5kbGVyIGFzIFByb21vdGlvblNpZGVDYXJkO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcHJvbW90aW9uRmVhdHVyZXMoKTogRmVhdHVyZVtdIHtcbiAgICBpZiAoIXRoaXMubWFwLmdldExheWVyKHRoaXMuX2xheWVySWQpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGNvbnN0IGZlYXR1cmVzID0gdGhpcy5tYXAucXVlcnlSZW5kZXJlZEZlYXR1cmVzKHVuZGVmaW5lZCwgeyBsYXllcnM6IFt0aGlzLl9sYXllcklkXSB9KTtcbiAgICBjb25zdCBwcm9tb3Rpb25GZWF0dXJlczogRmVhdHVyZVtdID0gW107XG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIGZlYXR1cmVzKSB7XG4gICAgICBmZWF0dXJlLnByb3BlcnRpZXMgJiYgZmVhdHVyZS5wcm9wZXJ0aWVzWydhZGlkJ10gJiYgKFxuICAgICAgICBwcm9tb3Rpb25GZWF0dXJlcy5wdXNoKGZlYXR1cmUgYXMgRmVhdHVyZSlcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBwcm9tb3Rpb25GZWF0dXJlcztcbiAgfVxuXG4gIHB1YmxpYyBzaG93TGF5ZXIoKSB7XG4gICAgdGhpcy5fbWFwLnNldExheW91dFByb3BlcnR5KHRoaXMuX2xheWVySWQsICd2aXNpYmlsaXR5JywgJ25vbmUnKTtcbiAgfVxuXG4gIHB1YmxpYyBoaWRlTGF5ZXIoKSB7XG4gICAgdGhpcy5fbWFwLnNldExheW91dFByb3BlcnR5KHRoaXMuX2xheWVySWQsICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXNlbGVjdExheWVyKCkge1xuICAgIHRoaXMuZGVzZWxlY3RQaW4oKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYXBib3hQcm9tb3RlZDtcbiJdLCJuYW1lcyI6WyJjb25maWciLCJpbnNlcnRFbGVtZW50RW5kcG9pbnQiLCJ0ZWxlbWV0cnlBUElzLnNlc3Npb25TdGFydCIsIkV2ZW50IiwiRVZFTlRfVFlQRVMiLCJmZWF0dXJlIiwidGVsZW1ldHJ5QVBJcy5zZW5kU2VsZWN0aW9uIiwidGVsZW1ldHJ5QVBJcy5zZW5kVmlzaWJpbGl0aWVzIl0sIm1hcHBpbmdzIjoiOztJQUVPLE1BQU0sV0FBVyxHQUFHLENBQUMsT0FBZSxNQUN6QyxHQUFHQSxjQUFNLENBQUMsUUFBUSx3Q0FBd0MsT0FBTyxpQkFBaUJBLGNBQU0s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
