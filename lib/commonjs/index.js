define(['exports', 'date-fns', 'axios'], (function (exports, dateFns, axios) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

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

    const config = {
        BASE_URL: 'https://api.mapbox.com',
        TELEMETRY_URL: 'https://events.mapbox.com',
        SOURCE_URL: 'mapbox://mapbox-ads.bq09b9qc',
        LAYER_SOURCE_ID: 'promoted-pins-8s73mu',
        ACCESS_TOKEN: '',
        MOBILE_MAX_WIDTH: 768,
        DEBUG: false,
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

    var telemetryAPIs = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ACTIONS: ACTIONS,
        FEEDBACK_ACTIONS: FEEDBACK_ACTIONS,
        FEEDBACK_TYPES: FEEDBACK_TYPES,
        verifySession: verifySession,
        sessionStart: sessionStart,
        sendSelection: sendSelection,
        sendDeselection: sendDeselection,
        sendVisibilities: sendVisibilities,
        sendAction: sendAction,
        sendFeedback: sendFeedback
    });

    class PromotionCard {
        _promoted;
        get id() {
            return 'PromotionCard';
        }
        initPromoted(promoted) {
            this._promoted = promoted;
        }
        sendAction(adid, clickType) {
            console.log(Event, telemetryAPIs);
            // const action = TELEMETRY_ACTIONS[clickType];
            // action && telemetryAPIs.sendAction(adid, action as TelemetryAPI.Actions);
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
                // this._promoted.fire(new Event(EVENT_TYPES.UPDATE_CARD, { feature }));
                updateElementEndpoint('.mapboxgl-card', `mapboxgl-card ${adidClass}`);
                updatePromotionCard(properties);
                return;
            }
            // this._promoted.fire(new Event(EVENT_TYPES.SHOW_CARD, { feature }));
            insertElementEndpoint(`mapboxgl-card ${adidClass}`);
            showPromotionCard && showPromotionCard(properties, (clickType, adid) => {
                if (!this._promoted) {
                    return;
                }
                // this._promoted.fire(new Event(EVENT_TYPES.CLICK_CARD, { clickType, feature }));
                this.sendAction(adid, clickType);
            }, (adid) => {
                if (!this._promoted) {
                    return;
                }
                // this._promoted.fire(new Event(EVENT_TYPES.CLOSE_CARD, { feature }));
                this._promoted.deselectLayer();
                this.remove();
                // telemetryAPIs.sendDeselection(adid);
            });
        }
        remove() {
            removeElementEndpoint('.mapboxgl-card');
        }
    }

    // import MapboxPromoted from './promoted';

    exports.PromotionCard = PromotionCard;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
