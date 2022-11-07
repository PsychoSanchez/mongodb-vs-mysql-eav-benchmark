const READY_MESSAGE = 'ready';

const waitForServerMessage = async (
    /** @type {{ on: (arg0: string, arg1: (message: any) => void) => void; }} */ server
) => {
    await new Promise((resolve) => {
        server.on('message', (message) => {
            if (message === READY_MESSAGE) {
                resolve(1);
            }
        });
    });
};

const emitReadyMessage = () => {
    process.send?.('ready');
};

module.exports = {
    READY_MESSAGE,
    waitForServerMessage,
    emitReadyMessage,
};
