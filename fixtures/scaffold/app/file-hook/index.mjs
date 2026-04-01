'use strict';

export default function () {
    return async function (fastify) {
        fastify.addHook('preHandler', async function (request) {
            request.state.traceId = request.headers['x-trace-id'] ?? request.id;
            request.state.guardSource = 'file-hook';
        });

        fastify.get('/context', async function (request, reply) {
            return reply.ok({
                traceId: request.state.traceId,
                guardSource: request.state.guardSource,
                route: 'context',
            });
        });

        fastify.get('/details', async function (request, reply) {
            return reply.ok({
                traceId: request.state.traceId,
                guardSource: request.state.guardSource,
                route: 'details',
            });
        });
    };
}