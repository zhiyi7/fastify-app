'use strict';

export default function () {
    return async function (fastify) {
        fastify.get('/details', async function () {
            return {
                source: 'userProfile',
            };
        });
    };
}
