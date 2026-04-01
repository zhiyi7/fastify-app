'use strict';

export default function () {
    return async function (fastify) {
        fastify.get('/info', async function () {
            return {
                source: 'adminPanel/userSettings',
            };
        });
    };
}
