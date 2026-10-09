/**
 * Pure state holder for plugin-pushed document events.
 * No InDesign dependency — fed by BridgeServer event routing.
 */
export class ChangeTracker {
    lastChangedAt = null;
    changeCount = 0;
    lastEventName = null;
    record(eventName, _payload) {
        this.lastChangedAt = Date.now();
        this.changeCount += 1;
        this.lastEventName = eventName;
    }
    getInfo() {
        return {
            lastChangedAt: this.lastChangedAt,
            changeCount: this.changeCount,
            lastEventName: this.lastEventName,
        };
    }
    hasChangedSince(timestamp) {
        if (this.lastChangedAt === null) {
            return false;
        }
        if (timestamp === null) {
            return true;
        }
        return this.lastChangedAt > timestamp;
    }
}
//# sourceMappingURL=ChangeTracker.js.map