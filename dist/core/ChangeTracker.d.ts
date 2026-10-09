export interface ChangeInfo {
    lastChangedAt: number | null;
    changeCount: number;
    lastEventName: string | null;
}
/**
 * Pure state holder for plugin-pushed document events.
 * No InDesign dependency — fed by BridgeServer event routing.
 */
export declare class ChangeTracker {
    private lastChangedAt;
    private changeCount;
    private lastEventName;
    record(eventName: string, _payload?: unknown): void;
    getInfo(): ChangeInfo;
    hasChangedSince(timestamp: number | null): boolean;
}
//# sourceMappingURL=ChangeTracker.d.ts.map