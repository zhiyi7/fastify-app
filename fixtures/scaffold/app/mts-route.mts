'use strict';

export default function () {
    return async function (fastify) {
        fastify.get('/mts-route', async function () {
            return {
                extension: 'mts',
                ok: true,
            };
        });
    };
}
