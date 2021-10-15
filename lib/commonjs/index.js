'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var feature = require('./feature-54323509.js');
var browser = require('./browser-ef557d00.js');
var promotionPopup = require('./promotionPopup.js');
var promotionCard = require('./promotionCard.js');
var promotionSideCard = require('./promotionSideCard.js');
require('axios');
require('date-fns');
require('mapbox-gl');

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

require('./shim');

require('./modules/core.dict');

require('./modules/core.get-iterator-method');

require('./modules/core.get-iterator');

require('./modules/core.is-iterable');

require('./modules/core.delay');

require('./modules/core.function.part');

require('./modules/core.object.is-object');

require('./modules/core.object.classof');

require('./modules/core.object.define');

require('./modules/core.object.make');

require('./modules/core.number.iterator');

require('./modules/core.regexp.escape');

require('./modules/core.string.escape-html');

require('./modules/core.string.unescape-html');

module.exports = require('./modules/_core');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy91cmxzLnRzIiwiLi4vLi4vc3JjL3V0aWxzL2NvbG9yLnRzIiwiLi4vLi4vc3JjL3V0aWxzL2xheWVyLnRzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW5kZXguanMiLCIuLi8uLi9zcmMvY29yZS9wcm9tb3RlZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb25maWcgfSBmcm9tICd1dGlscy9jb25maWcnO1xuXG5leHBvcnQgY29uc3QgZ2V0SW1hZ2VVcmwgPSAoaW1hZ2VJZDogc3RyaW5nKTogc3RyaW5nID0+IChcbiAgYCR7Y29uZmlnLkJBU0VfVVJMfS9hZHMvdjEvY2FtcGFpZ24vcmVzb3VyY2VzL2NyZWF0aXZlcy8ke2ltYWdlSWR9P2FjY2Vzc190b2tlbj0ke2NvbmZpZy5BQ0NFU1NfVE9LRU59YFxuKTtcbiIsImV4cG9ydCBjb25zdCBDT0xPUlMgPSB7XG4gIEZPTlRfQ09MT1JfTElHSFQ6ICcjMzczNzM3JyxcbiAgRk9OVF9DT0xPUl9EQVJLOiAnIzZlNTIzYycsXG4gIEZPTlRfSEFMT19DT0xPUl9MSUdIVDogJyMwMDAwMDAnLFxuICBGT05UX0hBTE9fQ09MT1JfREFSSzogJyNmMWYxZjEnLFxuICBTRUxFQ1RFRF9GT05UX0NPTE9SX0xJR0hUOiAnIzM3MzczNycsXG4gIFNFTEVDVEVEX0ZPTlRfQ09MT1JfREFSSzogJyNmMWYxZjEnLFxuICBTRUxFQ1RFRF9GT05UX0hBTE9fQ09MT1JfTElHSFQ6ICcjMDAwMDAwJyxcbiAgU0VMRUNURURfRk9OVF9IQUxPX0NPTE9SX0RBUks6ICcjNmU1MjNjJyxcbn07XG4iLCJpbXBvcnQgeyBDT0xPUlMgfSBmcm9tICd1dGlscy9jb2xvcic7XG5cbmV4cG9ydCBjb25zdCBMQVlPVVRfUEFSQU1TID0ge1xuICAnaWNvbi1pbWFnZSc6IFsnZ2V0JywgJ2ljb24nXSxcbiAgJ2ljb24tc2l6ZSc6IFtcbiAgICAnaW50ZXJwb2xhdGUnLFxuICAgIFsnZXhwb25lbnRpYWwnLCAxLjVdLFxuICAgIFsnem9vbSddLFxuICAgIDEwLCAwLjUsIC8vIHpvb20gaXMgMTAgKG9yIGxlc3MpICAgIC0+IGljb24gc2l6ZSB3aWxsIGJlIDAuNVxuICAgIDE2LCAxLjAsIC8vIHpvb20gaXMgMTYgKG9yIGdyZWF0ZXIpIC0+IGljb24gc2l6ZSB3aWxsIGJlIDEuMFxuICBdLFxuICAndGV4dC1maWVsZCc6IFsnZ2V0JywgJ25hbWVfamEnXSxcbiAgJ3RleHQtYW5jaG9yJzogJ3RvcCcsXG4gICd0ZXh0LXNpemUnOiBbXG4gICAgJ2ludGVycG9sYXRlJyxcbiAgICBbJ2V4cG9uZW50aWFsJywgMS41XSxcbiAgICBbJ3pvb20nXSxcbiAgICAxMCwgOSxcbiAgICAxNiwgMTIsXG4gIF1cbn07XG5cbmV4cG9ydCBjb25zdCBQQUlOVF9QQVJBTVMgPSB7XG4gICd0ZXh0LWNvbG9yJzogQ09MT1JTLkZPTlRfQ09MT1JfREFSSyxcbiAgJ3RleHQtaGFsby1jb2xvcic6IENPTE9SUy5GT05UX0hBTE9fQ09MT1JfREFSSyxcbiAgJ3RleHQtaGFsby13aWR0aCc6IDEuMCxcbiAgJ2ljb24taGFsby1jb2xvcic6IENPTE9SUy5GT05UX0NPTE9SX0RBUkssXG4gICdpY29uLWhhbG8td2lkdGgnOiAxLjUsXG4gICd0ZXh0LXRyYW5zbGF0ZSc6IFtcbiAgICAnaW50ZXJwb2xhdGUnLFxuICAgIFsnZXhwb25lbnRpYWwnLCAxLjVdLFxuICAgIFsnem9vbSddLFxuICAgIDEwLFxuICAgIFsnbGl0ZXJhbCcsIFswLjAsIDEyLjBdXSxcbiAgICAxNixcbiAgICBbJ2xpdGVyYWwnLCBbMC4wLCAyNC4wXV0sXG4gIF0sXG4gICd0ZXh0LXRyYW5zbGF0ZS1hbmNob3InOiAndmlld3BvcnQnLFxuICAndGV4dC1vcGFjaXR5JzogW1xuICAgICdzdGVwJyxcbiAgICBbJ3pvb20nXSxcbiAgICAwLFxuICAgIDE0LFxuICAgIDFcbiAgXVxufTtcblxuZXhwb3J0IGNvbnN0IEZJTFRFUiA9IFtcbiAgJ2FsbCcsXG4gIFsnPj0nLCBbJ3pvb20nXSwgWydnZXQnLCAnbWluX3pvb20nXV0sXG5dO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlU2VsZWN0ZWRUZXh0Q29sb3IgPSAoYWRpZDogc3RyaW5nLCBpc0RhcmtNb2RlPzogYm9vbGVhbikgPT4ge1xuICByZXR1cm4gW1xuICAgICdjYXNlJyxcbiAgICBbJz09JywgWydnZXQnLCAnYWRpZCddLCBhZGlkXSxcbiAgICBpc0RhcmtNb2RlID8gQ09MT1JTLlNFTEVDVEVEX0ZPTlRfQ09MT1JfTElHSFQgOiBDT0xPUlMuU0VMRUNURURfRk9OVF9DT0xPUl9EQVJLLFxuICAgIGlzRGFya01vZGUgPyBDT0xPUlMuRk9OVF9DT0xPUl9MSUdIVCA6IENPTE9SUy5GT05UX0NPTE9SX0RBUkssXG4gIF07XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlU2VsZWN0ZWRUZXh0SGFsb0NvbG9yID0gKGFkaWQ6IHN0cmluZywgaXNEYXJrTW9kZT86IGJvb2xlYW4pID0+IHtcbiAgcmV0dXJuIFtcbiAgICAnY2FzZScsXG4gICAgWyc9PScsIFsnZ2V0JywgJ2FkaWQnXSwgYWRpZF0sXG4gICAgaXNEYXJrTW9kZSA/IENPTE9SUy5TRUxFQ1RFRF9GT05UX0hBTE9fQ09MT1JfTElHSFQgOiBDT0xPUlMuU0VMRUNURURfRk9OVF9IQUxPX0NPTE9SX0RBUkssXG4gICAgaXNEYXJrTW9kZSA/IENPTE9SUy5GT05UX0hBTE9fQ09MT1JfTElHSFQgOiBDT0xPUlMuRk9OVF9IQUxPX0NPTE9SX0RBUkssXG4gIF07XG59O1xuIiwicmVxdWlyZSgnLi9zaGltJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS5kaWN0Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9jb3JlLmlzLWl0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS5kZWxheScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2NvcmUuZnVuY3Rpb24ucGFydCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2NvcmUub2JqZWN0LmlzLW9iamVjdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2NvcmUub2JqZWN0LmNsYXNzb2YnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9jb3JlLm9iamVjdC5kZWZpbmUnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9jb3JlLm9iamVjdC5tYWtlJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS5udW1iZXIuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9jb3JlLnJlZ2V4cC5lc2NhcGUnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9jb3JlLnN0cmluZy5lc2NhcGUtaHRtbCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2NvcmUuc3RyaW5nLnVuZXNjYXBlLWh0bWwnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9tb2R1bGVzL19jb3JlJyk7XG4iLCJpbXBvcnQgbWFwYm94Z2wsIHsgTWFwIH0gZnJvbSAnbWFwYm94LWdsJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJ3V0aWxzL2NvbmZpZyc7XG5pbXBvcnQgeyBnZXRJbWFnZVVybCB9IGZyb20gJ3V0aWxzL3VybHMnO1xuaW1wb3J0IHsgQ09MT1JTIH0gZnJvbSAndXRpbHMvY29sb3InO1xuaW1wb3J0IHsgaW5zZXJ0RWxlbWVudEVuZHBvaW50IH0gZnJvbSAndXRpbHMvYnJvd3Nlcic7XG5pbXBvcnQge1xuICBMQVlPVVRfUEFSQU1TLFxuICBQQUlOVF9QQVJBTVMsXG4gIEZJTFRFUixcbiAgY3JlYXRlU2VsZWN0ZWRUZXh0Q29sb3IsXG4gIGNyZWF0ZVNlbGVjdGVkVGV4dEhhbG9Db2xvcixcbn0gZnJvbSAndXRpbHMvbGF5ZXInO1xuaW1wb3J0IHsgRXZlbnQgfSBmcm9tICcuL2V2ZW50JztcbmltcG9ydCB7IEVWRU5UX1RZUEVTIH0gZnJvbSAnLi9oZWxwZXJzJztcblxuaW1wb3J0ICogYXMgdGVsZW1ldHJ5QVBJcyBmcm9tICdhcGlzL3RlbGVtZXRyeSc7XG5cbmltcG9ydCAnY29yZS1qcyc7XG5cbmNsYXNzIE1hcGJveFByb21vdGVkIGltcGxlbWVudHMgTWFwYm94UHJvbW90ZWQge1xuICBwcml2YXRlIF9tYXA6IG1hcGJveGdsLk1hcDtcbiAgcHJpdmF0ZSBfc291cmNlOiBtYXBib3hnbC5WZWN0b3JTb3VyY2U7XG4gIHByaXZhdGUgX2xheWVyOiBtYXBib3hnbC5TeW1ib2xMYXllcjtcbiAgcHJpdmF0ZSBfbGF5ZXJJZCA9ICdwcm9tb3Rpb24tc3ltYm9scyc7XG4gIHByaXZhdGUgX3NvdXJjZUlkID0gJ3Byb21vdGlvbnMtc291cmNlJztcbiAgcHJpdmF0ZSBfaXNEYXJrTW9kZTogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfZW5hYmxlUHJvbW90aW9uQ2FyZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfZW5hYmxlUHJvbW90aW9uU2lkZUNhcmQ6IGJvb2xlYW47XG4gIHByaXZhdGUgX3Byb21vdGlvbkNhcmQ/OiBQcm9tb3Rpb25DYXJkO1xuICBwcml2YXRlIF9wcm9tb3Rpb25Qb3B1cD86IFByb21vdGlvblBvcHVwO1xuICBwcml2YXRlIF9wcm9tb3Rpb25TaWRlQ2FyZD86IFByb21vdGlvblNpZGVDYXJkO1xuICBwcml2YXRlIF9saXN0ZW5lcnM6IE1hcGJveFByb21vdGVkLkxpc3RlbmVycyA9IHt9O1xuICBwcml2YXRlIF9yZW5kZXJlZEZlYXR1cmVzQWRpZHM6IHsgYWRpZDogc3RyaW5nOyB2aXNpYmxlU3RhcnRUaW1lOiBudW1iZXI7IH1bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKG1hcDogbWFwYm94Z2wuTWFwLCB0b2tlbjogc3RyaW5nLCBvcHRpb25zOiBNYXBib3hQcm9tb3RlZC5PcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmFjY2Vzc1Rva2VuID0gdG9rZW47XG5cbiAgICBjb25zdCB7XG4gICAgICBiYXNlVXJsLFxuICAgICAgc291cmNlVXJsLFxuICAgICAgdGVsZW1ldHJ5VXJsLFxuICAgICAgbW9iaWxlTWF4V2lkdGgsXG4gICAgICBlbmFibGVQcm9tb3Rpb25DYXJkLFxuICAgICAgZW5hYmxlUHJvbW90aW9uU2lkZUNhcmQsXG4gICAgICBpc0RhcmtNb2RlLFxuICAgICAgZGVidWcsXG4gICAgfSA9IG9wdGlvbnM7XG4gICAgYmFzZVVybCAmJiAodGhpcy5iYXNlVXJsID0gYmFzZVVybCk7XG4gICAgc291cmNlVXJsICYmICh0aGlzLnNvdXJjZVVybCA9IHNvdXJjZVVybCk7XG4gICAgdGVsZW1ldHJ5VXJsICYmICh0aGlzLnRlbGVtZXRyeVVybCA9IHRlbGVtZXRyeVVybCk7XG4gICAgZGVidWcgJiYgKHRoaXMuZGVidWcgPSBkZWJ1Zyk7XG4gICAgbW9iaWxlTWF4V2lkdGggJiYgKHRoaXMubW9iaWxlTWF4V2lkdGggPSBtb2JpbGVNYXhXaWR0aCk7XG5cbiAgICB0aGlzLl9tYXAgPSBtYXA7XG4gICAgdGhpcy5fc291cmNlID0ge1xuICAgICAgdHlwZTogJ3ZlY3RvcicsXG4gICAgICB1cmw6IHRoaXMuc291cmNlVXJsLFxuICAgIH07XG4gICAgdGhpcy5fbGF5ZXIgPSB7XG4gICAgICBpZDogdGhpcy5fbGF5ZXJJZCxcbiAgICAgIHR5cGU6ICdzeW1ib2wnLFxuICAgICAgc291cmNlOiB0aGlzLl9zb3VyY2VJZCxcbiAgICAgICdzb3VyY2UtbGF5ZXInOiB0aGlzLmxheWVyU291cmNlSWQsXG4gICAgICBsYXlvdXQ6IExBWU9VVF9QQVJBTVMgYXMgYW55LFxuICAgICAgcGFpbnQ6IFBBSU5UX1BBUkFNUyBhcyBhbnksXG4gICAgICBmaWx0ZXI6IEZJTFRFUixcbiAgICB9O1xuXG4gICAgdGhpcy5fZW5hYmxlUHJvbW90aW9uQ2FyZCA9IGVuYWJsZVByb21vdGlvbkNhcmQgfHwgZmFsc2U7XG4gICAgdGhpcy5fZW5hYmxlUHJvbW90aW9uU2lkZUNhcmQgPSBlbmFibGVQcm9tb3Rpb25TaWRlQ2FyZCB8fCBmYWxzZTtcbiAgICB0aGlzLl9pc0RhcmtNb2RlID0gaXNEYXJrTW9kZSB8fCBmYWxzZTtcblxuICAgIHRoaXMuX21hcC5vbignbG9hZCcsIHRoaXMubG9hZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9tYXAub24oJ3JlbmRlcicsIHRoaXMucmVuZGVyLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX21hcC5vbignbW92ZScsIHRoaXMubW92ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9tYXAub24oJ3N0eWxlaW1hZ2VtaXNzaW5nJywgdGhpcy5zdHlsZUltYWdlTWlzc2luZy5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9tYXAub24oJ2NsaWNrJywgdGhpcy5fbGF5ZXJJZCwgdGhpcy5jbGljay5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9tYXAub24oJ2lkbGUnLCB0aGlzLmlkbGUuYmluZCh0aGlzKSk7XG5cbiAgICBpbnNlcnRFbGVtZW50RW5kcG9pbnQoJ21hcGJveGdsLWdsb2JhbC1zdHlsZScpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB0aGlzLmFjdGl2YXRlKCkpO1xuICAgIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScgJiYgdGhpcy5hY3RpdmF0ZSgpO1xuICB9XG5cbiAgZ2V0IGFjY2Vzc1Rva2VuKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGNvbmZpZy5BQ0NFU1NfVE9LRU47XG4gIH1cblxuICBzZXQgYWNjZXNzVG9rZW4odG9rZW46IHN0cmluZykge1xuICAgIGNvbmZpZy5BQ0NFU1NfVE9LRU4gPSB0b2tlbjtcbiAgfVxuXG4gIGdldCBiYXNlVXJsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGNvbmZpZy5CQVNFX1VSTDtcbiAgfVxuXG4gIHNldCBiYXNlVXJsKHVybDogc3RyaW5nKSB7XG4gICAgY29uZmlnLkJBU0VfVVJMID0gdXJsO1xuICB9XG5cbiAgZ2V0IHNvdXJjZVVybCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBjb25maWcuU09VUkNFX1VSTDtcbiAgfVxuXG4gIHNldCBzb3VyY2VVcmwoc291cmNlVXJsOiBzdHJpbmcpIHtcbiAgICBjb25maWcuU09VUkNFX1VSTCA9IHNvdXJjZVVybDtcbiAgfVxuXG4gIGdldCB0ZWxlbWV0cnlVcmwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gY29uZmlnLlRFTEVNRVRSWV9VUkw7XG4gIH1cblxuICBzZXQgdGVsZW1ldHJ5VXJsKHRlbGVtZXRyeVVybDogc3RyaW5nKSB7XG4gICAgY29uZmlnLlRFTEVNRVRSWV9VUkwgPSB0ZWxlbWV0cnlVcmw7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIGNvbmZpZy5ERUJVRztcbiAgfVxuXG4gIHNldCBkZWJ1ZyhkZWJ1ZzogYm9vbGVhbikge1xuICAgIGNvbmZpZy5ERUJVRyA9IGRlYnVnO1xuICB9XG5cbiAgZ2V0IGxheWVyU291cmNlSWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gY29uZmlnLkxBWUVSX1NPVVJDRV9JRDtcbiAgfVxuXG4gIHNldCBsYXllclNvdXJjZUlkKGxheWVyU291cmNlSWQ6IHN0cmluZykge1xuICAgIGNvbmZpZy5MQVlFUl9TT1VSQ0VfSUQgPSBsYXllclNvdXJjZUlkO1xuICB9XG5cbiAgZ2V0IG1vYmlsZU1heFdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIGNvbmZpZy5NT0JJTEVfTUFYX1dJRFRIO1xuICB9XG5cbiAgc2V0IG1vYmlsZU1heFdpZHRoKG1vYmlsZU1heFdpZHRoOiBudW1iZXIpIHtcbiAgICBjb25maWcuTU9CSUxFX01BWF9XSURUSCA9IG1vYmlsZU1heFdpZHRoO1xuICB9XG5cbiAgZ2V0IGlzRGFya01vZGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzRGFya01vZGU7XG4gIH1cblxuICBzZXQgaXNEYXJrTW9kZShpc0RhcmtNb2RlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faXNEYXJrTW9kZSA9IGlzRGFya01vZGU7XG4gIH1cblxuICBnZXQgbWFwKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXA7XG4gIH1cblxuICBnZXQgbGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcC5nZXRMYXllcih0aGlzLl9sYXllcklkKTtcbiAgfVxuXG4gIGdldCBlbmFibGVQcm9tb3Rpb25Qb3B1cCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuX2VuYWJsZVByb21vdGlvbkNhcmQgJiYgIXRoaXMuX2VuYWJsZVByb21vdGlvblNpZGVDYXJkO1xuICB9XG5cbiAgc2V0IGVuYWJsZVByb21vdGlvblBvcHVwKGVuYWJsZVByb21vdGlvblBvcHVwOiBib29sZWFuKSB7XG4gICAgaWYgKGVuYWJsZVByb21vdGlvblBvcHVwKSB7XG4gICAgICB0aGlzLl9lbmFibGVQcm9tb3Rpb25DYXJkID0gZmFsc2U7XG4gICAgICB0aGlzLl9lbmFibGVQcm9tb3Rpb25TaWRlQ2FyZCA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbmFibGVQcm9tb3Rpb25DYXJkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2VuYWJsZVByb21vdGlvblNpZGVDYXJkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGVuYWJsZVByb21vdGlvbkNhcmQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VuYWJsZVByb21vdGlvbkNhcmQ7XG4gIH1cblxuICBzZXQgZW5hYmxlUHJvbW90aW9uQ2FyZChlbmFibGVQcm9tb3Rpb25DYXJkOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlUHJvbW90aW9uQ2FyZCA9IGVuYWJsZVByb21vdGlvbkNhcmQ7XG4gICAgdGhpcy5fZW5hYmxlUHJvbW90aW9uU2lkZUNhcmQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCBlbmFibGVQcm9tb3Rpb25TaWRlQ2FyZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlUHJvbW90aW9uU2lkZUNhcmQ7XG4gIH1cblxuICBzZXQgZW5hYmxlUHJvbW90aW9uU2lkZUNhcmQoZW5hYmxlUHJvbW90aW9uU2lkZUNhcmQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbmFibGVQcm9tb3Rpb25DYXJkID0gZmFsc2U7XG4gICAgdGhpcy5fZW5hYmxlUHJvbW90aW9uU2lkZUNhcmQgPSBlbmFibGVQcm9tb3Rpb25TaWRlQ2FyZDtcbiAgfVxuXG4gIHByaXZhdGUgYWN0aXZhdGUoKSB7XG4gICAgd2luZG93LnJlbmRlckFwcCAmJiB3aW5kb3cucmVuZGVyQXBwKGNvbmZpZyk7XG4gICAgdGVsZW1ldHJ5QVBJcy5zZXNzaW9uU3RhcnQoKTtcbiAgfVxuICBcbiAgcHJpdmF0ZSByZWxvYWRQcm9tb3Rpb25MYWx5ZXIoKSB7XG4gICAgaWYgKHRoaXMuX21hcC5nZXRTb3VyY2UodGhpcy5fc291cmNlSWQpKSB7XG4gICAgICB0aGlzLl9tYXAucmVtb3ZlU291cmNlKHRoaXMuX3NvdXJjZUlkKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX21hcC5nZXRMYXllcih0aGlzLl9sYXllcklkKSkge1xuICAgICAgdGhpcy5fbWFwLnJlbW92ZUxheWVyKHRoaXMuX2xheWVySWQpO1xuICAgIH1cbiAgICB0aGlzLl9tYXAuYWRkU291cmNlKHRoaXMuX3NvdXJjZUlkLCB0aGlzLl9zb3VyY2UpO1xuICAgIHRoaXMuX21hcC5hZGRMYXllcih0aGlzLl9sYXllcik7XG4gIH1cblxuICBwcml2YXRlIGxvYWQoZXZlbnQ6IHsgdGFyZ2V0OiBNYXAgfSkge1xuICAgIHRoaXMuZmlyZShuZXcgRXZlbnQoRVZFTlRfVFlQRVMuTE9BRCwgeyBtYXA6IGV2ZW50LnRhcmdldCB9KSk7XG4gICAgdGhpcy5yZWxvYWRQcm9tb3Rpb25MYWx5ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyKF9ldmVudDogeyB0YXJnZXQ6IE1hcCB9KSB7XG4gICAgdGhpcy51cGRhdGVSZW5kZXJlZEZlYXR1cmVzKCk7XG4gIH1cblxuICBwcml2YXRlIG1vdmUoZXZlbnQ6IG1hcGJveGdsLk1hcGJveEV2ZW50PGFueT4gJiBtYXBib3hnbC5FdmVudERhdGEpIHtcbiAgICBjb25zdCBmZWF0dXJlcyA9IHRoaXMubWFwLnF1ZXJ5UmVuZGVyZWRGZWF0dXJlcyh1bmRlZmluZWQsIHsgbGF5ZXJzOiBbdGhpcy5fbGF5ZXJJZF0gfSk7XG4gICAgY29uc3QgcHJvbW90aW9uRmVhdHVyZXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGZlYXR1cmUgb2YgZmVhdHVyZXMpIHtcbiAgICAgIGZlYXR1cmUucHJvcGVydGllcyAmJiBmZWF0dXJlLnByb3BlcnRpZXNbJ2FkaWQnXSAmJiBwcm9tb3Rpb25GZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgIH1cbiAgICB0aGlzLmZpcmUoXG4gICAgICBuZXcgRXZlbnQoRVZFTlRfVFlQRVMuTU9WRSwge1xuICAgICAgICBtYXA6IGV2ZW50LnRhcmdldCxcbiAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQub3JpZ2luYWxFdmVudCxcbiAgICAgICAgZmVhdHVyZXM6IHByb21vdGlvbkZlYXR1cmVzXG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNob3coZmVhdHVyZTogRmVhdHVyZSkge1xuICAgIGlmICh0aGlzLl9lbmFibGVQcm9tb3Rpb25TaWRlQ2FyZCkge1xuICAgICAgaWYgKCF0aGlzLl9wcm9tb3Rpb25TaWRlQ2FyZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0l0IG5lZWRzIHRvIGJlIGFkZGVkIFByb21vdGlvblNpZGVDYXJkIGhhbmRsZXIuJyk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wcm9tb3Rpb25TaWRlQ2FyZC5zaG93KGZlYXR1cmUpXG4gICAgfSBlbHNlIGlmICh0aGlzLl9lbmFibGVQcm9tb3Rpb25DYXJkKSB7XG4gICAgICBpZiAoIXRoaXMuX3Byb21vdGlvbkNhcmQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJdCBuZWVkcyB0byBiZSBhZGRlZCBQcm9tb3Rpb25DYXJkIGhhbmRsZXIuJyk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wcm9tb3Rpb25DYXJkLnNob3coZmVhdHVyZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghdGhpcy5fcHJvbW90aW9uUG9wdXApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJdCBuZWVkcyB0byBiZSBhZGRlZCBQcm9tb3Rpb25Qb3B1cCBoYW5kbGVyLicpO1xuICAgICAgfVxuICAgICAgdGhpcy5fcHJvbW90aW9uUG9wdXAuc2hvdyhmZWF0dXJlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNsaWNrKGV2ZW50OiBtYXBib3hnbC5NYXBNb3VzZUV2ZW50ICYgeyBmZWF0dXJlcz86IG1hcGJveGdsLk1hcGJveEdlb0pTT05GZWF0dXJlW10gfCB1bmRlZmluZWQ7IH0gJiBtYXBib3hnbC5FdmVudERhdGEpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZmVhdHVyZSA9IGV2ZW50LmZlYXR1cmVzICYmIGV2ZW50LmZlYXR1cmVzWzBdIGFzIEZlYXR1cmU7XG4gICAgICBpZiAoIWZlYXR1cmUpIHsgcmV0dXJuOyB9XG4gICAgICBjb25zdCB7IHByb3BlcnRpZXMgfSA9IGZlYXR1cmU7XG4gICAgICBjb25zdCB7IGFkaWQgfSA9IHByb3BlcnRpZXM7XG4gICAgICBpZiAoIWFkaWQpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHRlbGVtZXRyeUFQSXMuc2VuZFNlbGVjdGlvbihhZGlkLCB0aGlzLm1hcC5nZXRab29tKCkpO1xuICAgICAgdGhpcy5maXJlKG5ldyBFdmVudChFVkVOVF9UWVBFUy5DTElDS19QSU4sIHtcbiAgICAgICAgbWFwOiBldmVudC50YXJnZXQsXG4gICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsXG4gICAgICAgIGZlYXR1cmUsXG4gICAgICB9KSk7XG4gICAgICB0aGlzLnNob3coZmVhdHVyZSk7XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpZGxlKF9ldmVudDogbWFwYm94Z2wuTWFwYm94RXZlbnQpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5tYXAuZ2V0TGF5ZXIodGhpcy5fbGF5ZXJJZCkgfHxcbiAgICAgICF0aGlzLm1hcC5nZXRTb3VyY2UodGhpcy5fc291cmNlSWQpXG4gICAgKSB7XG4gICAgICB0aGlzLnJlbG9hZFByb21vdGlvbkxhbHllcigpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbih0eXBlOiBNYXBib3hQcm9tb3RlZC5FdmVudFR5cGVzLCBsaXN0ZW5lcjogTWFwYm94UHJvbW90ZWQuTGlzdGVuZXIpIHtcbiAgICBjb25zdCBsaXN0ZW5lckV4aXN0cyA9IHRoaXMuX2xpc3RlbmVyc1t0eXBlXSAmJiB0aGlzLl9saXN0ZW5lcnNbdHlwZV0uaW5kZXhPZihsaXN0ZW5lcikgIT09IC0xO1xuICAgIGlmICghbGlzdGVuZXJFeGlzdHMpIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1t0eXBlXSA9IHRoaXMuX2xpc3RlbmVyc1t0eXBlXSB8fCBbXTtcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb2ZmKHR5cGU6IE1hcGJveFByb21vdGVkLkV2ZW50VHlwZXMsIGxpc3RlbmVyOiBNYXBib3hQcm9tb3RlZC5MaXN0ZW5lcikge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnMgJiYgdGhpcy5fbGlzdGVuZXJzW3R5cGVdKSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzW3R5cGVdLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGZpcmUoZXZlbnQ6IEV2ZW50KSB7XG4gICAgY29uc3QgeyB0eXBlLCBkYXRhIH0gPSBldmVudDtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMgJiYgdGhpcy5fbGlzdGVuZXJzW3R5cGVdID8gdGhpcy5fbGlzdGVuZXJzW3R5cGVdLnNsaWNlKCkgOiBbXTtcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIGxpc3RlbmVycykge1xuICAgICAgbGlzdGVuZXIuY2FsbCh0aGlzLCB0eXBlLCBkYXRhKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0UGluKGZlYXR1cmU6IEZlYXR1cmUpIHtcbiAgICBjb25zdCB7IGFkaWQgfSA9IGZlYXR1cmUucHJvcGVydGllcyBhcyBGZWF0dXJlLlByb3BlcnRpZXM7XG4gICAgaWYgKCFhZGlkKSB7IHJldHVybjsgfVxuICAgIGNvbnN0IHRleHRDb2xvciA9IGNyZWF0ZVNlbGVjdGVkVGV4dENvbG9yKGFkaWQpO1xuICAgIGNvbnN0IHRleHRIYWxvQ29sb3IgPSBjcmVhdGVTZWxlY3RlZFRleHRIYWxvQ29sb3IoYWRpZCk7XG4gICAgdGhpcy5fbWFwLnNldFBhaW50UHJvcGVydHkodGhpcy5fbGF5ZXJJZCwgJ3RleHQtY29sb3InLCB0ZXh0Q29sb3IpO1xuICAgIHRoaXMuX21hcC5zZXRQYWludFByb3BlcnR5KHRoaXMuX2xheWVySWQsICd0ZXh0LWhhbG8tY29sb3InLCB0ZXh0SGFsb0NvbG9yKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXNlbGVjdFBpbigpIHtcbiAgICB0aGlzLl9tYXAuc2V0UGFpbnRQcm9wZXJ0eShcbiAgICAgIHRoaXMuX2xheWVySWQsXG4gICAgICAndGV4dC1jb2xvcicsXG4gICAgICB0aGlzLmlzRGFya01vZGUgPyBDT0xPUlMuRk9OVF9DT0xPUl9MSUdIVCA6IENPTE9SUy5GT05UX0NPTE9SX0RBUkssXG4gICAgKTtcbiAgICB0aGlzLl9tYXAuc2V0UGFpbnRQcm9wZXJ0eShcbiAgICAgIHRoaXMuX2xheWVySWQsXG4gICAgICAndGV4dC1oYWxvLWNvbG9yJyxcbiAgICAgIHRoaXMuaXNEYXJrTW9kZSA/IENPTE9SUy5GT05UX0hBTE9fQ09MT1JfTElHSFQgOiBDT0xPUlMuRk9OVF9IQUxPX0NPTE9SX0RBUkssXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc3R5bGVJbWFnZU1pc3NpbmcoZXZlbnQ6IGFueSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBpbWFnZUlkOiBzdHJpbmcgPSBldmVudC5pZDtcbiAgICAgIGlmIChcbiAgICAgICAgaW1hZ2VJZCAmJlxuICAgICAgICAhdGhpcy5fbWFwLmhhc0ltYWdlKGltYWdlSWQpICYmXG4gICAgICAgIGltYWdlSWQubWF0Y2goL14oW2EtekEtWjAtOV17MjEsMjJ9KSQvKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGdldEltYWdlVXJsKGltYWdlSWQpO1xuICAgICAgICB0aGlzLl9tYXAubG9hZEltYWdlKHVybCwgKGVycm9yPzogRXJyb3IsIGltYWdlPzogSFRNTEltYWdlRWxlbWVudCB8IEltYWdlQml0bWFwKSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7IHRocm93IGVycm9yOyB9XG4gICAgICAgICAgaWYgKCFpbWFnZSkgeyB0aHJvdyBuZXcgRXJyb3IoJ2dldHRpbmcgaW1hZ2UgZmFpbGVkLicpOyB9XG4gICAgICAgICAgdGhpcy5fbWFwLmFkZEltYWdlKGltYWdlSWQsIGltYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVSZW5kZXJlZEZlYXR1cmVzKCkge1xuICAgIGNvbnN0IGZlYXR1cmVzID0gdGhpcy5wcm9tb3Rpb25GZWF0dXJlcygpO1xuICAgIGNvbnN0IGRpc2FwcGVhcmVkRmVhdHVyZXM6IFRlbGVtZXRyeUFQSS5GZWF0dXJlW10gPSBbXTtcblxuICAgIC8vIGRpc2FwcGVhcmVkIGZlYXR1cmUgb2JqZWN0cyB0aGF0IHdhcyByZW5kZXJlZCBiZWZvcmVcbiAgICB0aGlzLl9yZW5kZXJlZEZlYXR1cmVzQWRpZHMgPSB0aGlzLl9yZW5kZXJlZEZlYXR1cmVzQWRpZHMuZmlsdGVyKCh7IGFkaWQsIHZpc2libGVTdGFydFRpbWUgfSkgPT4ge1xuICAgICAgY29uc3QgaXNFeGlzdGVkID0gISFmZWF0dXJlcy5maW5kKGZlYXR1cmUgPT4gYWRpZCA9PT0gZmVhdHVyZS5wcm9wZXJ0aWVzLmFkaWQpO1xuICAgICAgaWYgKCFpc0V4aXN0ZWQpIHtcbiAgICAgICAgZGlzYXBwZWFyZWRGZWF0dXJlcy5wdXNoKHsgYWRpZCwgdmlzaWJsZVN0YXJ0VGltZSwgdmlzaWJsZUVuZFRpbWU6IERhdGUubm93KCkgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgLy8gYWRkaW5nIGFwcGVhcmVkIG5ldyBmZWF0dXJlIG9iamVjdHNcbiAgICBmZWF0dXJlcy5mb3JFYWNoKGZlYXR1cmUgPT4ge1xuICAgICAgY29uc3QgaXNFeGlzdGVkID0gISF0aGlzLl9yZW5kZXJlZEZlYXR1cmVzQWRpZHMuZmluZCgoeyBhZGlkIH0pID0+IGFkaWQgPT09IGZlYXR1cmUucHJvcGVydGllcy5hZGlkKTtcbiAgICAgIGlmICghaXNFeGlzdGVkICYmIGZlYXR1cmUucHJvcGVydGllcy5hZGlkKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVkRmVhdHVyZXNBZGlkcy5wdXNoKHtcbiAgICAgICAgICBhZGlkOiBmZWF0dXJlLnByb3BlcnRpZXMuYWRpZCxcbiAgICAgICAgICB2aXNpYmxlU3RhcnRUaW1lOiBEYXRlLm5vdygpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGlzYXBwZWFyZWRGZWF0dXJlcy5sZW5ndGggJiYgKFxuICAgICAgdGVsZW1ldHJ5QVBJcy5zZW5kVmlzaWJpbGl0aWVzKGRpc2FwcGVhcmVkRmVhdHVyZXMpXG4gICAgKTtcbiAgfVxuXG4gIC8vIHByaXZhdGUgaGFzTGlzdGVuZXIodHlwZTogRXZlbnRUeXBlcykge1xuICAvLyAgIHJldHVybiAhIXRoaXMuX2xpc3RlbmVycyAmJiB0aGlzLl9saXN0ZW5lcnNbdHlwZV0gJiYgdGhpcy5fbGlzdGVuZXJzW3R5cGVdLmxlbmd0aCA+IDA7XG4gIC8vIH1cblxuICBwdWJsaWMgYWRkSGFuZGxlcihoYW5kbGVyOiBNYXBib3hQcm9tb3RlZC5IYW5kbGVycykge1xuICAgIGhhbmRsZXIuaW5pdFByb21vdGVkKHRoaXMgYXMgYW55KTtcbiAgICBzd2l0Y2ggKGhhbmRsZXIuaWQpIHtcbiAgICAgIGNhc2UgJ1Byb21vdGlvblBvcHVwJzoge1xuICAgICAgICB0aGlzLl9wcm9tb3Rpb25Qb3B1cCA9IGhhbmRsZXIgYXMgUHJvbW90aW9uUG9wdXA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBjYXNlICdQcm9tb3Rpb25DYXJkJzoge1xuICAgICAgICB0aGlzLl9wcm9tb3Rpb25DYXJkID0gaGFuZGxlciBhcyBQcm9tb3Rpb25DYXJkO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gY2FzZSAnUHJvbW90aW9uU2lkZUNhcmQnOiB7XG4gICAgICAgIHRoaXMuX3Byb21vdGlvblNpZGVDYXJkID0gaGFuZGxlciBhcyBQcm9tb3Rpb25TaWRlQ2FyZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHByb21vdGlvbkZlYXR1cmVzKCk6IEZlYXR1cmVbXSB7XG4gICAgaWYgKCF0aGlzLm1hcC5nZXRMYXllcih0aGlzLl9sYXllcklkKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBjb25zdCBmZWF0dXJlcyA9IHRoaXMubWFwLnF1ZXJ5UmVuZGVyZWRGZWF0dXJlcyh1bmRlZmluZWQsIHsgbGF5ZXJzOiBbdGhpcy5fbGF5ZXJJZF0gfSk7XG4gICAgY29uc3QgcHJvbW90aW9uRmVhdHVyZXM6IEZlYXR1cmVbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiBmZWF0dXJlcykge1xuICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzICYmIGZlYXR1cmUucHJvcGVydGllc1snYWRpZCddICYmIChcbiAgICAgICAgcHJvbW90aW9uRmVhdHVyZXMucHVzaChmZWF0dXJlIGFzIEZlYXR1cmUpXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbW90aW9uRmVhdHVyZXM7XG4gIH1cblxuICBwdWJsaWMgc2hvd0xheWVyKCkge1xuICAgIHRoaXMuX21hcC5zZXRMYXlvdXRQcm9wZXJ0eSh0aGlzLl9sYXllcklkLCAndmlzaWJpbGl0eScsICdub25lJyk7XG4gIH1cblxuICBwdWJsaWMgaGlkZUxheWVyKCkge1xuICAgIHRoaXMuX21hcC5zZXRMYXlvdXRQcm9wZXJ0eSh0aGlzLl9sYXllcklkLCAndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gIH1cblxuICBwdWJsaWMgZGVzZWxlY3RMYXllcigpIHtcbiAgICB0aGlzLmRlc2VsZWN0UGluKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwYm94UHJvbW90ZWQ7XG4iXSwibmFtZXMiOlsiY29uZmlnIiwicmVxdWlyZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJpbnNlcnRFbGVtZW50RW5kcG9pbnQiLCJ0ZWxlbWV0cnlBUElzLnNlc3Npb25TdGFydCIsIkV2ZW50IiwiRVZFTlRfVFlQRVMiLCJmZWF0dXJlIiwidGVsZW1ldHJ5QVBJcy5zZW5kU2VsZWN0aW9uIiwidGVsZW1ldHJ5QVBJcy5zZW5kVmlzaWJpbGl0aWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBRU8sTUFBTSxXQUFXLEdBQUcsQ0FBQyxPQUFlLE1BQ3pDLEdBQUdBLGNBQU0sQ0FBQyxRQUFRLHdDQUF3QyxPQUFPLGlCQUFpQkEsY0FBTSxDQUFDLFlBQVksRUFBRSxDQUN4Rzs7QUNKTSxNQUFNLE1BQU0sR0FBRztJQUNwQixnQkFBZ0IsRUFBRSxTQUFTO0lBQzNCLGVBQWUsRUFBRSxTQUFTO0lBQzFCLHFCQUFxQixFQUFFLFNBQVM7SUFDaEMsb0JBQW9CLEVBQUUsU0FBUztJQUMvQix5QkFB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
