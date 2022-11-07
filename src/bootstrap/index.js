const path = require('path');
const {getBootstrapFolders} = require('../core/path');
const {init} = require('../core/benchmark-bootstrap');

const runBootstrap = async (/** @type {string} */ testSubject) => {
    const TEST_SUBJECTS = getBootstrapFolders();
    if (!TEST_SUBJECTS.includes(testSubject)) {
        throw new Error(
            `Test subject ${testSubject} is not available. Available test subjects: ${TEST_SUBJECTS.join(
                ', '
            )}`
        );
    }

    const bootstrapPath = path.join(__dirname, testSubject);
    const bootstrap = require(bootstrapPath);

    console.log(`🚀 Bootstrapping ${testSubject}...`);
    await init(testSubject, bootstrap);
};

module.exports = {
    runBootstrap,
};
