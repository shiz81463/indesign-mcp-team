import type { Middleware } from '../types/index.js';
export declare function withLogging(handlerName: string): Middleware;
export declare function withErrorHandling(): Middleware;
export declare function compose(...middlewares: Middleware[]): Middleware;
//# sourceMappingURL=middleware.d.ts.map