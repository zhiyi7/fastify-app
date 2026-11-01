'use strict';

module.exports = function () {
    return async function (fastify) {
        fastify.get('/ts-route', async function () {
            return {
                extension: 'ts',
                ok: true,
            };
        });
    };
};
