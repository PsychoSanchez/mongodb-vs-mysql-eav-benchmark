const {exec, execSync} = require('child_process');
const {getAllDockerComposeFiles} = require('./path.js');

const isDockerRunning = async () => {
    return new Promise((resolve) => {
        exec('docker ps', (error, stdout, stderr) => {
            resolve(!Boolean(error));
        });
    });
};

const downDockerComposeFiles = async (/** @type {any} */ files) => {
    const isRunning = await isDockerRunning();
    if (!isRunning) {
        throw new Error('Docker is not running');
    }

    for (const file of files) {
        // Add emoji
        console.log(`🛑 Stopping docker compose ${file}`);
        const result = execSync(`docker-compose -f ${file} down`);
        console.log(result.toString());
    }
};

const dropAllDockerContainers = async () => {
    const dockerComposeFiles = getAllDockerComposeFiles();

    await downDockerComposeFiles(dockerComposeFiles);
};

const runDockerCompose = async (/** @type {string} */ composeFile) => {
    console.log(`🚀 Running docker compose ${composeFile}`);

    const result = execSync(`docker-compose -f ${composeFile} up -d`);

    console.log(result.toString());
};

module.exports = {
    dropAllDockerContainers,
    downDockerComposeFiles,
    runDockerCompose,
};
