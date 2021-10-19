import * as telemetryAPIs from 'apis/telemetry';

export const EVENT_TYPES = {
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
} as const;

export const CLICK_TYPES = {
  CARD: 'card',
  TOGGLE: 'toggle',
  BANNER: 'banner',
  PHONE: 'phone',
  DIRECTIONS: 'directions',
  DETAIL: 'detail',
} as const;

export const TELEMETRY_ACTIONS: { [key: string]: TelemetryAPI.Actions } = {
  [CLICK_TYPES.BANNER]: telemetryAPIs.ACTIONS.BANNER,
  [CLICK_TYPES.PHONE]: telemetryAPIs.ACTIONS.CALL,
  [CLICK_TYPES.DIRECTIONS]: telemetryAPIs.ACTIONS.NAVIGATION,
  [CLICK_TYPES.DETAIL]: telemetryAPIs.ACTIONS.DETAIL,
} as const;
