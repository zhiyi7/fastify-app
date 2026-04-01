'use strict';

export default function () {
    return async function (fastify) {
        fastify.get('/should-not-load', async function () {
            return {
                ignored: false,
            };
        });
    };
}
