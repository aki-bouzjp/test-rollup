// import { Popup } from 'mapbox-gl';
// import { formatProperties } from 'utils/feature';
// import { Event } from './event';
// import { EVENT_TYPES, TELEMETRY_ACTIONS } from './helpers';

// import * as telemetryAPIs from 'apis/telemetry';

// class PromotionPopup {
//   private _promoted?: MapboxPromoted;
//   private _popup?: Popup;

//   public get id() {
//     return 'PromotionPopup';
//   }

//   public initPromoted(promoted: MapboxPromoted) {
//     this._promoted = promoted;
//   }

//   private sendAction(adid: string, clickType: PromotionPopup.ClickTypes) {
//     const action = TELEMETRY_ACTIONS[clickType];
//     action && telemetryAPIs.sendAction(adid, action as TelemetryAPI.Actions);
//   }

//   public show(feature: Feature) {
//     if (!this._promoted) {
//       throw new Error('It needs to initPromoted.');
//     }

//     this.remove();

//     const properties = formatProperties(feature.properties);
//     const coordinates = (feature.geometry as any).coordinates.slice();
//     const adidClass = `mapboxgl-popup-adid__${properties.adid}`;
//     const popup = document.querySelector(`.${adidClass}`);
//     if (popup) { return; }

//     this._promoted.fire(new Event(EVENT_TYPES.SHOW_POPUP, { feature }));

//     this._popup = new Popup({
//       closeOnClick: false,
//       closeButton: false,
//       className: adidClass,
//     }).setLngLat(coordinates)
//       .setHTML(`<div class="mapboxgl-popup-content-adid__${properties.adid}" />`)
//       .addTo(this._promoted.map);

//     showPromotionPopup && showPromotionPopup(
//       properties,
//       (clickType: PromotionPopup.ClickTypes, adid: string) => {
//         if (!this._promoted) { return; }
//         this._promoted.fire(new Event(EVENT_TYPES.CLICK_POPUP, { clickType, feature }));
//         this.sendAction(adid, clickType); 
//       },
//       (adid: string) => {
//         if (!this._promoted) { return; }
//         this._promoted.fire(new Event(EVENT_TYPES.CLOSE_POPUP, { feature }));
//         this._promoted.deselectLayer();
//         this.remove();
//         telemetryAPIs.sendDeselection(adid);
//       }
//     );
//     this._promoted.selectPin(feature);
//   }

//   public remove() {
//     if (!this._popup) { return; }
//     this._popup.remove.bind(this);
//     this._popup = undefined;
//   }
// }

// export default PromotionPopup;
