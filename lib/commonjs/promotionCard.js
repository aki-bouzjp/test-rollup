"use strict";var e=require("./feature-54323509.js"),o=require("./browser-ef557d00.js");require("axios"),require("date-fns");module.exports=class{_promoted;get id(){return"PromotionCard"}initPromoted(e){this._promoted=e}sendAction(o,r){const t=e.TELEMETRY_ACTIONS[r];t&&e.sendAction(o,t)}show(r){if(!this._promoted)throw new Error("It needs to initPromoted.");const t=e.formatProperties(r.properties),i=document.querySelector(".mapboxgl-card"),d=`mapboxgl-card-adid__${r.properties.adid}`,n=document.querySelector(`.${d}`);if(!i||!n){if(i&&!n&&updatePromotionCard)return this._promoted.fire(new e.Event(e.EVENT_TYPES.UPDATE_CARD,{feature:r})),o.updateElementEndpoint(".mapboxgl-card",`mapboxgl-card ${d}`),void updatePromotionCard(t);this._promoted.fire(new e.Event(e.EVENT_TYPES.SHOW_CARD,{feature:r})),o.insertElementEndpoint(`mapboxgl-card ${d}`),showPromotionCard&&showPromotionCard(t,((o,t)=>{this._promoted&&(this._promoted.fire(new e.Event(e.EVENT_TYPES.CLICK_CARD,{clickType:o,feature:r})),this.sendAction(t,o))}),(o=>{this._promoted&&(this._promoted.fire(new e.Event(e.EVENT_TYPES.CLOSE_CARD,{feature:r})),this._promoted.deselectLayer(),this.remove(),e.sendDeselection(o))}))}}remove(){o.removeElementEndpoint(".mapboxgl-card")}};