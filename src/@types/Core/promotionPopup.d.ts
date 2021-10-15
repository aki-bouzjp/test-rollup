declare class PromotionPopup {
  private _promoted;
  private _popup?;
  constructor(promoted: MapboxPromoted);
  public get id(): string;
  public initPromoted(promoted: globalThis.MapboxPromoted): void;
  private sendAction;
  show(feature: Feature): void;
  remove(): void;
}
