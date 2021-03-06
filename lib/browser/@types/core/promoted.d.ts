import mapboxgl from 'mapbox-gl';
import { Event } from './event';
import 'core-js';
declare class MapboxPromoted implements MapboxPromoted {
    private _map;
    private _source;
    private _layer;
    private _layerId;
    private _sourceId;
    private _isDarkMode;
    private _enablePromotionCard;
    private _enablePromotionSideCard;
    private _promotionCard?;
    private _promotionPopup?;
    private _promotionSideCard?;
    private _listeners;
    private _renderedFeaturesAdids;
    constructor(map: mapboxgl.Map, token: string, options?: MapboxPromoted.Options);
    get accessToken(): string;
    set accessToken(token: string);
    get baseUrl(): string;
    set baseUrl(url: string);
    get sourceUrl(): string;
    set sourceUrl(sourceUrl: string);
    get telemetryUrl(): string;
    set telemetryUrl(telemetryUrl: string);
    get debug(): boolean;
    set debug(debug: boolean);
    get layerSourceId(): string;
    set layerSourceId(layerSourceId: string);
    get mobileMaxWidth(): number;
    set mobileMaxWidth(mobileMaxWidth: number);
    get isDarkMode(): boolean;
    set isDarkMode(isDarkMode: boolean);
    get map(): mapboxgl.Map;
    get layer(): mapboxgl.AnyLayer;
    get enablePromotionPopup(): boolean;
    set enablePromotionPopup(enablePromotionPopup: boolean);
    get enablePromotionCard(): boolean;
    set enablePromotionCard(enablePromotionCard: boolean);
    get enablePromotionSideCard(): boolean;
    set enablePromotionSideCard(enablePromotionSideCard: boolean);
    private activate;
    private reloadPromotionLalyer;
    private load;
    private render;
    private move;
    private show;
    private click;
    private idle;
    on(type: MapboxPromoted.EventTypes, listener: MapboxPromoted.Listener): void;
    off(type: MapboxPromoted.EventTypes, listener: MapboxPromoted.Listener): void;
    fire(event: Event): void;
    selectPin(feature: Feature): void;
    deselectPin(): void;
    private styleImageMissing;
    private updateRenderedFeatures;
    addHandler(handler: MapboxPromoted.Handlers): void;
    promotionFeatures(): Feature[];
    showLayer(): void;
    hideLayer(): void;
    deselectLayer(): void;
}
export default MapboxPromoted;
