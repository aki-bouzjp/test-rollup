import{e,f as o,E as r,a as t,g as i,T as d}from"./feature-f06192da.js";import{u as s,i as a,r as m}from"./browser-0ec08580.js";import"http";import"https";import"url";import"stream";import"assert";import"zlib";class p{_promoted;get id(){return"PromotionSideCard"}initPromoted(e){this._promoted=e}sendAction(o,r){const t=d[r];t&&e(o,t)}show(e){if(!this._promoted)throw new Error("It needs to initPromoted.");const d=o(e.properties),m=document.querySelector(".mapboxgl-side-card"),p=`mapboxgl-side-card-adid__${e.properties.adid}`,_=document.querySelector(`.${p}`);if(!m||!_){if(m&&!_&&updatePromotionSideCard)return this._promoted.fire(new r(t.UPDATE_SIDE_CARD,{feature:e})),s(".mapboxgl-side-card",`mapboxgl-side-card ${p}`),void updatePromotionSideCard(d);this._promoted.fire(new r(t.SHOW_SIDE_CARD,{feature:e})),a(`mapboxgl-side-card ${p}`),showPromotionSideCard&&showPromotionSideCard(d,((o,i)=>{this._promoted&&(this._promoted.fire(new r(t.CLICK_SIDE_CARD,{clickType:o,feature:e})),this.sendAction(i,o))}),(o=>{this._promoted&&(this._promoted.fire(new r(t.CLOSE_SIDE_CARD,{feature:e})),this._promoted.deselectLayer(),this.remove(),i(o))}),(o=>{this._promoted&&this._promoted.fire(new r(t.OPEN_SIDE_CARD,{feature:e}))}),(o=>{this._promoted&&this._promoted.fire(new r(t.HIDE_SIDE_CARD,{feature:e}))}))}}remove(){m(".mapboxgl-side-card")}}export{p as default};