declare class PromotionSideCard {
  private _promoted;
  constructor(promoted: MapboxPromoted);
  public get id(): string;
  public initPromoted(promoted: globalThis.MapboxPromoted): void;
  private sendAction;
  private remove;
  show(feature: Feature): void;
}
