define(['./feature-1542df70', './browser-1423c416', 'http', 'https', 'url', 'stream', 'assert', 'zlib'], (function (feature, browser, require$$1, require$$2, require$$0, require$$3, require$$4, require$$8) { 'use strict';

    class PromotionCard {
        _promoted;
        get id() {
            return 'PromotionCard';
        }
        initPromoted(promoted) {
            this._promoted = promoted;
        }
        sendAction(adid, clickType) {
            const action = feature.TELEMETRY_ACTIONS[clickType];
            action && feature.sendAction(adid, action);
        }
        show(feature$1) {
            if (!this._promoted) {
                throw new Error('It needs to initPromoted.');
            }
            const properties = feature.formatProperties(feature$1.properties);
            const card = document.querySelector('.mapboxgl-card');
            const adidClass = `mapboxgl-card-adid__${feature$1.properties.adid}`;
            const adidCard = document.querySelector(`.${adidClass}`);
            // when if same promotion icon was clicked, it deletes current promotion card.
            if (card && adidCard) {
                return;
            }
            // when if another promotion icon was clicked, it updates promotion card.
            if (card && !adidCard && updatePromotionCard) {
                this._promoted.fire(new feature.Event(feature.EVENT_TYPES.UPDATE_CARD, { feature: feature$1 }));
                browser.updateElementEndpoint('.mapboxgl-card', `mapboxgl-card ${adidClass}`);
                updatePromotionCard(properties);
                return;
            }
            this._promoted.fire(new feature.Event(feature.EVENT_TYPES.SHOW_CARD, { feature: feature$1 }));
            browser.insertElementEndpoint(`mapboxgl-card ${adidClass}`);
            showPromotionCard && showPromotionCard(properties, (clickType, adid) => {
                if (!this._promoted) {
                    return;
                }
                this._promoted.fire(new feature.Event(feature.EVENT_TYPES.CLICK_CARD, { clickType, feature: feature$1 }));
                this.sendAction(adid, clickType);
            }, (adid) => {
                if (!this._promoted) {
                    return;
                }
                this._promoted.fire(new feature.Event(feature.EVENT_TYPES.CLOSE_CARD, { feature: feature$1 }));
                this._promoted.deselectLayer();
                this.remove();
                feature.sendDeselection(adid);
            });
        }
        remove() {
            browser.removeElementEndpoint('.mapboxgl-card');
        }
    }

    return PromotionCard;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbW90aW9uQ2FyZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvcmUvcHJvbW90aW9uQ2FyZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmb3JtYXRQcm9wZXJ0aWVzIH0gZnJvbSAndXRpbHMvZmVhdHVyZSc7XG5pbXBvcnQge1xuICBpbnNlcnRFbGVtZW50RW5kcG9pbnQsXG4gIHVwZGF0ZUVsZW1lbnRFbmRwb2ludCxcbiAgcmVtb3ZlRWxlbWVudEVuZHBvaW50LFxufSBmcm9tICd1dGlscy9icm93c2VyJztcbmltcG9ydCB7IEV2ZW50IH0gZnJvbSAnLi9ldmVudCc7XG5pbXBvcnQgeyBFVkVOVF9UWVBFUywgVEVMRU1FVFJZX0FDVElPTlMgfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5pbXBvcnQgKiBhcyB0ZWxlbWV0cnlBUElzIGZyb20gJ2FwaXMvdGVsZW1ldHJ5JztcblxuY2xhc3MgUHJvbW90aW9uQ2FyZCB7XG4gIHByaXZhdGUgX3Byb21vdGVkPzogTWFwYm94UHJvbW90ZWQ7XG5cbiAgcHVibGljIGdldCBpZCgpIHtcbiAgICByZXR1cm4gJ1Byb21vdGlvbkNhcmQnO1xuICB9XG5cbiAgcHVibGljIGluaXRQcm9tb3RlZChwcm9tb3RlZDogTWFwYm94UHJvbW90ZWQpIHtcbiAgICB0aGlzLl9wcm9tb3RlZCA9IHByb21vdGVkO1xuICB9XG5cbiAgcHJpdmF0ZSBzZW5kQWN0aW9uKGFkaWQ6IHN0cmluZywgY2xpY2tUeXBlOiBQcm9tb3Rpb25DYXJkLkNsaWNrVHlwZXMpIHtcbiAgICBjb25zdCBhY3Rpb24gPSBURUxFTUVUUllfQUNUSU9OU1tjbGlja1R5cGVdO1xuICAgIGFjdGlvbiAmJiB0ZWxlbWV0cnlBUElzLnNlbmRBY3Rpb24oYWRpZCwgYWN0aW9uIGFzIFRlbGVtZXRyeUFQSS5BY3Rpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyBzaG93KGZlYXR1cmU6IEZlYXR1cmUpIHtcbiAgICBpZiAoIXRoaXMuX3Byb21vdGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0l0IG5lZWRzIHRvIGluaXRQcm9tb3RlZC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gZm9ybWF0UHJvcGVydGllcyhmZWF0dXJlLnByb3BlcnRpZXMpO1xuICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFwYm94Z2wtY2FyZCcpO1xuICAgIGNvbnN0IGFkaWRDbGFzcyA9IGBtYXBib3hnbC1jYXJkLWFkaWRfXyR7ZmVhdHVyZS5wcm9wZXJ0aWVzLmFkaWR9YDtcbiAgICBjb25zdCBhZGlkQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke2FkaWRDbGFzc31gKTtcblxuICAgIC8vIHdoZW4gaWYgc2FtZSBwcm9tb3Rpb24gaWNvbiB3YXMgY2xpY2tlZCwgaXQgZGVsZXRlcyBjdXJyZW50IHByb21vdGlvbiBjYXJkLlxuICAgIGlmIChjYXJkICYmIGFkaWRDYXJkKSB7IHJldHVybjsgfVxuICAgIC8vIHdoZW4gaWYgYW5vdGhlciBwcm9tb3Rpb24gaWNvbiB3YXMgY2xpY2tlZCwgaXQgdXBkYXRlcyBwcm9tb3Rpb24gY2FyZC5cbiAgICBpZiAoY2FyZCAmJiAhYWRpZENhcmQgJiYgdXBkYXRlUHJvbW90aW9uQ2FyZCkge1xuICAgICAgdGhpcy5fcHJvbW90ZWQuZmlyZShuZXcgRXZlbnQoRVZFTlRfVFlQRVMuVVBEQVRFX0NBUkQsIHsgZmVhdHVyZSB9KSk7XG4gICAgICB1cGRhdGVFbGVtZW50RW5kcG9pbnQoJy5tYXBib3hnbC1jYXJkJywgYG1hcGJveGdsLWNhcmQgJHthZGlkQ2xhc3N9YCk7XG4gICAgICB1cGRhdGVQcm9tb3Rpb25DYXJkKHByb3BlcnRpZXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3Byb21vdGVkLmZpcmUobmV3IEV2ZW50KEVWRU5UX1RZUEVTLlNIT1dfQ0FSRCwgeyBmZWF0dXJlIH0pKTtcbiAgICBpbnNlcnRFbGVtZW50RW5kcG9pbnQoYG1hcGJveGdsLWNhcmQgJHthZGlkQ2xhc3N9YCk7XG4gICAgXG4gICAgc2hvd1Byb21vdGlvbkNhcmQgJiYgc2hvd1Byb21vdGlvbkNhcmQoXG4gICAgICBwcm9wZXJ0aWVzLFxuICAgICAgKGNsaWNrVHlwZTogUHJvbW90aW9uQ2FyZC5DbGlja1R5cGVzLCBhZGlkOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLl9wcm9tb3RlZCkgeyByZXR1cm47IH1cbiAgICAgICAgdGhpcy5fcHJvbW90ZWQuZmlyZShuZXcgRXZlbnQoRVZFTlRfVFlQRVMuQ0xJQ0tfQ0FSRCwgeyBjbGlja1R5cGUsIGZlYXR1cmUgfSkpO1xuICAgICAgICB0aGlzLnNlbmRBY3Rpb24oYWRpZCwgY2xpY2tUeXBlKTsgXG4gICAgICB9LFxuICAgICAgKGFkaWQ6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuX3Byb21vdGVkKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLl9wcm9tb3RlZC5maXJlKG5ldyBFdmVudChFVkVOVF9UWVBFUy5DTE9TRV9DQVJELCB7IGZlYXR1cmUgfSkpO1xuICAgICAgICB0aGlzLl9wcm9tb3RlZC5kZXNlbGVjdExheWVyKCk7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIHRlbGVtZXRyeUFQSXMuc2VuZERlc2VsZWN0aW9uKGFkaWQpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZSgpIHtcbiAgICByZW1vdmVFbGVtZW50RW5kcG9pbnQoJy5tYXBib3hnbC1jYXJkJyk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvbW90aW9uQ2FyZDtcbiJdLCJuYW1lcyI6WyJURUxFTUVUUllfQUNUSU9OUyIsInRlbGVtZXRyeUFQSXMuc2VuZEFjdGlvbiIsImZlYXR1cmUiLCJmb3JtYXRQcm9wZXJ0aWVzIiwiRXZlbnQiLCJFVkVOVF9UWVBFUyIsInVwZGF0ZUVsZW1lbnRFbmRwb2ludCIsImluc2VydEVsZW1lbnRFbmRwb2ludCIsInRl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
