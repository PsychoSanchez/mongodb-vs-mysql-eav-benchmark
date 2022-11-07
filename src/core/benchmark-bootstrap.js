const path = require('path');

const {dropAllDockerContainers, runDockerCompose} = require('./docker.js');
const {getDockerComposeFilePath} = require('./path.js');
const {saveBootstrapResults} = require('./results.js');

/**
 * @param {string} testSubject
 * @param {() => Promise<number>} bootstrapSequenceCb
 */
async function init(testSubject, bootstrapSequenceCb) {
    await dropAllDockerContainers();
    const dockerComposeFile = getDockerComposeFilePath(testSubject);

    await runDockerCompose(dockerComposeFile);

    const time = await bootstrapSequenceCb().catch(console.dir);

    saveBootstrapResults(testSubject, {
        time,
    });
}

module.exports = {
    init,
};
