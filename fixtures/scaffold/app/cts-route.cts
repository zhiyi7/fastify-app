'use strict';

module.exports = function () {
    return async function (fastify) {
        fastify.get('/cts-route', async function () {
            return {
                extension: 'cts',
                ok: true,
            };
        });
    };
};
