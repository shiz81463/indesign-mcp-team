import type { SessionState, DocumentInfo } from '../types/index.js';
export declare class SessionManager {
    private sessions;
    getOrCreate(sessionId: string): SessionState;
    setActiveDoc(sessionId: string, doc: DocumentInfo): void;
    clearSession(sessionId: string): void;
    getAllSessions(): Map<string, SessionState>;
}
//# sourceMappingURL=SessionManager.d.ts.map