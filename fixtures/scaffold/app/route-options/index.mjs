'use strict';

import { ApiError } from 'fastify-app';

export default function () {
    return async function (fastify) {
        fastify.get('/public', async function (request, reply) {
            return reply.ok({
                route: 'public',
                role: request.state.role ?? null,
            });
        });

        fastify.get(
            '/admin',
            {
                preHandler: async function (request) {
                    const role = request.headers['x-role'] ?? null;

                    if (role !== 'admin') {
                        throw new ApiError('Admin role required', 'ERR_ROLE_REQUIRED', 403, {
                            requiredRole: 'admin',
                        });
                    }

                    request.state.role = role;
                },
            },
            async function (request, reply) {
                return reply.ok({
                    route: 'admin',
                    role: request.state.role,
                });
            }
        );

        fastify.get(
            '/trace-only',
            {
                preHandler: async function (request) {
                    request.state.traceId = request.headers['x-trace-id'] ?? request.id;
                },
            },
            async function (request, reply) {
                return reply.ok({
                    route: 'trace-only',
                    traceId: request.state.traceId,
                });
            }
        );
    };
}