'use strict';

export default function () {
    return async function (fastify) {
        fastify.get('/custom-route', async function () {
            return {
                from: 'custom-routes',
                ok: true,
            };
        });
    };
}
