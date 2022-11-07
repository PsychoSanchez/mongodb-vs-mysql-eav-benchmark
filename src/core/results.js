const fs = require('fs');

const {RESULTS_FILE_PATH, OUTPUT_FOLDER} = require('./path');

const getResults = () => {
    if (!fs.existsSync(RESULTS_FILE_PATH)) {
        return {};
    }

    const resultsJson = fs.readFileSync(RESULTS_FILE_PATH, 'utf-8');
    return JSON.parse(resultsJson);
};

const createFolderIfNotExists = (/** @type {string} */ folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
};

const saveResults = (/** @type {any} */ results) => {
    const resultsJson = JSON.stringify(results, null, 4);

    createFolderIfNotExists(OUTPUT_FOLDER);

    fs.writeFileSync(RESULTS_FILE_PATH, resultsJson);
};

const saveBootstrapResults = (
    /** @type {string} */ testSubject,
    /** @type {any} */ results
) => {
    const savedResults = getResults();

    savedResults.bootstrap = {
        ...savedResults.bootstrap,
        [testSubject]: results,
    };

    saveResults(savedResults);
};

const saveBenchmarkResults = (
    /** @type {string} */ benchmarkName,
    /** @type {string} */ testSubject,
    /** @type {any} */ results
) => {
    const savedResults = getResults();

    savedResults.benchmark = {
        ...savedResults.benchmark,
        [benchmarkName]: {
            ...savedResults.benchmark?.[benchmarkName],
            [testSubject]: results,
        },
    };

    saveResults(savedResults);
};

module.exports = {
    saveBootstrapResults,
    saveBenchmarkResults,
    getResults,
};
