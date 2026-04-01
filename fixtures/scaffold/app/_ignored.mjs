'use strict';

export default function () {
    return async function (fastify) {
        fastify.get('/ignored', async function (request, reply) {
            return {
                ignored: true,
            };
        });
    };
}