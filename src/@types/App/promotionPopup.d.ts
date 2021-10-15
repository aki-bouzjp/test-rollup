declare namespace PromotionPopup {
  const CLICK_TYPES: {
    readonly POPUP: 'popup';
    readonly BANNER: 'banner';
    readonly PHONE: 'phone';
    readonly DIRECTIONS: 'directions';
    readonly DETAIL: 'detail';
  };
  export type ClickTypes = typeof CLICK_TYPES[keyof typeof CLICK_TYPES];
}

declare var showPromotionPopup: ((
  properties: Feature.Properties,
  onClick?: (type: PromotionPopup.ClickTypes, adid: string) => void,
  onClose?: (adid: string) => void
) => void) | undefined;
declare var closePromotionPopup: (() => void) | undefined;
