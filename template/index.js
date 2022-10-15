const ejs = require('ejs');
const fs = require('fs');
const path = require('path');


// Run all benchmarks
// Prepare results
// Run template generator

/**
 * @param {any[]} results
 * @param {string | number} stat
 * @param {number} value
 */
function isLowest(results, stat, value) {
    return Math.min(...results.map((/** @type {{ [x: string]: any; }} */ result) => result[stat])) === value;
}

/**
 * @param {any[]} results
 * @param {string | number} stat
 * @param {number} value
 */
function isBiggest(results, stat, value) {
    return Math.max(...results.map((/** @type {{ [x: string]: any; }} */ result) => result[stat])) === value;
}

const TROPHY_CONDITION_MAP = {
    'latency': isLowest,
    'throughput': isBiggest,
    'requests': isBiggest,
    'rps': isBiggest,
    'errors': isLowest,
};

const SUFFIX_MAP = {
    'latency': 'ms',
    'throughput': ' MB',
    'requests': 'K',
    'rps': '',
};

const TRANSFORM_MAP = {
    'latency': (/** @type {number} */ value) => value.toFixed(2),
    'throughput': (/** @type {number} */ value) => (value / 1024 / 1024).toFixed(2),
    'requests': (/** @type {number} */ value) => (value / 1000).toFixed(0),
    'rps': (/** @type {number} */ value) => value.toFixed(0),
};
/**
 * @param {any[]} results
 */
function renderResultsTable(results) {
    const renderRow = (/** @type {string} */ stat) => {
        const trophyCondition = TROPHY_CONDITION_MAP[stat];

        return results.map((/** @type {{ [x: string]: any; }} */ result) => {
            const value = result[stat];
            const trophy = trophyCondition(results, stat, value) ? '🏆 ' : '';
            const suffix = SUFFIX_MAP[stat] || '';
            const transformedValue = TRANSFORM_MAP[stat](value);

            return `${trophy}${transformedValue}${suffix}`;
        }).join(' | ');
    };

    return `| Stat | ${results.map((/** @type {{ name: any; }} */ bench) => bench.name).join(' | ')} |
| --- | ${results.map(() => '---').join(' | ')} |
| Latency | ${renderRow('latency')} |
| Req/Sec | ${renderRow('rps')} |
| Bytes/Sec | ${renderRow('throughput')} |
| Total Requests | ${renderRow('requests')} |`
};

const BENCHMARKS = {
    mongo: "MongoDB",
    ['mysql-eav']: "MySQL EAV",
    ['mysql-blob']: "MySQL JSON",
};

const BENCHMARK_TYPES = ['balanced', 'high', 'spike'];

function prepareResults() {
    // ready results directory
    if (!fs.existsSync(path.join(__dirname, '..', 'results'))) {
        fs.mkdirSync(path.join(__dirname, '..', 'results'));
    }

    // read results
    const benchmarks = Object.keys(BENCHMARKS).reduce((/** @type {{ [x: string]: any; }} */ acc, /** @type {string} */ type) => {
        const result = require(path.join(__dirname, '..', 'results', `${type}.json`));

        acc[type] = result;

        return acc;
    }, {});


    function getRenderInfo(/** @type {any} */ result) {
        return {
            latency: result.latency.average,
            rps: result.requests.average,
            throughput: result.throughput.average,
            requests: result.requests.total,
        };
    }

    const results = BENCHMARK_TYPES.reduce((/** @type {{ [x: string]: any; }} */ acc, /** @type {string} */ type) => {
        acc[type] = Object.entries(benchmarks).map(([name, result]) => ({
            name: BENCHMARKS[name],
            ...getRenderInfo(result[type][0]),
        }))

        return acc;
    }, {});



    return results;

}

function renderReadme() {
    const results = prepareResults();

    const template = fs.readFileSync(path.join(__dirname, 'README.md.ejs'), 'utf-8');

    const renderedTemplate = ejs.render(template, {
        tableBalanced: renderResultsTable(results.balanced),
        tableHigh: renderResultsTable(results.high),
        tableSpike: renderResultsTable(results.spike),
    });

    fs.writeFileSync(path.join(__dirname, 'README.md'), renderedTemplate);
}

module.exports = {
    renderReadme,
};

renderReadme();
