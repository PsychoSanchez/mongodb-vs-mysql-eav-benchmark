const {runBenchmark} = require('./benchmarks');
const {runBootstrap} = require('./bootstrap');
const {getAvailableBenchmarks, getBootstrapFolders} = require('./core/path');

const TEST_SUBJECTS = getBootstrapFolders();
const BENCHMARKS = getAvailableBenchmarks();

import('inquirer').then(async (inquirer) => {
    inquirer.default
        .prompt([
            {
                type: 'checkbox',
                name: 'testSubjects',
                message: 'Select test subject',
                choices: TEST_SUBJECTS,
            },
            {
                type: 'checkbox',
                name: 'benchmarks',
                message: 'Select benchmark',
                choices: BENCHMARKS,
            },
        ])
        .then(
            async (
                /** @type {{testSubjects: string[], benchmarks: string[]}} */ answers
            ) => {
                for (const testSubject of answers.testSubjects) {
                    await runBootstrap(testSubject);

                    for (const benchmark of answers.benchmarks) {
                        await runBenchmark(benchmark, testSubject);
                    }
                }
            }
        );
});
