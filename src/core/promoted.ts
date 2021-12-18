import mapboxgl, { Map } from 'mapbox-gl';
import { config } from 'utils/config';
import { getImageUrl } from 'utils/urls';
import { COLORS } from 'utils/color';
import { insertElementEndpoint } from 'utils/browser';
import {
  LAYOUT_PARAMS,
  PAINT_PARAMS,
  FILTER,
  createSelectedTextColor,
  createSelectedTextHaloColor,
} from 'utils/layer';
import { Event } from './event';
import { EVENT_TYPES } from './helpers';

import * as telemetryAPIs from 'apis/telemetry';

class MapboxPromoted implements MapboxPromoted {
  private _map: mapboxgl.Map;
  private _source: mapboxgl.VectorSource;
  private _layer: mapboxgl.SymbolLayer;
  private _layerId = 'promotion-symbols';
  private _sourceId = 'promotions-source';
  private _isDarkMode: boolean;
  private _enablePromotionCard: boolean;
  private _enablePromotionSideCard: boolean;
  private _promotionCard?: PromotionCard;
  private _promotionPopup?: PromotionPopup;
  private _promotionSideCard?: PromotionSideCard;
  private _listeners: MapboxPromoted.Listeners = {};
  private _renderedFeaturesAdids: { adid: string; visibleStartTime: number; }[] = [];

