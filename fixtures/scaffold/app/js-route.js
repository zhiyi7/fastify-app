'use strict';

module.exports = function () {
    return async function (fastify) {
        fastify.get('/js-route', async function (request, reply) {
            return {
                format: 'cjs',
                ok: true,
            };
        });
    };
};