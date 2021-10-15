declare class PromotionPopup {
    private _promoted?;
    private _popup?;
    get id(): string;
    initPromoted(promoted: MapboxPromoted): void;
    private sendAction;
    show(feature: Feature): void;
    remove(): void;
}
export default PromotionPopup;
