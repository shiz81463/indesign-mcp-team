#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { runStdioProxy } from './local/stdioProxy.js';
import { loadConfig } from './utils/configLoader.js';
import { IndesignMcpServer } from './server/IndesignMcpServer.js';
import { logger } from './utils/logger.js';
async function main() {
    const configPath = process.argv[2]; // optional path to config file
    if (configPath) {
        const local = JSON.parse(readFileSync(configPath, 'utf8'));
        if (local.localGatewayUrl) {
            await runStdioProxy(local.localGatewayUrl);
            return;
        }
    }
    const config = loadConfig(configPath);
    process.env.LOG_LEVEL = config.logging.level;
    if (process.env.LOG_LEVEL_OVERRIDE) {
        process.env.LOG_LEVEL = process.env.LOG_LEVEL_OVERRIDE;
    }
    const server = new IndesignMcpServer(config);
    try {
        await server.start();
    }
    catch (err) {
        logger.error('Fatal error during startup', {
            error: err instanceof Error ? err.message : String(err),
        });
        process.exit(1);
    }
}
main().catch(error => { console.error(String(error)); process.exit(1); });
//# sourceMappingURL=index.js.map