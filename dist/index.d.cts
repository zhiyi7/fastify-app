import { FastifyCorsOptions } from "@fastify/cors";
import { FastifyInstance, FastifyListenOptions, FastifyServerOptions } from "fastify";
//#region src/index.d.ts
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
export interface AppConfig {
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
export interface FastifyConfig {
  fastify?: FastifyOptions;
  app?: AppConfig;
  server?: FastifyListenOptions;
}
export declare class ApiError<Data = Record<string, unknown>> extends Error {
  code: string;
  statusCode: number;
  data: Data;
  constructor(message: string, code: string, statusCode?: number, data?: Data);
}
export declare function init(config?: FastifyConfig): Promise<FastifyAppInstance>;
export declare function start(): Promise<FastifyAppInstance>;
declare const instanceProxy: FastifyAppInstance;
//#endregion
export { instanceProxy as default };