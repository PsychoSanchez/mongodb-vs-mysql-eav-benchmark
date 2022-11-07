const {fastify} = require('fastify');

const {faker} = require('@faker-js/faker');
const {emitReadyMessage} = require('./sync');

/**
 * @param {(arg0: import("fastify").FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault> & PromiseLike<import("fastify").FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>>) => void} cb
 */
async function runBenchmark(cb) {
    faker.seed(123);

    try {
        const app = fastify({logger: false});

        await cb(app);

        app.listen({port: 3000}, (err, address) => {
            if (err) {
                app.log.error(err);
                process.exit(1);
            }
            app.log.info(`server listening on ${address}`);
        });
    } catch (err) {
        console.dir(err);
        throw err;
    } finally {
        emitReadyMessage();
    }
}

module.exports = {
    runApp: runBenchmark,
};
