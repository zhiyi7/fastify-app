'use strict';

export const plugin = async function (fastify) {
    fastify.get('/named-plugin', async function () {
        return {
            exportType: 'named-plugin',
            ok: true,
        };
    });
};
