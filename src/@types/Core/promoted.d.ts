declare namespace MapboxPromoted {
  type Options = {
    baseUrl?: string;
    sourceUrl?: string;
    telemetryUrl?: string;
    mobileMaxWidth?: number;
    enablePromotionCard?: boolean;
    enablePromotionSideCard?: boolean;
    isDarkMode?: boolean;
    debug?: boolean;
  };

  class Event {
    type: MapboxPromoted.EventTypes;
    data: Object;
    constructor(type: MapboxPromoted.EventTypes, data?: Object);
  }

  const EVENT_TYPES: {
    readonly LOAD: 'load';
    readonly MOVE: 'move';
    readonly CLICK_PIN: 'click_pin';

    readonly CLICK_CARD: 'click_card';
    readonly SHOW_CARD: 'show_card';
    readonly UPDATE_CARD: 'update_card';
    readonly CLOSE_CARD: 'close_card';

    readonly CLICK_SIDE_CARD: 'click_side_card';
    readonly SHOW_SIDE_CARD: 'show_side_card';
    readonly UPDATE_SIDE_CARD: 'update_side_card';
    readonly OPEN_SIDE_CARD: 'open_side_card';
    readonly HIDE_SIDE_CARD: 'hide_side_card';
    readonly CLOSE_SIDE_CARD: 'close_side_card';

    readonly CLICK_POPUP: 'click_popup';
    readonly SHOW_POPUP: 'show_popup';
    readonly CLOSE_POPUP: 'close_popup';
  }
  
  type EventTypes = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];
  type Listener = (type: EventTypes, event: any) => any;
  type Listeners = { [key: string]: Array<Listener> };
  type Handlers = PromotionPopup | PromotionCard | PromotionSideCard;
}

declare class MapboxPromoted {
  private _map: mapboxgl.Map;
  private _source: mapboxgl.VectorSource;
  private _layer: mapboxgl.SymbolLayer;
  private _layerId: 'promotion-symbols';
  private _sourceId: 'promotions-source';
  private _isDarkMode: boolean;
  private _enablePromotionCard: boolean;
  private _enablePromotionSideCard: boolean;
  private _promotionCard?: PromotionCard;
  private _promotionPopup?: PromotionPopup;
  private _promotionSideCard?: PromotionSideCard;
  private _listeners: MapboxPromoted.Listeners;
  private _renderedFeaturesAdids: { adid: string; visibleStartTime: number; }[];
  
  constructor(map: mapboxgl.Map, token: string, options?: MapboxPromoted.Options);

  get accessToken(): string;
  set accessToken(token: string);
  get baseUrl(): string;
  set baseUrl(url: string);
  get telemetryUrl(): string;
  set telemetryUrl(telemetryUrl: string);
  get sourceUrl(): string;
  set sourceUrl(sourceUrl: string);
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
  private styleImageMissing;
  private updateRenderedFeatures;

  on(type: MapboxPromoted.EventTypes, listener: MapboxPromoted.Listener): void;
  off(type: MapboxPromoted.EventTypes, listener: MapboxPromoted.Listener): void;
  fire(event: MapboxPromoted.Event): void;
  selectPin(feature: Feature): void;
  deselectPin(): void;
  promotionFeatures(): Feature[];
  showLayer(): void;
  hideLayer(): void;
  deselectLayer(): void;
}
