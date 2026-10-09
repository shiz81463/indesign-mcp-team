const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];
function getCurrentLevel() {
    return process.env.LOG_LEVEL ?? 'info';
}
function shouldLog(level) {
    return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(getCurrentLevel());
}
function formatMessage(level, message, meta) {
    const timestamp = new Date().toISOString();
    const metaStr = meta !== undefined ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
}
function writeStderr(msg) {
    process.stderr.write(msg + '\n');
}
export const logger = {
    debug(message, meta) {
        if (shouldLog('debug'))
            writeStderr(formatMessage('debug', message, meta));
    },
    info(message, meta) {
        if (shouldLog('info'))
            writeStderr(formatMessage('info', message, meta));
    },
    warn(message, meta) {
        if (shouldLog('warn'))
            writeStderr(formatMessage('warn', message, meta));
    },
    error(message, meta) {
        if (shouldLog('error'))
            writeStderr(formatMessage('error', message, meta));
    },
};
//# sourceMappingURL=logger.js.map