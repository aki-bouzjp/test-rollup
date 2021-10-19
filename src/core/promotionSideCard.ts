import { formatProperties } from 'utils/feature';
import {
  insertElementEndpoint,
  updateElementEndpoint,
  removeElementEndpoint,
} from 'utils/browser';
import { Event } from './event';
import { EVENT_TYPES, TELEMETRY_ACTIONS } from './helpers';

import * as telemetryAPIs from 'apis/telemetry';

class PromotionSideCard {
  private _promoted?: MapboxPromoted;

  public get id() {
    return 'PromotionSideCard';
  }

  public initPromoted(promoted: MapboxPromoted) {
    this._promoted = promoted;
  }

  private sendAction(adid: string, clickType: PromotionSideCard.ClickTypes) {
    const action = TELEMETRY_ACTIONS[clickType];
    action && telemetryAPIs.sendAction(adid, action as TelemetryAPI.Actions);
  }

  public show(feature: Feature) {
    if (!this._promoted) {
      throw new Error('It needs to initPromoted.');
    }

    const properties = formatProperties(feature.properties);
    const card = document.querySelector('.mapboxgl-side-card');
    const adidClass = `mapboxgl-side-card-adid__${feature.properties.adid}`;
    const adidCard = document.querySelector(`.${adidClass}`);

    // when if same promotion icon was clicked, it deletes current promotion side card.
    if (card && adidCard) { return; }
    // when if another promotion icon was clicked, it updates promotion side card.
    if (card && !adidCard && updatePromotionSideCard) {
      this._promoted.fire(new Event(EVENT_TYPES.UPDATE_SIDE_CARD, { feature }));
      updateElementEndpoint('.mapboxgl-side-card', `mapboxgl-side-card ${adidClass}`);
      updatePromotionSideCard(properties);
      return;
    }

    this._promoted.fire(new Event(EVENT_TYPES.SHOW_SIDE_CARD, { feature }));
    insertElementEndpoint(`mapboxgl-side-card ${adidClass}`);

    showPromotionSideCard && showPromotionSideCard(
      properties,
      (clickType: PromotionSideCard.ClickTypes, adid: string) => {
        if (!this._promoted) { return; }
        this._promoted.fire(new Event(EVENT_TYPES.CLICK_SIDE_CARD, { clickType, feature }));
        this.sendAction(adid, clickType); 
      },
      (adid: string) => {
        if (!this._promoted) { return; }
        this._promoted.fire(new Event(EVENT_TYPES.CLOSE_SIDE_CARD, { feature }));
        this._promoted.deselectLayer();
        this.remove();
        telemetryAPIs.sendDeselection(adid);
      },
      (_adid: string) => {
        if (!this._promoted) { return; }
        this._promoted.fire(new Event(EVENT_TYPES.OPEN_SIDE_CARD, { feature }));
      },
      (_adid: string) => {
        if (!this._promoted) { return; }
        this._promoted.fire(new Event(EVENT_TYPES.HIDE_SIDE_CARD, { feature }));
      }
    );
  }

  private remove() {
    removeElementEndpoint('.mapboxgl-side-card');
  }
}

export default PromotionSideCard;
