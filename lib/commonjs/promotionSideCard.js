define(['./feature-1542df70', './browser-1423c416', 'http', 'https', 'url', 'stream', 'assert', 'zlib'], (function (feature, browser, require$$1, require$$2, require$$0, require$$3, require$$4, require$$8) { 'use strict';

    class PromotionSideCard {
        _promoted;
        get id() {
            return 'PromotionSideCard';
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
            const card = document.querySelector('.mapboxgl-side-card');
            const adidClass = `mapboxgl-side-card-adid__${feature$1.properties.adid}`;
            const adidCard = document.querySelector(`.${adidClass}`);
            // when if same promotion icon was clicked, it deletes current promotion side card.
            if (card && adidCard) {
                return;
            }
            // when if another promotion icon was clicked, it updates promotion side card.
            if (card && !adidCard && updatePromotionSideCard) {
                this._promoted.fire(new feature.Event(feature.EVENT_TYPES.UPDATE_SIDE_CARD, { feature: feature$1 }));
                browser.updateElementEndpoint('.mapboxgl-side-card', `mapboxgl-side-card ${adidClass}`);
                updatePromotionSideCard(properties);
                return;
            }
            this._promoted.fire(new feature.Event(feature.EVENT_TYPES.SHOW_SIDE_CARD, { feature: feature$1 }));
            browser.insertElementEndpoint(`mapboxgl-side-card ${adidClass}`);
            showPromotionSideCard && showPromotionSideCard(properties, (clickType, adid) => {
                if (!this._promoted) {
                    return;
                }
                this._promoted.fire(new feature.Event(feature.EVENT_TYPES.CLICK_SIDE_CARD, { clickType, feature: feature$1 }));
                this.sendAction(adid, clickType);
            }, (adid) => {
                if (!this._promoted) {
                    return;
                }
                this._promoted.fire(new feature.Event(feature.EVENT_TYPES.CLOSE_SIDE_CARD, { feature: feature$1 }));
                this._promoted.deselectLayer();
                this.remove();
                feature.sendDeselection(adid);
            }, (_adid) => {
                if (!this._promoted) {
                    return;
                }
                this._promoted.fire(new feature.Event(feature.EVENT_TYPES.OPEN_SIDE_CARD, { feature: feature$1 }));
            }, (_adid) => {
                if (!this._promoted) {
                    return;
                }
                this._promoted.fire(new feature.Event(feature.EVENT_TYPES.HIDE_SIDE_CARD, { feature: feature$1 }));
            });
        }
        remove() {
            browser.removeElementEndpoint('.mapboxgl-side-card');
        }
    }

    return PromotionSideCard;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbW90aW9uU2lkZUNhcmQuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL3Byb21vdGlvblNpZGVDYXJkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZvcm1hdFByb3BlcnRpZXMgfSBmcm9tICd1dGlscy9mZWF0dXJlJztcbmltcG9ydCB7XG4gIGluc2VydEVsZW1lbnRFbmRwb2ludCxcbiAgdXBkYXRlRWxlbWVudEVuZHBvaW50LFxuICByZW1vdmVFbGVtZW50RW5kcG9pbnQsXG59IGZyb20gJ3V0aWxzL2Jyb3dzZXInO1xuaW1wb3J0IHsgRXZlbnQgfSBmcm9tICcuL2V2ZW50JztcbmltcG9ydCB7IEVWRU5UX1RZUEVTLCBURUxFTUVUUllfQUNUSU9OUyB9IGZyb20gJy4vaGVscGVycyc7XG5cbmltcG9ydCAqIGFzIHRlbGVtZXRyeUFQSXMgZnJvbSAnYXBpcy90ZWxlbWV0cnknO1xuXG5jbGFzcyBQcm9tb3Rpb25TaWRlQ2FyZCB7XG4gIHByaXZhdGUgX3Byb21vdGVkPzogTWFwYm94UHJvbW90ZWQ7XG5cbiAgcHVibGljIGdldCBpZCgpIHtcbiAgICByZXR1cm4gJ1Byb21vdGlvblNpZGVDYXJkJztcbiAgfVxuXG4gIHB1YmxpYyBpbml0UHJvbW90ZWQocHJvbW90ZWQ6IE1hcGJveFByb21vdGVkKSB7XG4gICAgdGhpcy5fcHJvbW90ZWQgPSBwcm9tb3RlZDtcbiAgfVxuXG4gIHByaXZhdGUgc2VuZEFjdGlvbihhZGlkOiBzdHJpbmcsIGNsaWNrVHlwZTogUHJvbW90aW9uU2lkZUNhcmQuQ2xpY2tUeXBlcykge1xuICAgIGNvbnN0IGFjdGlvbiA9IFRFTEVNRVRSWV9BQ1RJT05TW2NsaWNrVHlwZV07XG4gICAgYWN0aW9uICYmIHRlbGVtZXRyeUFQSXMuc2VuZEFjdGlvbihhZGlkLCBhY3Rpb24gYXMgVGVsZW1ldHJ5QVBJLkFjdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIHNob3coZmVhdHVyZTogRmVhdHVyZSkge1xuICAgIGlmICghdGhpcy5fcHJvbW90ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSXQgbmVlZHMgdG8gaW5pdFByb21vdGVkLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBmb3JtYXRQcm9wZXJ0aWVzKGZlYXR1cmUucHJvcGVydGllcyk7XG4gICAgY29uc3QgY2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXBib3hnbC1zaWRlLWNhcmQnKTtcbiAgICBjb25zdCBhZGlkQ2xhc3MgPSBgbWFwYm94Z2wtc2lkZS1jYXJkLWFkaWRfXyR7ZmVhdHVyZS5wcm9wZXJ0aWVzLmFkaWR9YDtcbiAgICBjb25zdCBhZGlkQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke2FkaWRDbGFzc31gKTtcblxuICAgIC8vIHdoZW4gaWYgc2FtZSBwcm9tb3Rpb24gaWNvbiB3YXMgY2xpY2tlZCwgaXQgZGVsZXRlcyBjdXJyZW50IHByb21vdGlvbiBzaWRlIGNhcmQuXG4gICAgaWYgKGNhcmQgJiYgYWRpZENhcmQpIHsgcmV0dXJuOyB9XG4gICAgLy8gd2hlbiBpZiBhbm90aGVyIHByb21vdGlvbiBpY29uIHdhcyBjbGlja2VkLCBpdCB1cGRhdGVzIHByb21vdGlvbiBzaWRlIGNhcmQuXG4gICAgaWYgKGNhcmQgJiYgIWFkaWRDYXJkICYmIHVwZGF0ZVByb21vdGlvblNpZGVDYXJkKSB7XG4gICAgICB0aGlzLl9wcm9tb3RlZC5maXJlKG5ldyBFdmVudChFVkVOVF9UWVBFUy5VUERBVEVfU0lERV9DQVJELCB7IGZlYXR1cmUgfSkpO1xuICAgICAgdXBkYXRlRWxlbWVudEVuZHBvaW50KCcubWFwYm94Z2wtc2lkZS1jYXJkJywgYG1hcGJveGdsLXNpZGUtY2FyZCAke2FkaWRDbGFzc31gKTtcbiAgICAgIHVwZGF0ZVByb21vdGlvblNpZGVDYXJkKHByb3BlcnRpZXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3Byb21vdGVkLmZpcmUobmV3IEV2ZW50KEVWRU5UX1RZUEVTLlNIT1dfU0lERV9DQVJELCB7IGZlYXR1cmUgfSkpO1xuICAgIGluc2VydEVsZW1lbnRFbmRwb2ludChgbWFwYm94Z2wtc2lkZS1jYXJkICR7YWRpZENsYXNzfWApO1xuXG4gICAgc2hvd1Byb21vdGlvblNpZGVDYXJkICYmIHNob3dQcm9tb3Rpb25TaWRlQ2FyZChcbiAgICAgIHByb3BlcnRpZXMsXG4gICAgICAoY2xpY2tUeXBlOiBQcm9tb3Rpb25TaWRlQ2FyZC5DbGlja1R5cGVzLCBhZGlkOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLl9wcm9tb3RlZCkgeyByZXR1cm47IH1cbiAgICAgICAgdGhpcy5fcHJvbW90ZWQuZmlyZShuZXcgRXZlbnQoRVZFTlRfVFlQRVMuQ0xJQ0tfU0lERV9DQVJELCB7IGNsaWNrVHlwZSwgZmVhdHVyZSB9KSk7XG4gICAgICAgIHRoaXMuc2VuZEFjdGlvbihhZGlkLCBjbGlja1R5cGUpOyBcbiAgICAgIH0sXG4gICAgICAoYWRpZDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5fcHJvbW90ZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgIHRoaXMuX3Byb21vdGVkLmZpcmUobmV3IEV2ZW50KEVWRU5UX1RZUEVTLkNMT1NFX1NJREVfQ0FSRCwgeyBmZWF0dXJlIH0pKTtcbiAgICAgICAgdGhpcy5fcHJvbW90ZWQuZGVzZWxlY3RMYXllcigpO1xuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICB0ZWxlbWV0cnlBUElzLnNlbmREZXNlbGVjdGlvbihhZGlkKTtcbiAgICAgIH0sXG4gICAgICAoX2FkaWQ6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuX3Byb21vdGVkKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLl9wcm9tb3RlZC5maXJlKG5ldyBFdmVudChFVkVOVF9UWVBFUy5PUEVOX1NJREVfQ0FSRCwgeyBmZWF0dXJlIH0pKTtcbiAgICAgIH0sXG4gICAgICAoX2FkaWQ6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuX3Byb21vdGVkKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLl9wcm9tb3RlZC5maXJlKG5ldyBFdmVudChFVkVOVF9UWVBFUy5ISURFX1NJREVfQ0FSRCwgeyBmZWF0dXJlIH0pKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmUoKSB7XG4gICAgcmVtb3ZlRWxlbWVudEVuZHBvaW50KCcubWFwYm94Z2wtc2lkZS1jYXJkJyk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvbW90aW9uU2lkZUNhcmQ7XG4iXSwibmFtZXMiOlsiVEVMRU1FVFJZX0FDVElPTlMiLCJ0ZWxlbWV0cnlBUElzLnNlbmRBY3Rpb24iLCJmZWF0dXJlIiwiZm9ybWF0UHJvcGVydGllcyIsIkV2ZW50IiwiRVZFTlRfVFlQRVMiLCJ1cGRhdGVFbGVtZW50RW5kcG9pbnQiLCJpbnNlcnRFbGVtZW50RW5kcG9pbnQiLCJ0ZWxlbWV0cnlBUElzLnNlbmREZXNlbGVjdGlvbiIsInJlbW92ZUVsZW1lbnRFbmRwb2ludCJdLCJtYXBwaW5ncyI6Ijs7SUFXQSxNQUFNLGlCQUFpQjtRQUNiLFNBQVMsQ0FBa0I7UUFFbkMsSUFBVyxFQUFFO1lBQ1gsT0FBTyxtQkFBbUIsQ0FBQztTQUM1QjtRQUVNLFlBQVksQ0FBQyxRQUF3QjtZQUMxQyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztTQUMzQjtRQUVPLFVBQVUsQ0FBQyxJQUFZLEVBQUUsU0FBdUM7WUFDdEUsTUFBTSxNQUFNLEdBQUdBLHlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sSUFBSUMsa0JBQXdCLENBQUMsSUFBSSxFQUFFLE1BQThCLENBQUMsQ0FBQztTQUMxRTtRQUVNLElBQUksQ0FBQ0MsU0FBZ0I7WUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQzthQUM5QztZQUVELE1BQU0sVUFBVSxHQUFH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
