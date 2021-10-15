declare namespace PromotionCard {
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
 
declare var showPromotionCard: ((
  properties: Feature.Properties,
  onClick?: (type: PromotionCard.ClickTypes, adid: string) => void,
  onClose?: (adid: string) => void
) => void) | undefined;
declare var updatePromotionCard: ((properties: Feature.Properties) => void) | undefined;
declare var closePromotionCard: (() => void) | undefined;
