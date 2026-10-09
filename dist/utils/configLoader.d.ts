import { z } from 'zod';
declare const configSchema: z.ZodObject<{
    bridge: z.ZodDefault<z.ZodObject<{
        port: z.ZodDefault<z.ZodNumber>;
        host: z.ZodDefault<z.ZodString>;
        maxPayload: z.ZodDefault<z.ZodNumber>;
        timeout: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        timeout: number;
        port: number;
        host: string;
        maxPayload: number;
    }, {
        timeout?: number | undefined;
        port?: number | undefined;
        host?: string | undefined;
        maxPayload?: number | undefined;
    }>>;
    httpBridge: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        port: z.ZodDefault<z.ZodNumber>;
        host: z.ZodDefault<z.ZodString>;
        token: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        port: number;
        host: string;
        enabled: boolean;
        token: string;
    }, {
        port?: number | undefined;
        host?: string | undefined;
        enabled?: boolean | undefined;
        token?: string | undefined;
    }>>;
    server: z.ZodDefault<z.ZodObject<{
        transport: z.ZodDefault<z.ZodEnum<["stdio", "websocket"]>>;
        name: z.ZodDefault<z.ZodString>;
        version: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        version: string;
        name: string;
        transport: "stdio" | "websocket";
    }, {
        version?: string | undefined;
        name?: string | undefined;
        transport?: "stdio" | "websocket" | undefined;
    }>>;
    logging: z.ZodDefault<z.ZodObject<{
        level: z.ZodDefault<z.ZodEnum<["debug", "info", "warn", "error"]>>;
    }, "strip", z.ZodTypeAny, {
        level: "error" | "debug" | "info" | "warn";
    }, {
        level?: "error" | "debug" | "info" | "warn" | undefined;
    }>>;
    comBridge: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        cscriptPath: z.ZodOptional<z.ZodString>;
        vbsPath: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        cscriptPath?: string | undefined;
        vbsPath?: string | undefined;
    }, {
        enabled?: boolean | undefined;
        cscriptPath?: string | undefined;
        vbsPath?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    logging: {
        level: "error" | "debug" | "info" | "warn";
    };
    bridge: {
        timeout: number;
        port: number;
        host: string;
        maxPayload: number;
    };
    httpBridge: {
        port: number;
        host: string;
        enabled: boolean;
        token: string;
    };
    server: {
        version: string;
        name: string;
        transport: "stdio" | "websocket";
    };
    comBridge: {
        enabled: boolean;
        cscriptPath?: string | undefined;
        vbsPath?: string | undefined;
    };
}, {
    logging?: {
        level?: "error" | "debug" | "info" | "warn" | undefined;
    } | undefined;
    bridge?: {
        timeout?: number | undefined;
        port?: number | undefined;
        host?: string | undefined;
        maxPayload?: number | undefined;
    } | undefined;
    httpBridge?: {
        port?: number | undefined;
        host?: string | undefined;
        enabled?: boolean | undefined;
        token?: string | undefined;
    } | undefined;
    server?: {
        version?: string | undefined;
        name?: string | undefined;
        transport?: "stdio" | "websocket" | undefined;
    } | undefined;
    comBridge?: {
        enabled?: boolean | undefined;
        cscriptPath?: string | undefined;
        vbsPath?: string | undefined;
    } | undefined;
}>;
export type AppConfig = z.infer<typeof configSchema>;
export declare function loadConfig(configPath?: string): AppConfig;
export {};
//# sourceMappingURL=configLoader.d.ts.map