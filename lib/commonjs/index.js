define(['exports', 'axios', 'date-fns', 'mapbox-gl'], (function (exports, axios, dateFns, mapboxGl) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

    const config = {
        BASE_URL: 'https://api.mapbox.com',
        TELEMETRY_URL: 'https://events.mapbox.com',
        SOURCE_URL: 'mapbox://mapbox-ads.bq09b9qc',
        LAYER_SOURCE_ID: 'promoted-pins-8s73mu',
        ACCESS_TOKEN: '',
        MOBILE_MAX_WIDTH: 768,
        DEBUG: false,
    };

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

    const isSp = () => {
        return window.innerWidth <= config.MOBILE_MAX_WIDTH;
    };
    const insertElementEndpoint = (className) => {
        try {
            const mapboxElement = document.querySelector('.mapboxgl-map');
            if (!mapboxElement) {
                throw Error('filed to find element: .mapboxgl-map');
            }
            const endpoint = document.createElement('div');
            endpoint.className = className;
            mapboxElement.appendChild(endpoint);
        }
        catch (error) {
            throw error;
        }
    };
    const updateElementEndpoint = (selector, updateClassName) => {
        try {
            const targetElement = document.querySelector(selector);
            if (!targetElement) {
                return;
            }
            targetElement.className = updateClassName;
        }
        catch (error) {
            throw error;
        }
    };
    const removeElementEndpoint = (selector) => {
        try {
            const targetElement = document.querySelector(selector);
            if (!targetElement || !targetElement.parentNode) {
                return;
            }
            targetElement.parentNode.removeChild(targetElement);
        }
        catch (error) {
            throw error;
        }
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

    class Event {
        type;
        data;
        constructor(type, data = {}) {
            this.type = type;
            this.data = data;
        }
    }

    const axiosInstance = (options = {}) => {
        const { baseURL, isBlob } = options;
        return axios__default["default"].create({
            baseURL: baseURL || config.BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 1000 * 30,
            responseType: isBlob ? 'blob' : 'json',
        });
    };

    const randomString = (length = 8) => (Math.random().toString(length).substring(2));

    const ACTIONS = {
        CALL: 'Call',
        NAVIGATION: 'Navigation',
        DETAIL: 'Detail',
        BANNER: 'BannerDetail',
    };
    const FEEDBACK_TYPES = {
        ATTRIBUTION: 'attribution',
        QUOTE: 'quote',
    };
    const FEEDBACK_ACTIONS = {
        QUOTE: 'AdsQuote',
        DETAIL: 'AdsAttributionDetail',
        FEEDBACK: 'Feedback',
    };

    let lastSessionTime = new Date();
    let sessionIdentifier = randomString();
    const verifySession = async () => {
        if (!lastSessionTime || dateFns.differenceInSeconds(new Date(), lastSessionTime) > 60) {
            lastSessionTime = new Date();
            sessionIdentifier = randomString();
            await sessionStart();
        }
    };
    function sendEvent(params) {
        if (config.DEBUG) {
            return;
        }
        return new Promise((resolve, reject) => {
            const url = `/events/v2?access_token=${config.ACCESS_TOKEN}`;
            return axiosInstance({
                baseURL: config.TELEMETRY_URL,
                isBlob: true
            }).post(url, params).then((res) => {
                resolve(res.data);
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });
    }
    ;
    async function sessionStart() {
        const params = {
            sessionIdentifier,
            event: 'adMetrics.sessionStart',
            bucket: 'undefined',
            created: new Date().toISOString(),
        };
        return sendEvent([params]);
    }
    async function sendSelection(adid, zoomLevel) {
        const params = {
            sessionIdentifier,
            event: 'adMetrics.select',
            adid,
            zoomLevel,
            created: new Date().toISOString(),
        };
        await verifySession();
        return sendEvent([params]);
    }
    async function sendDeselection(adid) {
        const params = {
            sessionIdentifier,
            event: 'adMetrics.deselect',
            adid,
            created: new Date().toISOString(),
        };
        await verifySession();
        return sendEvent([params]);
    }
    async function sendVisibilities(features) {
        const params = features.map(({ adid, visibleStartTime, visibleEndTime }) => ({
            sessionIdentifier,
            event: 'adMetrics.visible',
            adid,
            visibleStartTime,
            visibleEndTime,
            created: new Date().toISOString(),
        }));
        await verifySession();
        return sendEvent(params);
    }
    async function sendAction(adid, action) {
        const params = {
            sessionIdentifier,
            event: 'adMetrics.callToAction',
            adid,
            action,
            created: new Date().toISOString(),
        };
        await verifySession();
        return sendEvent([params]);
    }
    async function sendFeedback(adid, action, type) {
        const params = {
            sessionIdentifier,
            event: 'adMetrics.feedback',
            adid,
            action,
            type,
            description: '',
            created: new Date().toISOString(),
        };
        await verifySession();
        return sendEvent([params]);
    }

    const EVENT_TYPES = {
        LOAD: 'load',
        MOVE: 'move',
        CLICK_PIN: 'click_pin',
        CLICK_CARD: 'click_card',
        SHOW_CARD: 'show_card',
        UPDATE_CARD: 'update_card',
        CLOSE_CARD: 'close_card',
        CLICK_SIDE_CARD: 'click_side_card',
        SHOW_SIDE_CARD: 'show_side_card',
        UPDATE_SIDE_CARD: 'update_side_card',
        OPEN_SIDE_CARD: 'open_side_card',
        HIDE_SIDE_CARD: 'hide_side_card',
        CLOSE_SIDE_CARD: 'close_side_card',
        CLICK_POPUP: 'click_popup',
        SHOW_POPUP: 'show_popup',
        CLOSE_POPUP: 'close_popup',
    };
    const CLICK_TYPES = {
        CARD: 'card',
        TOGGLE: 'toggle',
        BANNER: 'banner',
        PHONE: 'phone',
        DIRECTIONS: 'directions',
        DETAIL: 'detail',
    };
    const TELEMETRY_ACTIONS = {
        [CLICK_TYPES.BANNER]: ACTIONS.BANNER,
        [CLICK_TYPES.PHONE]: ACTIONS.CALL,
        [CLICK_TYPES.DIRECTIONS]: ACTIONS.NAVIGATION,
        [CLICK_TYPES.DETAIL]: ACTIONS.DETAIL,
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

    const camelCase = (object) => {
        const updatedObject = {};
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                updatedObject[key.replace(/(\_\w)/g, updatedKey => (updatedKey[1].toUpperCase()))] = object[key];
            }
        }
        return updatedObject;
    };
    const formatProperties = (properties) => camelCase(properties);
    const getOpenCloseLabel = (properties) => {
        const { satOpen, satClose, sunOpen, sunClose, weekOpen, weekClose } = properties;
        const today = new Date();
        let open = '';
        let close = '';
        if (dateFns.isSaturday(today) && satOpen && satClose) {
            open = satOpen;
            close = satClose;
        }
        else if (dateFns.isSunday(today) && sunOpen && sunClose) {
            open = sunOpen;
            close = sunClose;
        }
        else if (weekOpen && weekClose) {
            open = weekOpen;
            close = weekClose;
        }
        else {
            return '';
        }
        const openMatch = `${open}`.match(/(\d{1,2})(\d{2})$/);
        const openHour = openMatch && openMatch.length >= 3 ? openMatch[1] : '';
        const openMin = openMatch && openMatch.length >= 3 ? openMatch[2] : '';
        const closeMatch = `${close}`.match(/(\d{1,2})(\d{2})$/);
        const closeHour = closeMatch && closeMatch.length >= 3 ? closeMatch[1] : '';
        const closeMin = closeMatch && closeMatch.length >= 3 ? closeMatch[2] : '';
        const openLanbel = `${openHour}:${openMin}`;
        const closeLanbel = `${closeHour}:${closeMin}`;
        return `${openLanbel} - ${closeLanbel}`;
    };

    class PromotionPopup {
        _promoted;
        _popup;
        get id() {
            return 'PromotionPopup';
        }
        initPromoted(promoted) {
            this._promoted = promoted;
        }
        sendAction(adid, clickType) {
            const action = TELEMETRY_ACTIONS[clickType];
            action && sendAction(adid, action);
        }
        show(feature) {
            if (!this._promoted) {
                throw new Error('It needs to initPromoted.');
            }
            this.remove();
            const properties = formatProperties(feature.properties);
            const coordinates = feature.geometry.coordinates.slice();
            const adidClass = `mapboxgl-popup-adid__${properties.adid}`;
            const popup = document.querySelector(`.${adidClass}`);
            if (popup) {
                return;
            }
            this._promoted.fire(new Event(EVENT_TYPES.SHOW_POPUP, { feature }));
            this._popup = new mapboxGl.Popup({
                closeOnClick: false,
                closeButton: false,
                className: adidClass,
            }).setLngLat(coordinates)
                .setHTML(`<div class="mapboxgl-popup-content-adid__${properties.adid}" />`)
                .addTo(this._promoted.map);
            showPromotionPopup && showPromotionPopup(properties, (clickType, adid) => {
                if (!this._promoted) {
                    return;
                }
                this._promoted.fire(new Event(EVENT_TYPES.CLICK_POPUP, { clickType, feature }));
                this.sendAction(adid, clickType);
            }, (adid) => {
                if (!this._promoted) {
                    return;
                }
                this._promoted.fire(new Event(EVENT_TYPES.CLOSE_POPUP, { feature }));
                this._promoted.deselectLayer();
                this.remove();
                sendDeselection(adid);
            });
            this._promoted.selectPin(feature);
        }
        remove() {
            if (!this._popup) {
                return;
            }
            this._popup.remove.bind(this);
            this._popup = undefined;
        }
    }

    class PromotionCard {
        _promoted;
        get id() {
            return 'PromotionCard';
        }
        initPromoted(promoted) {
            this._promoted = promoted;
        }
        sendAction(adid, clickType) {
            const action = TELEMETRY_ACTIONS[clickType];
            action && sendAction(adid, action);
        }
        show(feature) {
            if (!this._promoted) {
                throw new Error('It needs to initPromoted.');
            }
            const properties = formatProperties(feature.properties);
            const card = document.querySelector('.mapboxgl-card');
            const adidClass = `mapboxgl-card-adid__${feature.properties.adid}`;
            const adidCard = document.querySelector(`.${adidClass}`);
            // when if same promotion icon was clicked, it deletes current promotion card.
            if (card && adidCard) {
                return;
            }
            // when if another promotion icon was clicked, it updates promotion card.
            if (card && !adidCard && updatePromotionCard) {
                this._promoted.fire(new Event(EVENT_TYPES.UPDATE_CARD, { feature }));
                updateElementEndpoint('.mapboxgl-card', `mapboxgl-card ${adidClass}`);
                updatePromotionCard(properties);
                return;
            }
            this._promoted.fire(new Event(EVENT_TYPES.SHOW_CARD, { feature }));
            insertElementEndpoint(`mapboxgl-card ${adidClass}`);
            showPromotionCard && showPromotionCard(properties, (clickType, adid) => {
                if (!this._promoted) {
                    return;
                }
                this._promoted.fire(new Event(EVENT_TYPES.CLICK_CARD, { clickType, feature }));
                this.sendAction(adid, clickType);
            }, (adid) => {
                if (!this._promoted) {
                    return;
                }
                this._promoted.fire(new Event(EVENT_TYPES.CLOSE_CARD, { feature }));
                this._promoted.deselectLayer();
                this.remove();
                sendDeselection(adid);
            });
        }
        remove() {
            removeElementEndpoint('.mapboxgl-card');
        }
    }

    class PromotionSideCard {
        _promoted;
        get id() {
            return 'PromotionSideCard';
        }
        initPromoted(promoted) {
            this._promoted = promoted;
        }
        sendAction(adid, clickType) {
            const action = TELEMETRY_ACTIONS[clickType];
            action && sendAction(adid, action);
        }
        show(feature) {
            if (!this._promoted) {
                throw new Error('It needs to initPromoted.');
            }
            const properties = formatProperties(feature.properties);
            const card = document.querySelector('.mapboxgl-side-card');
            const adidClass = `mapboxgl-side-card-adid__${feature.properties.adid}`;
            const adidCard = document.querySelector(`.${adidClass}`);
            // when if same promotion icon was clicked, it deletes current promotion side card.
            if (card && adidCard) {
                return;
            }
            // when if another promotion icon was clicked, it updates promotion side card.
            if (card && !adidCard && updatePromotionSideCard) {
                this._promoted.fire(new Event(EVENT_TYPES.UPDATE_SIDE_CARD, { feature }));
                updateElementEndpoint('.mapboxgl-side-card', `mapboxgl-side-card ${adidClass}`);
                updatePromotionSideCard(properties);
                return;
            }
            this._promoted.fire(new Event(EVENT_TYPES.SHOW_SIDE_CARD, { feature }));
            insertElementEndpoint(`mapboxgl-side-card ${adidClass}`);
            showPromotionSideCard && showPromotionSideCard(properties, (clickType, adid) => {
                if (!this._promoted) {
                    return;
                }
                this._promoted.fire(new Event(EVENT_TYPES.CLICK_SIDE_CARD, { clickType, feature }));
                this.sendAction(adid, clickType);
            }, (adid) => {
                if (!this._promoted) {
                    return;
                }
                this._promoted.fire(new Event(EVENT_TYPES.CLOSE_SIDE_CARD, { feature }));
                this._promoted.deselectLayer();
                this.remove();
                sendDeselection(adid);
            }, (_adid) => {
                if (!this._promoted) {
                    return;
                }
                this._promoted.fire(new Event(EVENT_TYPES.OPEN_SIDE_CARD, { feature }));
            }, (_adid) => {
                if (!this._promoted) {
                    return;
                }
                this._promoted.fire(new Event(EVENT_TYPES.HIDE_SIDE_CARD, { feature }));
            });
        }
        remove() {
            removeElementEndpoint('.mapboxgl-side-card');
        }
    }

    exports.PromotionCard = PromotionCard;
    exports.PromotionPopup = PromotionPopup;
    exports.PromotionSideCard = PromotionSideCard;
    exports["default"] = MapboxPromoted;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
