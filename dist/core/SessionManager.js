export class SessionManager {
    sessions = new Map();
    getOrCreate(sessionId) {
        let session = this.sessions.get(sessionId);
        if (!session) {
            session = { documentHistory: [] };
            this.sessions.set(sessionId, session);
        }
        return session;
    }
    setActiveDoc(sessionId, doc) {
        const session = this.getOrCreate(sessionId);
        session.activeDoc = doc;
        if (!session.documentHistory.includes(doc.name)) {
            session.documentHistory.push(doc.name);
        }
    }
    clearSession(sessionId) {
        this.sessions.delete(sessionId);
    }
    getAllSessions() {
        return this.sessions;
    }
}
//# sourceMappingURL=SessionManager.js.map