import { FastifyCorsOptions } from '@fastify/cors';
import { FastifyServerOptions, FastifyListenOptions, FastifyInstance } from 'fastify';

type RoutePrefixCase = 'preserve' | 'kebab-case';
type RequestState = Record<string, unknown>;
type FastifyAppInstance = FastifyInstance;
type FastifyOptions = FastifyServerOptions;
declare module 'fastify' {
    interface FastifyRequest {
        state: RequestState | null;
    }
    interface FastifyReply {
        ok(data: unknown, meta?: unknown): FastifyReply;
    }
}
interface AppConfig {
    disableCors?: boolean;
    corsOptions?: FastifyCorsOptions;
    disableLogRequestBody?: boolean;
    disableLogRequestHeaders?: boolean;
    disableSendRequestIdHeader?: boolean;
    disableApiErrorHandler?: boolean;
    disableLogApiError?: boolean;
    apiErrorLogLevel?: string;
    disableHealthCheckRoutes?: boolean;
    healthCheckRoutesPrefix?: string;
    enableHealthCheckShowsGitRev?: boolean;
    healthCheckGitRevTimeout?: number;
    healthCheckExposeTimezone?: boolean;
    healthCheckExposeRandom?: boolean;
    disableAddRequestState?: boolean;
    disableReplyHelperFunctions?: boolean;
    internalServerErrorCode?: number;
    routesDirectory?: string;
    includeFileNameInRoutePrefix?: boolean;
    routePrefixCase?: RoutePrefixCase;
    requestBodyLogThreshold?: number;
    requestBodyLogMaxStringLength?: number;
    requestBodyLogMaxArrayLength?: number;
    requestBodyLogMaxDepth?: number;
    requestBodyLogLevel?: string;
    requestBodyLogContentTypes?: string[];
}
interface FastifyConfig {
    fastify?: FastifyOptions;
    app?: AppConfig;
    server?: FastifyListenOptions;
}
declare class ApiError<Data = Record<string, unknown>> extends Error {
    code: string;
    statusCode: number;
    data: Data;
    constructor(message: string, code: string, statusCode?: number, data?: Data);
}
declare function init(config?: FastifyConfig): Promise<FastifyAppInstance>;
declare function start(): Promise<FastifyAppInstance>;
declare const instanceProxy: FastifyAppInstance;

export { ApiError, type AppConfig, type FastifyConfig, instanceProxy as default, init, start };
