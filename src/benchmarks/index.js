const {fork} = require('child_process');
const path = require('path');
const autocannon = require('autocannon');

const {waitForServerMessage} = require('../core/sync');
const {saveBenchmarkResults} = require('../core/results');

const TESTS = [
    {
        name: 'balanced',
        connections: 10,
        duration: 30,
    },
    {
        name: 'high',
        connections: 50,
        duration: 20,
    },
    {
        name: 'spike',
        connections: 100,
        duration: 10,
    },
];

/**
 * @param {number} connections
 * @param {number} duration
 */
async function fire(connections, duration) {
    const instance = autocannon({
        url: 'http://localhost:3000/benchmark',
        connections,
        duration,
        headers: {
            'Content-Type': 'application/json',
        },
        body: '{}',
        title: 'benchmark',
    });

    // @ts-ignore
    autocannon.track(instance, {
        renderProgressBar: true,
    });

    return instance;
}

/**
 * @param {string} benchmark
 * @param {string} testSubject
 */
async function runBenchmark(benchmark, testSubject) {
    console.log(`🚀 Running benchmark ${benchmark} for ${testSubject}...`);
    const server = fork(path.join(__dirname, benchmark, `${testSubject}.js`));
    await waitForServerMessage(server);

    const results = TESTS.reduce((acc, test) => {
        // @ts-ignore
        acc[test.name] = [];
        return acc;
    }, {});

    console.log('🔥 Starting benchmark...');
    for (const test of TESTS) {
        const {connections, duration} = test;
        const instanceResult = await fire(connections, duration);

        // @ts-ignore
        results[test.name].push(instanceResult);
    }

    server.kill('SIGINT');

    saveBenchmarkResults(benchmark, testSubject, results);
}

module.exports = {
    runBenchmark,
};
