import { formatProperties } from 'utils/feature';
import {
  insertElementEndpoint,
  updateElementEndpoint,
  removeElementEndpoint,
} from 'utils/browser';
import { Event } from './event';
// import { EVENT_TYPES, TELEMETRY_ACTIONS } from './helpers';

import * as telemetryAPIs from 'apis/telemetry';

class PromotionCard {
  private _promoted?: MapboxPromoted;

  public get id() {
    return 'PromotionCard';
  }

  public initPromoted(promoted: MapboxPromoted) {
    this._promoted = promoted;
  }

  private sendAction(adid: string, clickType: PromotionCard.ClickTypes) {
    console.log(Event, telemetryAPIs);
    // const action = TELEMETRY_ACTIONS[clickType];
    // action && telemetryAPIs.sendAction(adid, action as TelemetryAPI.Actions);
  }

  public show(feature: Feature) {
    if (!this._promoted) {
      throw new Error('It needs to initPromoted.');
    }

    const properties = formatProperties(feature.properties);
    const card = document.querySelector('.mapboxgl-card');
    const adidClass = `mapboxgl-card-adid__${feature.properties.adid}`;
    const adidCard = document.querySelector(`.${adidClass}`);

    // when if same promotion icon was clicked, it deletes current promotion card.
    if (card && adidCard) { return; }
    // when if another promotion icon was clicked, it updates promotion card.
    if (card && !adidCard && updatePromotionCard) {
      // this._promoted.fire(new Event(EVENT_TYPES.UPDATE_CARD, { feature }));
      updateElementEndpoint('.mapboxgl-card', `mapboxgl-card ${adidClass}`);
      updatePromotionCard(properties);
      return;
    }

    // this._promoted.fire(new Event(EVENT_TYPES.SHOW_CARD, { feature }));
    insertElementEndpoint(`mapboxgl-card ${adidClass}`);
    
    showPromotionCard && showPromotionCard(
      properties,
      (clickType: PromotionCard.ClickTypes, adid: string) => {
        if (!this._promoted) { return; }
        // this._promoted.fire(new Event(EVENT_TYPES.CLICK_CARD, { clickType, feature }));
        this.sendAction(adid, clickType); 
      },
      (adid: string) => {
        if (!this._promoted) { return; }
        // this._promoted.fire(new Event(EVENT_TYPES.CLOSE_CARD, { feature }));
        this._promoted.deselectLayer();
        this.remove();
        // telemetryAPIs.sendDeselection(adid);
      }
    );
  }

  private remove() {
    removeElementEndpoint('.mapboxgl-card');
  }
}

export default PromotionCard;
