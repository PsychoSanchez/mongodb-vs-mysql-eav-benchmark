const fs = require('fs');
const path = require('path');

const DOCKER_FILE_NAME = 'docker-compose.yaml';
const OUTPUT_FOLDER = path.join(__dirname, '..', '..', 'output');
const RESULTS_FILE_PATH = path.join(OUTPUT_FOLDER, 'results.json');

const getBootstrapFolders = () => {
    const bootstrapPath = path.join(__dirname, '..', 'bootstrap');

    return fs
        .readdirSync(bootstrapPath)
        .filter((/** @type {string} */ folder) => {
            return fs.statSync(path.join(bootstrapPath, folder)).isDirectory();
        });
};

const getAllDockerComposeFiles = () => {
    const bootstrapFolders = getBootstrapFolders();

    return bootstrapFolders.map((/** @type {string} */ folder) => {
        return path.join(
            __dirname,
            '..',
            'bootstrap',
            folder,
            DOCKER_FILE_NAME
        );
    });
};

const getDockerComposeFilePath = (/** @type {string} */ testSubject) => {
    const bootstrapFolders = getBootstrapFolders();

    if (!bootstrapFolders.includes(testSubject)) {
        throw new Error(
            `Test subject ${testSubject} is not available. Available test subjects: ${bootstrapFolders.join(
                ', '
            )}`
        );
    }

    return path.join(
        __dirname,
        '..',
        'bootstrap',
        testSubject,
        DOCKER_FILE_NAME
    );
};

const getAvailableBenchmarks = () => {
    const benchmarksPath = path.join(__dirname, '..', 'benchmarks');

    return fs
        .readdirSync(benchmarksPath)
        .filter((/** @type {string} */ folder) => {
            return fs.statSync(path.join(benchmarksPath, folder)).isDirectory();
        });
};

const getReadmeFilePath = () => {
    return path.join(__dirname, '..', '..', 'README.md');
};

const getTemplateReadmeFilePath = () => {
    return path.join(__dirname, '..', 'template', 'README.md.ejs');
};

module.exports = {
    getBootstrapFolders,
    getAllDockerComposeFiles,
    getDockerComposeFilePath,
    getAvailableBenchmarks,
    getReadmeFilePath,
    getTemplateReadmeFilePath,
    OUTPUT_FOLDER,
    RESULTS_FILE_PATH,
};
