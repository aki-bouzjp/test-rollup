declare namespace PromotionSideCard {
  const CLICK_TYPES: {
    readonly CARD: 'card';
    readonly TOGGLE: 'toggle';
    readonly BANNER: 'banner';
    readonly PHONE: 'phone';
    readonly DIRECTIONS: 'directions';
    readonly DETAIL: 'detail';
  };
  export type ClickTypes = typeof CLICK_TYPES[keyof typeof CLICK_TYPES];
}
 
declare var showPromotionSideCard: ((
  properties: Feature.Properties,
  onClick?: (type: PromotionSideCard.ClickTypes, adid: string) => void,
  onClose?: (adid: string) => void,
  onOpen?: (adid: string) => void,
  onHide?: (adid: string) => void,
) => void) | undefined;
declare var updatePromotionSideCard: ((properties: Feature.Properties) => void) | undefined;
declare var openPromotionSideCard: (() => void) | undefined;
declare var hidePromotionSideCard: (() => void) | undefined;
declare var closePromotionSideCard: (() => void) | undefined;