  constructor(map: mapboxgl.Map, token: string, options: MapboxPromoted.Options = {}) {
    this.accessToken = token;

    const {
      baseUrl,
      sourceUrl,
      telemetryUrl,
      mobileMaxWidth,
      enablePromotionCard,
      enablePromotionSideCard,
      isDarkMode,
      debug,
    } = options;
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
      layout: LAYOUT_PARAMS as any,
      paint: PAINT_PARAMS as any,
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

  get accessToken(): string {
    return config.ACCESS_TOKEN;
  }

  set accessToken(token: string) {
    config.ACCESS_TOKEN = token;
  }

  get baseUrl(): string {
    return config.BASE_URL;
  }

  set baseUrl(url: string) {
    config.BASE_URL = url;
  }

  get sourceUrl(): string {
    return config.SOURCE_URL;
  }

  set sourceUrl(sourceUrl: string) {
    config.SOURCE_URL = sourceUrl;
  }

  get telemetryUrl(): string {
    return config.TELEMETRY_URL;
  }

  set telemetryUrl(telemetryUrl: string) {
    config.TELEMETRY_URL = telemetryUrl;
  }

  get debug() {
    return config.DEBUG;
  }

  set debug(debug: boolean) {
    config.DEBUG = debug;
  }

  get layerSourceId(): string {
    return config.LAYER_SOURCE_ID;
  }

  set layerSourceId(layerSourceId: string) {
    config.LAYER_SOURCE_ID = layerSourceId;
  }

  get mobileMaxWidth(): number {
    return config.MOBILE_MAX_WIDTH;
  }

  set mobileMaxWidth(mobileMaxWidth: number) {
    config.MOBILE_MAX_WIDTH = mobileMaxWidth;
  }

  get isDarkMode(): boolean {
    return this._isDarkMode;
  }

  set isDarkMode(isDarkMode: boolean) {
    this._isDarkMode = isDarkMode;
  }

  get map() {
    return this._map;
  }

  get layer() {
    return this._map.getLayer(this._layerId);
  }

  get enablePromotionPopup(): boolean {
    return !this._enablePromotionCard && !this._enablePromotionSideCard;
  }

  set enablePromotionPopup(enablePromotionPopup: boolean) {
    if (enablePromotionPopup) {
      this._enablePromotionCard = false;
      this._enablePromotionSideCard = false;
    } else {
      this._enablePromotionCard = true;
      this._enablePromotionSideCard = false;
    }
  }

  get enablePromotionCard(): boolean {
    return this._enablePromotionCard;
  }

  set enablePromotionCard(enablePromotionCard: boolean) {
    this._enablePromotionCard = enablePromotionCard;
    this._enablePromotionSideCard = false;
  }

  get enablePromotionSideCard(): boolean {
    return this._enablePromotionSideCard;
  }

  set enablePromotionSideCard(enablePromotionSideCard: boolean) {
    this._enablePromotionCard = false;
    this._enablePromotionSideCard = enablePromotionSideCard;
  }

  private activate() {
    window.renderApp && window.renderApp(config);
    telemetryAPIs.sessionStart();
  }
  
  private reloadPromotionLalyer() {
    if (this._map.getSource(this._sourceId)) {
      this._map.removeSource(this._sourceId);
    }
    if (this._map.getLayer(this._layerId)) {
      this._map.removeLayer(this._layerId);
    }
    this._map.addSource(this._sourceId, this._source);
    this._map.addLayer(this._layer);
  }

  private load(event: { target: Map }) {
    this.fire(new Event(EVENT_TYPES.LOAD, { map: event.target }));
    this.reloadPromotionLalyer();
  }

  private render(_event: { target: Map }) {
    this.updateRenderedFeatures();
  }

  private move(event: mapboxgl.MapboxEvent<any> & mapboxgl.EventData) {
    const features = this.map.queryRenderedFeatures(undefined, { layers: [this._layerId] });
    const promotionFeatures = [];
    for (const feature of features) {
      feature.properties && feature.properties['adid'] && promotionFeatures.push(feature);
    }
    this.fire(
      new Event(EVENT_TYPES.MOVE, {
        map: event.target,
        originalEvent: event.originalEvent,
        features: promotionFeatures
      })
    );
  }

  private async show(feature: Feature) {
    if (this._enablePromotionSideCard) {
      if (!this._promotionSideCard) {
        throw new Error('It needs to be added PromotionSideCard handler.');
      }
      this._promotionSideCard.show(feature)
    } else if (this._enablePromotionCard) {
      if (!this._promotionCard) {
        throw new Error('It needs to be added PromotionCard handler.');
      }
      this._promotionCard.show(feature);
    } else {
      if (!this._promotionPopup) {
        throw new Error('It needs to be added PromotionPopup handler.');
      }
      this._promotionPopup.show(feature);
    }
  }

  private click(event: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] | undefined; } & mapboxgl.EventData) {
    try {
      const feature = event.features && event.features[0] as Feature;
      if (!feature) { return; }
      const { properties } = feature;
      const { adid } = properties;
      if (!adid) { return; }

      telemetryAPIs.sendSelection(adid, this.map.getZoom());
      this.fire(new Event(EVENT_TYPES.CLICK_PIN, {
        map: event.target,
        originalEvent: event.originalEvent,
        feature,
      }));
      this.show(feature);
    } catch (error: any) {
      console.error(error);
    }
  }

  private idle(_event: mapboxgl.MapboxEvent) {
    if (
      !this.map.getLayer(this._layerId) ||
      !this.map.getSource(this._sourceId)
    ) {
      this.reloadPromotionLalyer();
    }
  }

  public on(type: MapboxPromoted.EventTypes, listener: MapboxPromoted.Listener) {
    const listenerExists = this._listeners[type] && this._listeners[type].indexOf(listener) !== -1;
    if (!listenerExists) {
      this._listeners[type] = this._listeners[type] || [];
      this._listeners[type].push(listener);
    }
  }

  public off(type: MapboxPromoted.EventTypes, listener: MapboxPromoted.Listener) {
    if (this._listeners && this._listeners[type]) {
      const index = this._listeners[type].indexOf(listener);
      if (index !== -1) {
        this._listeners[type].splice(index, 1);
      }
    }
  }

  public fire(event: Event) {
    const { type, data } = event;
    const listeners = this._listeners && this._listeners[type] ? this._listeners[type].slice() : [];
    for (const listener of listeners) {
      listener.call(this, type, data);
    }
  }

  public selectPin(feature: Feature) {
    const { adid } = feature.properties as Feature.Properties;
    if (!adid) { return; }
    const textColor = createSelectedTextColor(adid);
    const textHaloColor = createSelectedTextHaloColor(adid);
    this._map.setPaintProperty(this._layerId, 'text-color', textColor);
    this._map.setPaintProperty(this._layerId, 'text-halo-color', textHaloColor);
  }

  public deselectPin() {
    this._map.setPaintProperty(
      this._layerId,
      'text-color',
      this.isDarkMode ? COLORS.FONT_COLOR_LIGHT : COLORS.FONT_COLOR_DARK,
    );
    this._map.setPaintProperty(
      this._layerId,
      'text-halo-color',
      this.isDarkMode ? COLORS.FONT_HALO_COLOR_LIGHT : COLORS.FONT_HALO_COLOR_DARK,
    );
  }

  private async styleImageMissing(event: any) {
    try {
      const imageId: string = event.id;
      if (
        imageId &&
        !this._map.hasImage(imageId) &&
        imageId.match(/^([a-zA-Z0-9]{21,22})$/)
      ) {
        const url = getImageUrl(imageId);
        this._map.loadImage(url, (error?: Error, image?: HTMLImageElement | ImageBitmap) => {
          if (error) { throw error; }
          if (!image) { throw new Error('getting image failed.'); }
          this._map.addImage(imageId, image);
        });
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  private updateRenderedFeatures() {
    const features = this.promotionFeatures();
    const disappearedFeatures: TelemetryAPI.Feature[] = [];

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

    disappearedFeatures.length && (
      telemetryAPIs.sendVisibilities(disappearedFeatures)
    );
  }

  // private hasListener(type: EventTypes) {
  //   return !!this._listeners && this._listeners[type] && this._listeners[type].length > 0;
  // }

  public addHandler(handler: MapboxPromoted.Handlers) {
    handler.initPromoted(this as any);
    switch (handler.id) {
      case 'PromotionPopup': {
        this._promotionPopup = handler as PromotionPopup;
        break;
      } case 'PromotionCard': {
        this._promotionCard = handler as PromotionCard;
        break;
      } case 'PromotionSideCard': {
        this._promotionSideCard = handler as PromotionSideCard;
        break;
      }
    }
  }

  public promotionFeatures(): Feature[] {
    if (!this.map.getLayer(this._layerId)) {
      return [];
    }
    const features = this.map.queryRenderedFeatures(undefined, { layers: [this._layerId] });
    const promotionFeatures: Feature[] = [];
    for (const feature of features) {
      feature.properties && feature.properties['adid'] && (
        promotionFeatures.push(feature as Feature)
      );
    }
    return promotionFeatures;
  }

  public showLayer() {
    this._map.setLayoutProperty(this._layerId, 'visibility', 'none');
  }

  public hideLayer() {
    this._map.setLayoutProperty(this._layerId, 'visibility', 'visible');
  }

  public deselectLayer() {
    this.deselectPin();
  }
}

export default MapboxPromoted;
