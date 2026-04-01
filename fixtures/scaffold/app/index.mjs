'use strict';

import { ApiError } from '../../../src/index.mjs';

export default function () {
    return async function (fastify) {
        fastify.get('/reply-ok', async function (request, reply) {
            if (typeof reply.ok === 'function') {
                return reply.ok({ message: 'hello' }, { source: 'helper' });
            }

            return reply.send({
                status: 'missing-helper',
                hasOk: false,
            });
        });

        fastify.get('/feature-flags', async function (request, reply) {
            return {
                hasOk: typeof reply.ok === 'function',
                hasState: Object.prototype.hasOwnProperty.call(request, 'state'),
                state: request.state ?? null,
            };
        });

        fastify.get('/state-mutate', async function (request, reply) {
            if (request.state) {
                request.state.fromRoute = 'route-updated';
            }

            return {
                hasState: Object.prototype.hasOwnProperty.call(request, 'state'),
                state: request.state ?? null,
            };
        });

        fastify.post('/echo', async function (request, reply) {
            return {
                body: request.body,
            };
        });

        fastify.get('/api-error', async function (request, reply) {
            throw new ApiError('Test ApiError', 'ERR_CODE', 409, { foo: 'bar' });
        });

        fastify.get('/uncaught-error', async function (request, reply) {
            throw new Error('Test uncaught error');
        });
    };
}