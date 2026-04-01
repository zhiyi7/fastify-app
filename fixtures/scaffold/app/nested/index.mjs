'use strict';

export default function () {
    return async function (fastify) {
        fastify.get('/route', async function (request, reply) {
            return {
                nested: true,
            };
        });
    };
}