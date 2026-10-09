import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { InDesignError } from '../utils/errorHandler.js';
import { wrapExtendScript } from './wrapExtendScript.js';
export class ScriptExecutor extends EventEmitter {
    pending = new Map();
    defaultTimeout;
    _undoGroupActive = false;
    _connected = false;
    constructor(defaultTimeout = 30000) {
        super();
        this.defaultTimeout = defaultTimeout;
    }
    /**
     * Called by the BridgeServer when a plugin client connects or disconnects.
     * Connection state is independent from the pending request queue.
     */
    setConnected(connected) {
        this._connected = connected;
    }
    get undoGroupActive() {
        return this._undoGroupActive;
    }
    startUndoGroup() {
        this._undoGroupActive = true;
    }
    endUndoGroup() {
        this._undoGroupActive = false;
    }
    async execute(code, timeout, debug) {
        const fullCode = wrapExtendScript(code, {
            debug,
            undoGroupActive: this._undoGroupActive,
        });
        const id = uuidv4();
        const request = {
            id,
            code: fullCode,
            timeout: timeout ?? this.defaultTimeout,
        };
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.pending.delete(id);
                reject(new InDesignError('Script execution timed out', 'EXECUTION_TIMEOUT'));
            }, request.timeout ?? this.defaultTimeout);
            this.pending.set(id, { resolve, reject, timer });
            this.emit('request', request);
        });
    }
    handleResponse(response) {
        const pending = this.pending.get(response.id);
        if (!pending)
            return;
        clearTimeout(pending.timer);
        this.pending.delete(response.id);
        if (response.type === 'error') {
            pending.reject(new InDesignError(response.error ?? 'Unknown bridge error', 'BRIDGE_ERROR'));
        }
        else {
            pending.resolve(response);
        }
    }
    getStatus() {
        return {
            connected: this._connected,
            queueDepth: this.pending.size,
        };
    }
    cancelAll() {
        for (const [id, pending] of this.pending) {
            clearTimeout(pending.timer);
            pending.reject(new InDesignError('Execution cancelled', 'CANCELLED'));
            this.pending.delete(id);
        }
    }
}
//# sourceMappingURL=ScriptExecutor.js.map