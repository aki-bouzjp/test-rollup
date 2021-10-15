declare class PromotionSideCard {
    private _promoted?;
    get id(): string;
    initPromoted(promoted: MapboxPromoted): void;
    private sendAction;
    show(feature: Feature): void;
    private remove;
}
export default PromotionSideCard;
