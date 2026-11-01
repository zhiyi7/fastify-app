'use strict';

module.exports = function () {
    return async function (fastify) {
        fastify.get('/cjs-route', async function () {
            return {
                extension: 'cjs',
                ok: true,
            };
        });
    };
};
