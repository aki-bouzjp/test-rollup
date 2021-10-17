import { c as config, s as sessionStart, E as Event, a as EVENT_TYPES, b as sendSelection, d as sendVisibilities } from './feature-f06192da.js';
import { i as insertElementEndpoint } from './browser-0ec08580.js';
export { default as PromotionPopup } from './promotionPopup.js';
export { default as PromotionCard } from './promotionCard.js';
export { default as PromotionSideCard } from './promotionSideCard.js';
import 'http';
import 'https';
import 'url';
import 'stream';
import 'assert';
import 'zlib';

const getImageUrl = (imageId) => (`${config.BASE_URL}/ads/v1/campaign/resources/creatives/${imageId}?access_token=${config.ACCESS_TOKEN}`);

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
        insertElementEndpoint('mapboxgl-global-style');
        window.addEventListener('load', () => this.activate());
        document.readyState === 'complete' && this.activate();
    }
    get accessToken() {
        return config.ACCESS_TOKEN;
    }
    set accessToken(token) {
        config.ACCESS_TOKEN = token;
    }
    get baseUrl() {
        return config.BASE_URL;
    }
    set baseUrl(url) {
        config.BASE_URL = url;
    }
    get sourceUrl() {
        return config.SOURCE_URL;
    }
    set sourceUrl(sourceUrl) {
        config.SOURCE_URL = sourceUrl;
    }
    get telemetryUrl() {
        return config.TELEMETRY_URL;
    }
    set telemetryUrl(telemetryUrl) {
        config.TELEMETRY_URL = telemetryUrl;
    }
    get debug() {
        return config.DEBUG;
    }
    set debug(debug) {
        config.DEBUG = debug;
    }
    get layerSourceId() {
        return config.LAYER_SOURCE_ID;
    }
    set layerSourceId(layerSourceId) {
        config.LAYER_SOURCE_ID = layerSourceId;
    }
    get mobileMaxWidth() {
        return config.MOBILE_MAX_WIDTH;
    }
    set mobileMaxWidth(mobileMaxWidth) {
        config.MOBILE_MAX_WIDTH = mobileMaxWidth;
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
        window.renderApp && window.renderApp(config);
        sessionStart();
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
        this.fire(new Event(EVENT_TYPES.LOAD, { map: event.target }));
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
        this.fire(new Event(EVENT_TYPES.MOVE, {
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
            const feature = event.features && event.features[0];
            if (!feature) {
                return;
            }
            const { properties } = feature;
            const { adid } = properties;
            if (!adid) {
                return;
            }
            sendSelection(adid, this.map.getZoom());
            this.fire(new Event(EVENT_TYPES.CLICK_PIN, {
                map: event.target,
                originalEvent: event.originalEvent,
                feature,
            }));
            this.show(feature);
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
        disappearedFeatures.length && (sendVisibilities(disappearedFeatures));
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

export { MapboxPromoted, MapboxPromoted as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy91cmxzLnRzIiwiLi4vLi4vc3JjL3V0aWxzL2NvbG9yLnRzIiwiLi4vLi4vc3JjL3V0aWxzL2xheWVyLnRzIiwiLi4vLi4vc3JjL2NvcmUvcHJvbW90ZWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAndXRpbHMvY29uZmlnJztcblxuZXhwb3J0IGNvbnN0IGdldEltYWdlVXJsID0gKGltYWdlSWQ6IHN0cmluZyk6IHN0cmluZyA9PiAoXG4gIGAke2NvbmZpZy5CQVNFX1VSTH0vYWRzL3YxL2NhbXBhaWduL3Jlc291cmNlcy9jcmVhdGl2ZXMvJHtpbWFnZUlkfT9hY2Nlc3NfdG9rZW49JHtjb25maWcuQUNDRVNTX1RPS0VOfWBcbik7XG4iLCJleHBvcnQgY29uc3QgQ09MT1JTID0ge1xuICBGT05UX0NPTE9SX0xJR0hUOiAnIzM3MzczNycsXG4gIEZPTlRfQ09MT1JfREFSSzogJyM2ZTUyM2MnLFxuICBGT05UX0hBTE9fQ09MT1JfTElHSFQ6ICcjMDAwMDAwJyxcbiAgRk9OVF9IQUxPX0NPTE9SX0RBUks6ICcjZjFmMWYxJyxcbiAgU0VMRUNURURfRk9OVF9DT0xPUl9MSUdIVDogJyMzNzM3MzcnLFxuICBTRUxFQ1RFRF9GT05UX0NPTE9SX0RBUks6ICcjZjFmMWYxJyxcbiAgU0VMRUNURURfRk9OVF9IQUxPX0NPTE9SX0xJR0hUOiAnIzAwMDAwMCcsXG4gIFNFTEVDVEVEX0ZPTlRfSEFMT19DT0xPUl9EQVJLOiAnIzZlNTIzYycsXG59O1xuIiwiaW1wb3J0IHsgQ09MT1JTIH0gZnJvbSAndXRpbHMvY29sb3InO1xuXG5leHBvcnQgY29uc3QgTEFZT1VUX1BBUkFNUyA9IHtcbiAgJ2ljb24taW1hZ2UnOiBbJ2dldCcsICdpY29uJ10sXG4gICdpY29uLXNpemUnOiBbXG4gICAgJ2ludGVycG9sYXRlJyxcbiAgICBbJ2V4cG9uZW50aWFsJywgMS41XSxcbiAgICBbJ3pvb20nXSxcbiAgICAxMCwgMC41LCAvLyB6b29tIGlzIDEwIChvciBsZXNzKSAgICAtPiBpY29uIHNpemUgd2lsbCBiZSAwLjVcbiAgICAxNiwgMS4wLCAvLyB6b29tIGlzIDE2IChvciBncmVhdGVyKSAtPiBpY29uIHNpemUgd2lsbCBiZSAxLjBcbiAgXSxcbiAgJ3RleHQtZmllbGQnOiBbJ2dldCcsICduYW1lX2phJ10sXG4gICd0ZXh0LWFuY2hvcic6ICd0b3AnLFxuICAndGV4dC1zaXplJzogW1xuICAgICdpbnRlcnBvbGF0ZScsXG4gICAgWydleHBvbmVudGlhbCcsIDEuNV0sXG4gICAgWyd6b29tJ10sXG4gICAgMTAsIDksXG4gICAgMTYsIDEyLFxuICBdXG59O1xuXG5leHBvcnQgY29uc3QgUEFJTlRfUEFSQU1TID0ge1xuICAndGV4dC1jb2xvcic6IENPTE9SUy5GT05UX0NPTE9SX0RBUkssXG4gICd0ZXh0LWhhbG8tY29sb3InOiBDT0xPUlMuRk9OVF9IQUxPX0NPTE9SX0RBUkssXG4gICd0ZXh0LWhhbG8td2lkdGgnOiAxLjAsXG4gICdpY29uLWhhbG8tY29sb3InOiBDT0xPUlMuRk9OVF9DT0xPUl9EQVJLLFxuICAnaWNvbi1oYWxvLXdpZHRoJzogMS41LFxuICAndGV4dC10cmFuc2xhdGUnOiBbXG4gICAgJ2ludGVycG9sYXRlJyxcbiAgICBbJ2V4cG9uZW50aWFsJywgMS41XSxcbiAgICBbJ3pvb20nXSxcbiAgICAxMCxcbiAgICBbJ2xpdGVyYWwnLCBbMC4wLCAxMi4wXV0sXG4gICAgMTYsXG4gICAgWydsaXRlcmFsJywgWzAuMCwgMjQuMF1dLFxuICBdLFxuICAndGV4dC10cmFuc2xhdGUtYW5jaG9yJzogJ3ZpZXdwb3J0JyxcbiAgJ3RleHQtb3BhY2l0eSc6IFtcbiAgICAnc3RlcCcsXG4gICAgWyd6b29tJ10sXG4gICAgMCxcbiAgICAxNCxcbiAgICAxXG4gIF1cbn07XG5cbmV4cG9ydCBjb25zdCBGSUxURVIgPSBbXG4gICdhbGwnLFxuICBbJz49JywgWyd6b29tJ10sIFsnZ2V0JywgJ21pbl96b29tJ11dLFxuXTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVNlbGVjdGVkVGV4dENvbG9yID0gKGFkaWQ6IHN0cmluZywgaXNEYXJrTW9kZT86IGJvb2xlYW4pID0+IHtcbiAgcmV0dXJuIFtcbiAgICAnY2FzZScsXG4gICAgWyc9PScsIFsnZ2V0JywgJ2FkaWQnXSwgYWRpZF0sXG4gICAgaXNEYXJrTW9kZSA/IENPTE9SUy5TRUxFQ1RFRF9GT05UX0NPTE9SX0xJR0hUIDogQ09MT1JTLlNFTEVDVEVEX0ZPTlRfQ09MT1JfREFSSyxcbiAgICBpc0RhcmtNb2RlID8gQ09MT1JTLkZPTlRfQ09MT1JfTElHSFQgOiBDT0xPUlMuRk9OVF9DT0xPUl9EQVJLLFxuICBdO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVNlbGVjdGVkVGV4dEhhbG9Db2xvciA9IChhZGlkOiBzdHJpbmcsIGlzRGFya01vZGU/OiBib29sZWFuKSA9PiB7XG4gIHJldHVybiBbXG4gICAgJ2Nhc2UnLFxuICAgIFsnPT0nLCBbJ2dldCcsICdhZGlkJ10sIGFkaWRdLFxuICAgIGlzRGFya01vZGUgPyBDT0xPUlMuU0VMRUNURURfRk9OVF9IQUxPX0NPTE9SX0xJR0hUIDogQ09MT1JTLlNFTEVDVEVEX0ZPTlRfSEFMT19DT0xPUl9EQVJLLFxuICAgIGlzRGFya01vZGUgPyBDT0xPUlMuRk9OVF9IQUxPX0NPTE9SX0xJR0hUIDogQ09MT1JTLkZPTlRfSEFMT19DT0xPUl9EQVJLLFxuICBdO1xufTtcbiIsImltcG9ydCBtYXBib3hnbCwgeyBNYXAgfSBmcm9tICdtYXBib3gtZ2wnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAndXRpbHMvY29uZmlnJztcbmltcG9ydCB7IGdldEltYWdlVXJsIH0gZnJvbSAndXRpbHMvdXJscyc7XG5pbXBvcnQgeyBDT0xPUlMgfSBmcm9tICd1dGlscy9jb2xvcic7XG5pbXBvcnQgeyBpbnNlcnRFbGVtZW50RW5kcG9pbnQgfSBmcm9tICd1dGlscy9icm93c2VyJztcbmltcG9ydCB7XG4gIExBWU9VVF9QQVJBTVMsXG4gIFBBSU5UX1BBUkFNUyxcbiAgRklMVEVSLFxuICBjcmVhdGVTZWxlY3RlZFRleHRDb2xvcixcbiAgY3JlYXRlU2VsZWN0ZWRUZXh0SGFsb0NvbG9yLFxufSBmcm9tICd1dGlscy9sYXllcic7XG5pbXBvcnQgeyBFdmVudCB9IGZyb20gJy4vZXZlbnQnO1xuaW1wb3J0IHsgRVZFTlRfVFlQRVMgfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5pbXBvcnQgKiBhcyB0ZWxlbWV0cnlBUElzIGZyb20gJ2FwaXMvdGVsZW1ldHJ5JztcblxuY2xhc3MgTWFwYm94UHJvbW90ZWQgaW1wbGVtZW50cyBNYXBib3hQcm9tb3RlZCB7XG4gIHByaXZhdGUgX21hcDogbWFwYm94Z2wuTWFwO1xuICBwcml2YXRlIF9zb3VyY2U6IG1hcGJveGdsLlZlY3RvclNvdXJjZTtcbiAgcHJpdmF0ZSBfbGF5ZXI6IG1hcGJveGdsLlN5bWJvbExheWVyO1xuICBwcml2YXRlIF9sYXllcklkID0gJ3Byb21vdGlvbi1zeW1ib2xzJztcbiAgcHJpdmF0ZSBfc291cmNlSWQgPSAncHJvbW90aW9ucy1zb3VyY2UnO1xuICBwcml2YXRlIF9pc0RhcmtNb2RlOiBib29sZWFuO1xuICBwcml2YXRlIF9lbmFibGVQcm9tb3Rpb25DYXJkOiBib29sZWFuO1xuICBwcml2YXRlIF9lbmFibGVQcm9tb3Rpb25TaWRlQ2FyZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfcHJvbW90aW9uQ2FyZD86IFByb21vdGlvbkNhcmQ7XG4gIHByaXZhdGUgX3Byb21vdGlvblBvcHVwPzogUHJvbW90aW9uUG9wdXA7XG4gIHByaXZhdGUgX3Byb21vdGlvblNpZGVDYXJkPzogUHJvbW90aW9uU2lkZUNhcmQ7XG4gIHByaXZhdGUgX2xpc3RlbmVyczogTWFwYm94UHJvbW90ZWQuTGlzdGVuZXJzID0ge307XG4gIHByaXZhdGUgX3JlbmRlcmVkRmVhdHVyZXNBZGlkczogeyBhZGlkOiBzdHJpbmc7IHZpc2libGVTdGFydFRpbWU6IG51bWJlcjsgfVtdID0gW107XG5cbiAgY29uc3RydWN0b3IobWFwOiBtYXBib3hnbC5NYXAsIHRva2VuOiBzdHJpbmcsIG9wdGlvbnM6IE1hcGJveFByb21vdGVkLk9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuYWNjZXNzVG9rZW4gPSB0b2tlbjtcblxuICAgIGNvbnN0IHtcbiAgICAgIGJhc2VVcmwsXG4gICAgICBzb3VyY2VVcmwsXG4gICAgICB0ZWxlbWV0cnlVcmwsXG4gICAgICBtb2JpbGVNYXhXaWR0aCxcbiAgICAgIGVuYWJsZVByb21vdGlvbkNhcmQsXG4gICAgICBlbmFibGVQcm9tb3Rpb25TaWRlQ2FyZCxcbiAgICAgIGlzRGFya01vZGUsXG4gICAgICBkZWJ1ZyxcbiAgICB9ID0gb3B0aW9ucztcbiAgICBiYXNlVXJsICYmICh0aGlzLmJhc2VVcmwgPSBiYXNlVXJsKTtcbiAgICBzb3VyY2VVcmwgJiYgKHRoaXMuc291cmNlVXJsID0gc291cmNlVXJsKTtcbiAgICB0ZWxlbWV0cnlVcmwgJiYgKHRoaXMudGVsZW1ldHJ5VXJsID0gdGVsZW1ldHJ5VXJsKTtcbiAgICBkZWJ1ZyAmJiAodGhpcy5kZWJ1ZyA9IGRlYnVnKTtcbiAgICBtb2JpbGVNYXhXaWR0aCAmJiAodGhpcy5tb2JpbGVNYXhXaWR0aCA9IG1vYmlsZU1heFdpZHRoKTtcblxuICAgIHRoaXMuX21hcCA9IG1hcDtcbiAgICB0aGlzLl9zb3VyY2UgPSB7XG4gICAgICB0eXBlOiAndmVjdG9yJyxcbiAgICAgIHVybDogdGhpcy5zb3VyY2VVcmwsXG4gICAgfTtcbiAgICB0aGlzLl9sYXllciA9IHtcbiAgICAgIGlkOiB0aGlzLl9sYXllcklkLFxuICAgICAgdHlwZTogJ3N5bWJvbCcsXG4gICAgICBzb3VyY2U6IHRoaXMuX3NvdXJjZUlkLFxuICAgICAgJ3NvdXJjZS1sYXllcic6IHRoaXMubGF5ZXJTb3VyY2VJZCxcbiAgICAgIGxheW91dDogTEFZT1VUX1BBUkFNUyBhcyBhbnksXG4gICAgICBwYWludDogUEFJTlRfUEFSQU1TIGFzIGFueSxcbiAgICAgIGZpbHRlcjogRklMVEVSLFxuICAgIH07XG5cbiAgICB0aGlzLl9lbmFibGVQcm9tb3Rpb25DYXJkID0gZW5hYmxlUHJvbW90aW9uQ2FyZCB8fCBmYWxzZTtcbiAgICB0aGlzLl9lbmFibGVQcm9tb3Rpb25TaWRlQ2FyZCA9IGVuYWJsZVByb21vdGlvblNpZGVDYXJkIHx8IGZhbHNlO1xuICAgIHRoaXMuX2lzRGFya01vZGUgPSBpc0RhcmtNb2RlIHx8IGZhbHNlO1xuXG4gICAgdGhpcy5fbWFwLm9uKCdsb2FkJywgdGhpcy5sb2FkLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX21hcC5vbigncmVuZGVyJywgdGhpcy5yZW5kZXIuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fbWFwLm9uKCdtb3ZlJywgdGhpcy5tb3ZlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX21hcC5vbignc3R5bGVpbWFnZW1pc3NpbmcnLCB0aGlzLnN0eWxlSW1hZ2VNaXNzaW5nLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX21hcC5vbignY2xpY2snLCB0aGlzLl9sYXllcklkLCB0aGlzLmNsaWNrLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX21hcC5vbignaWRsZScsIHRoaXMuaWRsZS5iaW5kKHRoaXMpKTtcblxuICAgIGluc2VydEVsZW1lbnRFbmRwb2ludCgnbWFwYm94Z2wtZ2xvYmFsLXN0eWxlJyk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHRoaXMuYWN0aXZhdGUoKSk7XG4gICAgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJyAmJiB0aGlzLmFjdGl2YXRlKCk7XG4gIH1cblxuICBnZXQgYWNjZXNzVG9rZW4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gY29uZmlnLkFDQ0VTU19UT0tFTjtcbiAgfVxuXG4gIHNldCBhY2Nlc3NUb2tlbih0b2tlbjogc3RyaW5nKSB7XG4gICAgY29uZmlnLkFDQ0VTU19UT0tFTiA9IHRva2VuO1xuICB9XG5cbiAgZ2V0IGJhc2VVcmwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gY29uZmlnLkJBU0VfVVJMO1xuICB9XG5cbiAgc2V0IGJhc2VVcmwodXJsOiBzdHJpbmcpIHtcbiAgICBjb25maWcuQkFTRV9VUkwgPSB1cmw7XG4gIH1cblxuICBnZXQgc291cmNlVXJsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGNvbmZpZy5TT1VSQ0VfVVJMO1xuICB9XG5cbiAgc2V0IHNvdXJjZVVybChzb3VyY2VVcmw6IHN0cmluZykge1xuICAgIGNvbmZpZy5TT1VSQ0VfVVJMID0gc291cmNlVXJsO1xuICB9XG5cbiAgZ2V0IHRlbGVtZXRyeVVybCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBjb25maWcuVEVMRU1FVFJZX1VSTDtcbiAgfVxuXG4gIHNldCB0ZWxlbWV0cnlVcmwodGVsZW1ldHJ5VXJsOiBzdHJpbmcpIHtcbiAgICBjb25maWcuVEVMRU1FVFJZX1VSTCA9IHRlbGVtZXRyeVVybDtcbiAgfVxuXG4gIGdldCBkZWJ1ZygpIHtcbiAgICByZXR1cm4gY29uZmlnLkRFQlVHO1xuICB9XG5cbiAgc2V0IGRlYnVnKGRlYnVnOiBib29sZWFuKSB7XG4gICAgY29uZmlnLkRFQlVHID0gZGVidWc7XG4gIH1cblxuICBnZXQgbGF5ZXJTb3VyY2VJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBjb25maWcuTEFZRVJfU09VUkNFX0lEO1xuICB9XG5cbiAgc2V0IGxheWVyU291cmNlSWQobGF5ZXJTb3VyY2VJZDogc3RyaW5nKSB7XG4gICAgY29uZmlnLkxBWUVSX1NPVVJDRV9JRCA9IGxheWVyU291cmNlSWQ7XG4gIH1cblxuICBnZXQgbW9iaWxlTWF4V2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29uZmlnLk1PQklMRV9NQVhfV0lEVEg7XG4gIH1cblxuICBzZXQgbW9iaWxlTWF4V2lkdGgobW9iaWxlTWF4V2lkdGg6IG51bWJlcikge1xuICAgIGNvbmZpZy5NT0JJTEVfTUFYX1dJRFRIID0gbW9iaWxlTWF4V2lkdGg7XG4gIH1cblxuICBnZXQgaXNEYXJrTW9kZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNEYXJrTW9kZTtcbiAgfVxuXG4gIHNldCBpc0RhcmtNb2RlKGlzRGFya01vZGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pc0RhcmtNb2RlID0gaXNEYXJrTW9kZTtcbiAgfVxuXG4gIGdldCBtYXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcDtcbiAgfVxuXG4gIGdldCBsYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwLmdldExheWVyKHRoaXMuX2xheWVySWQpO1xuICB9XG5cbiAgZ2V0IGVuYWJsZVByb21vdGlvblBvcHVwKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5fZW5hYmxlUHJvbW90aW9uQ2FyZCAmJiAhdGhpcy5fZW5hYmxlUHJvbW90aW9uU2lkZUNhcmQ7XG4gIH1cblxuICBzZXQgZW5hYmxlUHJvbW90aW9uUG9wdXAoZW5hYmxlUHJvbW90aW9uUG9wdXA6IGJvb2xlYW4pIHtcbiAgICBpZiAoZW5hYmxlUHJvbW90aW9uUG9wdXApIHtcbiAgICAgIHRoaXMuX2VuYWJsZVByb21vdGlvbkNhcmQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2VuYWJsZVByb21vdGlvblNpZGVDYXJkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VuYWJsZVByb21vdGlvbkNhcmQgPSB0cnVlO1xuICAgICAgdGhpcy5fZW5hYmxlUHJvbW90aW9uU2lkZUNhcmQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBnZXQgZW5hYmxlUHJvbW90aW9uQ2FyZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlUHJvbW90aW9uQ2FyZDtcbiAgfVxuXG4gIHNldCBlbmFibGVQcm9tb3Rpb25DYXJkKGVuYWJsZVByb21vdGlvbkNhcmQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbmFibGVQcm9tb3Rpb25DYXJkID0gZW5hYmxlUHJvbW90aW9uQ2FyZDtcbiAgICB0aGlzLl9lbmFibGVQcm9tb3Rpb25TaWRlQ2FyZCA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0IGVuYWJsZVByb21vdGlvblNpZGVDYXJkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9lbmFibGVQcm9tb3Rpb25TaWRlQ2FyZDtcbiAgfVxuXG4gIHNldCBlbmFibGVQcm9tb3Rpb25TaWRlQ2FyZChlbmFibGVQcm9tb3Rpb25TaWRlQ2FyZDogYm9vbGVhbikge1xuICAgIHRoaXMuX2VuYWJsZVByb21vdGlvbkNhcmQgPSBmYWxzZTtcbiAgICB0aGlzLl9lbmFibGVQcm9tb3Rpb25TaWRlQ2FyZCA9IGVuYWJsZVByb21vdGlvblNpZGVDYXJkO1xuICB9XG5cbiAgcHJpdmF0ZSBhY3RpdmF0ZSgpIHtcbiAgICB3aW5kb3cucmVuZGVyQXBwICYmIHdpbmRvdy5yZW5kZXJBcHAoY29uZmlnKTtcbiAgICB0ZWxlbWV0cnlBUElzLnNlc3Npb25TdGFydCgpO1xuICB9XG4gIFxuICBwcml2YXRlIHJlbG9hZFByb21vdGlvbkxhbHllcigpIHtcbiAgICBpZiAodGhpcy5fbWFwLmdldFNvdXJjZSh0aGlzLl9zb3VyY2VJZCkpIHtcbiAgICAgIHRoaXMuX21hcC5yZW1vdmVTb3VyY2UodGhpcy5fc291cmNlSWQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fbWFwLmdldExheWVyKHRoaXMuX2xheWVySWQpKSB7XG4gICAgICB0aGlzLl9tYXAucmVtb3ZlTGF5ZXIodGhpcy5fbGF5ZXJJZCk7XG4gICAgfVxuICAgIHRoaXMuX21hcC5hZGRTb3VyY2UodGhpcy5fc291cmNlSWQsIHRoaXMuX3NvdXJjZSk7XG4gICAgdGhpcy5fbWFwLmFkZExheWVyKHRoaXMuX2xheWVyKTtcbiAgfVxuXG4gIHByaXZhdGUgbG9hZChldmVudDogeyB0YXJnZXQ6IE1hcCB9KSB7XG4gICAgdGhpcy5maXJlKG5ldyBFdmVudChFVkVOVF9UWVBFUy5MT0FELCB7IG1hcDogZXZlbnQudGFyZ2V0IH0pKTtcbiAgICB0aGlzLnJlbG9hZFByb21vdGlvbkxhbHllcigpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXIoX2V2ZW50OiB7IHRhcmdldDogTWFwIH0pIHtcbiAgICB0aGlzLnVwZGF0ZVJlbmRlcmVkRmVhdHVyZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZShldmVudDogbWFwYm94Z2wuTWFwYm94RXZlbnQ8YW55PiAmIG1hcGJveGdsLkV2ZW50RGF0YSkge1xuICAgIGNvbnN0IGZlYXR1cmVzID0gdGhpcy5tYXAucXVlcnlSZW5kZXJlZEZlYXR1cmVzKHVuZGVmaW5lZCwgeyBsYXllcnM6IFt0aGlzLl9sYXllcklkXSB9KTtcbiAgICBjb25zdCBwcm9tb3Rpb25GZWF0dXJlcyA9IFtdO1xuICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiBmZWF0dXJlcykge1xuICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzICYmIGZlYXR1cmUucHJvcGVydGllc1snYWRpZCddICYmIHByb21vdGlvbkZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgfVxuICAgIHRoaXMuZmlyZShcbiAgICAgIG5ldyBFdmVudChFVkVOVF9UWVBFUy5NT1ZFLCB7XG4gICAgICAgIG1hcDogZXZlbnQudGFyZ2V0LFxuICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudC5vcmlnaW5hbEV2ZW50LFxuICAgICAgICBmZWF0dXJlczogcHJvbW90aW9uRmVhdHVyZXNcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2hvdyhmZWF0dXJlOiBGZWF0dXJlKSB7XG4gICAgaWYgKHRoaXMuX2VuYWJsZVByb21vdGlvblNpZGVDYXJkKSB7XG4gICAgICBpZiAoIXRoaXMuX3Byb21vdGlvblNpZGVDYXJkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSXQgbmVlZHMgdG8gYmUgYWRkZWQgUHJvbW90aW9uU2lkZUNhcmQgaGFuZGxlci4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3Byb21vdGlvblNpZGVDYXJkLnNob3coZmVhdHVyZSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2VuYWJsZVByb21vdGlvbkNhcmQpIHtcbiAgICAgIGlmICghdGhpcy5fcHJvbW90aW9uQ2FyZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0l0IG5lZWRzIHRvIGJlIGFkZGVkIFByb21vdGlvbkNhcmQgaGFuZGxlci4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3Byb21vdGlvbkNhcmQuc2hvdyhmZWF0dXJlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCF0aGlzLl9wcm9tb3Rpb25Qb3B1cCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0l0IG5lZWRzIHRvIGJlIGFkZGVkIFByb21vdGlvblBvcHVwIGhhbmRsZXIuJyk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wcm9tb3Rpb25Qb3B1cC5zaG93KGZlYXR1cmUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2xpY2soZXZlbnQ6IG1hcGJveGdsLk1hcE1vdXNlRXZlbnQgJiB7IGZlYXR1cmVzPzogbWFwYm94Z2wuTWFwYm94R2VvSlNPTkZlYXR1cmVbXSB8IHVuZGVmaW5lZDsgfSAmIG1hcGJveGdsLkV2ZW50RGF0YSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBmZWF0dXJlID0gZXZlbnQuZmVhdHVyZXMgJiYgZXZlbnQuZmVhdHVyZXNbMF0gYXMgRmVhdHVyZTtcbiAgICAgIGlmICghZmVhdHVyZSkgeyByZXR1cm47IH1cbiAgICAgIGNvbnN0IHsgcHJvcGVydGllcyB9ID0gZmVhdHVyZTtcbiAgICAgIGNvbnN0IHsgYWRpZCB9ID0gcHJvcGVydGllcztcbiAgICAgIGlmICghYWRpZCkgeyByZXR1cm47IH1cblxuICAgICAgdGVsZW1ldHJ5QVBJcy5zZW5kU2VsZWN0aW9uKGFkaWQsIHRoaXMubWFwLmdldFpvb20oKSk7XG4gICAgICB0aGlzLmZpcmUobmV3IEV2ZW50KEVWRU5UX1RZUEVTLkNMSUNLX1BJTiwge1xuICAgICAgICBtYXA6IGV2ZW50LnRhcmdldCxcbiAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQub3JpZ2luYWxFdmVudCxcbiAgICAgICAgZmVhdHVyZSxcbiAgICAgIH0pKTtcbiAgICAgIHRoaXMuc2hvdyhmZWF0dXJlKTtcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGlkbGUoX2V2ZW50OiBtYXBib3hnbC5NYXBib3hFdmVudCkge1xuICAgIGlmIChcbiAgICAgICF0aGlzLm1hcC5nZXRMYXllcih0aGlzLl9sYXllcklkKSB8fFxuICAgICAgIXRoaXMubWFwLmdldFNvdXJjZSh0aGlzLl9zb3VyY2VJZClcbiAgICApIHtcbiAgICAgIHRoaXMucmVsb2FkUHJvbW90aW9uTGFseWVyKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uKHR5cGU6IE1hcGJveFByb21vdGVkLkV2ZW50VHlwZXMsIGxpc3RlbmVyOiBNYXBib3hQcm9tb3RlZC5MaXN0ZW5lcikge1xuICAgIGNvbnN0IGxpc3RlbmVyRXhpc3RzID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdICYmIHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKSAhPT0gLTE7XG4gICAgaWYgKCFsaXN0ZW5lckV4aXN0cykge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW3R5cGVdID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdIHx8IFtdO1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvZmYodHlwZTogTWFwYm94UHJvbW90ZWQuRXZlbnRUeXBlcywgbGlzdGVuZXI6IE1hcGJveFByb21vdGVkLkxpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycyAmJiB0aGlzLl9saXN0ZW5lcnNbdHlwZV0pIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnNbdHlwZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZmlyZShldmVudDogRXZlbnQpIHtcbiAgICBjb25zdCB7IHR5cGUsIGRhdGEgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycyAmJiB0aGlzLl9saXN0ZW5lcnNbdHlwZV0gPyB0aGlzLl9saXN0ZW5lcnNbdHlwZV0uc2xpY2UoKSA6IFtdO1xuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgbGlzdGVuZXJzKSB7XG4gICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIHR5cGUsIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZWxlY3RQaW4oZmVhdHVyZTogRmVhdHVyZSkge1xuICAgIGNvbnN0IHsgYWRpZCB9ID0gZmVhdHVyZS5wcm9wZXJ0aWVzIGFzIEZlYXR1cmUuUHJvcGVydGllcztcbiAgICBpZiAoIWFkaWQpIHsgcmV0dXJuOyB9XG4gICAgY29uc3QgdGV4dENvbG9yID0gY3JlYXRlU2VsZWN0ZWRUZXh0Q29sb3IoYWRpZCk7XG4gICAgY29uc3QgdGV4dEhhbG9Db2xvciA9IGNyZWF0ZVNlbGVjdGVkVGV4dEhhbG9Db2xvcihhZGlkKTtcbiAgICB0aGlzLl9tYXAuc2V0UGFpbnRQcm9wZXJ0eSh0aGlzLl9sYXllcklkLCAndGV4dC1jb2xvcicsIHRleHRDb2xvcik7XG4gICAgdGhpcy5fbWFwLnNldFBhaW50UHJvcGVydHkodGhpcy5fbGF5ZXJJZCwgJ3RleHQtaGFsby1jb2xvcicsIHRleHRIYWxvQ29sb3IpO1xuICB9XG5cbiAgcHVibGljIGRlc2VsZWN0UGluKCkge1xuICAgIHRoaXMuX21hcC5zZXRQYWludFByb3BlcnR5KFxuICAgICAgdGhpcy5fbGF5ZXJJZCxcbiAgICAgICd0ZXh0LWNvbG9yJyxcbiAgICAgIHRoaXMuaXNEYXJrTW9kZSA/IENPTE9SUy5GT05UX0NPTE9SX0xJR0hUIDogQ09MT1JTLkZPTlRfQ09MT1JfREFSSyxcbiAgICApO1xuICAgIHRoaXMuX21hcC5zZXRQYWludFByb3BlcnR5KFxuICAgICAgdGhpcy5fbGF5ZXJJZCxcbiAgICAgICd0ZXh0LWhhbG8tY29sb3InLFxuICAgICAgdGhpcy5pc0RhcmtNb2RlID8gQ09MT1JTLkZPTlRfSEFMT19DT0xPUl9MSUdIVCA6IENPTE9SUy5GT05UX0hBTE9fQ09MT1JfREFSSyxcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBzdHlsZUltYWdlTWlzc2luZyhldmVudDogYW55KSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGltYWdlSWQ6IHN0cmluZyA9IGV2ZW50LmlkO1xuICAgICAgaWYgKFxuICAgICAgICBpbWFnZUlkICYmXG4gICAgICAgICF0aGlzLl9tYXAuaGFzSW1hZ2UoaW1hZ2VJZCkgJiZcbiAgICAgICAgaW1hZ2VJZC5tYXRjaCgvXihbYS16QS1aMC05XXsyMSwyMn0pJC8pXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgdXJsID0gZ2V0SW1hZ2VVcmwoaW1hZ2VJZCk7XG4gICAgICAgIHRoaXMuX21hcC5sb2FkSW1hZ2UodXJsLCAoZXJyb3I/OiBFcnJvciwgaW1hZ2U/OiBIVE1MSW1hZ2VFbGVtZW50IHwgSW1hZ2VCaXRtYXApID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHsgdGhyb3cgZXJyb3I7IH1cbiAgICAgICAgICBpZiAoIWltYWdlKSB7IHRocm93IG5ldyBFcnJvcignZ2V0dGluZyBpbWFnZSBmYWlsZWQuJyk7IH1cbiAgICAgICAgICB0aGlzLl9tYXAuYWRkSW1hZ2UoaW1hZ2VJZCwgaW1hZ2UpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVJlbmRlcmVkRmVhdHVyZXMoKSB7XG4gICAgY29uc3QgZmVhdHVyZXMgPSB0aGlzLnByb21vdGlvbkZlYXR1cmVzKCk7XG4gICAgY29uc3QgZGlzYXBwZWFyZWRGZWF0dXJlczogVGVsZW1ldHJ5QVBJLkZlYXR1cmVbXSA9IFtdO1xuXG4gICAgLy8gZGlzYXBwZWFyZWQgZmVhdHVyZSBvYmplY3RzIHRoYXQgd2FzIHJlbmRlcmVkIGJlZm9yZVxuICAgIHRoaXMuX3JlbmRlcmVkRmVhdHVyZXNBZGlkcyA9IHRoaXMuX3JlbmRlcmVkRmVhdHVyZXNBZGlkcy5maWx0ZXIoKHsgYWRpZCwgdmlzaWJsZVN0YXJ0VGltZSB9KSA9PiB7XG4gICAgICBjb25zdCBpc0V4aXN0ZWQgPSAhIWZlYXR1cmVzLmZpbmQoZmVhdHVyZSA9PiBhZGlkID09PSBmZWF0dXJlLnByb3BlcnRpZXMuYWRpZCk7XG4gICAgICBpZiAoIWlzRXhpc3RlZCkge1xuICAgICAgICBkaXNhcHBlYXJlZEZlYXR1cmVzLnB1c2goeyBhZGlkLCB2aXNpYmxlU3RhcnRUaW1lLCB2aXNpYmxlRW5kVGltZTogRGF0ZS5ub3coKSB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICAvLyBhZGRpbmcgYXBwZWFyZWQgbmV3IGZlYXR1cmUgb2JqZWN0c1xuICAgIGZlYXR1cmVzLmZvckVhY2goZmVhdHVyZSA9PiB7XG4gICAgICBjb25zdCBpc0V4aXN0ZWQgPSAhIXRoaXMuX3JlbmRlcmVkRmVhdHVyZXNBZGlkcy5maW5kKCh7IGFkaWQgfSkgPT4gYWRpZCA9PT0gZmVhdHVyZS5wcm9wZXJ0aWVzLmFkaWQpO1xuICAgICAgaWYgKCFpc0V4aXN0ZWQgJiYgZmVhdHVyZS5wcm9wZXJ0aWVzLmFkaWQpIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZWRGZWF0dXJlc0FkaWRzLnB1c2goe1xuICAgICAgICAgIGFkaWQ6IGZlYXR1cmUucHJvcGVydGllcy5hZGlkLFxuICAgICAgICAgIHZpc2libGVTdGFydFRpbWU6IERhdGUubm93KClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBkaXNhcHBlYXJlZEZlYXR1cmVzLmxlbmd0aCAmJiAoXG4gICAgICB0ZWxlbWV0cnlBUElzLnNlbmRWaXNpYmlsaXRpZXMoZGlzYXBwZWFyZWRGZWF0dXJlcylcbiAgICApO1xuICB9XG5cbiAgLy8gcHJpdmF0ZSBoYXNMaXN0ZW5lcih0eXBlOiBFdmVudFR5cGVzKSB7XG4gIC8vICAgcmV0dXJuICEhdGhpcy5fbGlzdGVuZXJzICYmIHRoaXMuX2xpc3RlbmVyc1t0eXBlXSAmJiB0aGlzLl9saXN0ZW5lcnNbdHlwZV0ubGVuZ3RoID4gMDtcbiAgLy8gfVxuXG4gIHB1YmxpYyBhZGRIYW5kbGVyKGhhbmRsZXI6IE1hcGJveFByb21vdGVkLkhhbmRsZXJzKSB7XG4gICAgaGFuZGxlci5pbml0UHJvbW90ZWQodGhpcyBhcyBhbnkpO1xuICAgIHN3aXRjaCAoaGFuZGxlci5pZCkge1xuICAgICAgY2FzZSAnUHJvbW90aW9uUG9wdXAnOiB7XG4gICAgICAgIHRoaXMuX3Byb21vdGlvblBvcHVwID0gaGFuZGxlciBhcyBQcm9tb3Rpb25Qb3B1cDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGNhc2UgJ1Byb21vdGlvbkNhcmQnOiB7XG4gICAgICAgIHRoaXMuX3Byb21vdGlvbkNhcmQgPSBoYW5kbGVyIGFzIFByb21vdGlvbkNhcmQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBjYXNlICdQcm9tb3Rpb25TaWRlQ2FyZCc6IHtcbiAgICAgICAgdGhpcy5fcHJvbW90aW9uU2lkZUNhcmQgPSBoYW5kbGVyIGFzIFByb21vdGlvblNpZGVDYXJkO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcHJvbW90aW9uRmVhdHVyZXMoKTogRmVhdHVyZVtdIHtcbiAgICBpZiAoIXRoaXMubWFwLmdldExheWVyKHRoaXMuX2xheWVySWQpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGNvbnN0IGZlYXR1cmVzID0gdGhpcy5tYXAucXVlcnlSZW5kZXJlZEZlYXR1cmVzKHVuZGVmaW5lZCwgeyBsYXllcnM6IFt0aGlzLl9sYXllcklkXSB9KTtcbiAgICBjb25zdCBwcm9tb3Rpb25GZWF0dXJlczogRmVhdHVyZVtdID0gW107XG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIGZlYXR1cmVzKSB7XG4gICAgICBmZWF0dXJlLnByb3BlcnRpZXMgJiYgZmVhdHVyZS5wcm9wZXJ0aWVzWydhZGlkJ10gJiYgKFxuICAgICAgICBwcm9tb3Rpb25GZWF0dXJlcy5wdXNoKGZlYXR1cmUgYXMgRmVhdHVyZSlcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBwcm9tb3Rpb25GZWF0dXJlcztcbiAgfVxuXG4gIHB1YmxpYyBzaG93TGF5ZXIoKSB7XG4gICAgdGhpcy5fbWFwLnNldExheW91dFByb3BlcnR5KHRoaXMuX2xheWVySWQsICd2aXNpYmlsaXR5JywgJ25vbmUnKTtcbiAgfVxuXG4gIHB1YmxpYyBoaWRlTGF5ZXIoKSB7XG4gICAgdGhpcy5fbWFwLnNldExheW91dFByb3BlcnR5KHRoaXMuX2xheWVySWQsICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXNlbGVjdExheWVyKCkge1xuICAgIHRoaXMuZGVzZWxlY3RQaW4oKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYXBib3hQcm9tb3RlZDtcbiJdLCJuYW1lcyI6WyJ0ZWxlbWV0cnlBUElzLnNlc3Npb25TdGFydCIsInRlbGVtZXRyeUFQSXMuc2VuZFNlbGVjdGlvbiIsInRlbGVtZXRyeUFQSXMuc2VuZFZpc2liaWxpdGllcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRU8sTUFBTSxXQUFXLEdBQUcsQ0FBQyxPQUFlLE1BQ3pDLEdBQUcsTUFBTSxDQUFDLFFBQVEsd0NBQXdDLE9BQU8saUJBQWlCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FDeEc7O0FDSk0sTUFBTSxNQUFNLEdBQUc7SUFDcEIsZ0JBQWdCLEVB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
