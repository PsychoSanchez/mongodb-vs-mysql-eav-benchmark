const fs = require('fs');

const ejs = require('ejs');

const {getResults} = require('../core/results');
const {getTemplateReadmeFilePath, getReadmeFilePath} = require('../core/path');

const SUBJECT_NAMES = {
    mongo: 'MongoDB',
    ['mysql-eav']: 'MySQL EAV',
    ['mysql-blob']: 'MySQL JSON',
};

const BENCHMARK_NAMES = {
    'get-random-by-id': 'Get random by ID (full document)',
    'get-random-by-id-obj-part': 'Get random by ID (partial document)',
    'get-random-by-id-bulk': 'Get random by ID (bulk)',
    'get-random-by-id-bulk-obj-part':
        'Get random by ID (bulk, partial document)',
};

const BENCHMARK_TYPES = ['balanced', 'high', 'spike'];

const BENCHMARK_TYPE_TO_TITLE = {
    balanced: '10 connections over 30 seconds',
    high: '50 connections over 20 seconds',
    spike: '100 connections over 10 seconds',
};

// Run all benchmarks
// Prepare results
// Run template generator

// /**
//  * @param {any[]} results
//  * @param {string | number} stat
//  * @param {number} value
//  */
// function isLowest(results, stat, value) {
//     return (
//         Math.min(
//             ...results.map(
//                 (/** @type {{ [x: string]: any; }} */ result) => result[stat]
//             )
//         ) === value
//     );
// }

// /**
//  * @param {any[]} results
//  * @param {string | number} stat
//  * @param {number} value
//  */
// function isBiggest(results, stat, value) {
//     return (
//         Math.max(
//             ...results.map(
//                 (/** @type {{ [x: string]: any; }} */ result) => result[stat]
//             )
//         ) === value
//     );
// }

// const TROPHY_CONDITION_MAP = {
//     latency: isLowest,
//     throughput: isBiggest,
//     requests: isBiggest,
//     rps: isBiggest,
//     errors: isLowest,
// };

// const SUFFIX_MAP = {
//     latency: 'ms',
//     throughput: ' MB',
//     requests: 'K',
//     rps: '',
// };

// const TRANSFORM_MAP = {
//     latency: (/** @type {number} */ value) => value.toFixed(2),
//     throughput: (/** @type {number} */ value) =>
//         (value / 1024 / 1024).toFixed(2),
//     requests: (/** @type {number} */ value) => (value / 1000).toFixed(0),
//     rps: (/** @type {number} */ value) => value.toFixed(0),
// };
/**
 * @param {any[]} results
 */
// function renderResultsTable(results) {
//     const renderRow = (/** @type {string} */ stat) => {
//         const trophyCondition = TROPHY_CONDITION_MAP[stat];

//         return results
//             .map((/** @type {{ [x: string]: any; }} */ result) => {
//                 const value = result[stat];
//                 const trophy = trophyCondition(results, stat, value)
//                     ? '🏆 '
//                     : '';
//                 const suffix = SUFFIX_MAP[stat] || '';
//                 const transformedValue = TRANSFORM_MAP[stat](value);

//                 return `${trophy}${transformedValue}${suffix}`;
//             })
//             .join(' | ');
//     };

//     return `
// | Stat | ${results
//         .map((/** @type {{ name: any; }} */ bench) => bench.name)
//         .join(' | ')} |
// | --- | ${results.map(() => '---').join(' | ')} |
// | Latency | ${renderRow('latency')} |
// | Req/Sec | ${renderRow('rps')} |
// | Bytes/Sec | ${renderRow('throughput')} |
// | Total Requests | ${renderRow('requests')} |`;
// }

/**
 * @param {{ bootstrap: { [s: string]: any; } | ArrayLike<any>; }} results
 */
async function renderBootstrapTable(results) {
    const prettyMs = (await import('pretty-ms')).default;

    const subjectBootstraps = Object.entries(results.bootstrap);
    const winnerName = subjectBootstraps.sort(
        (
            /** @type {[string, any]} */ [, a],
            /** @type {[string, any]} */ [, b]
        ) => a.time - b.time
    )[0][0];

    const rows = subjectBootstraps
        .map(([name, result]) => {
            // @ts-ignore
            const subjectName = SUBJECT_NAMES[name];

            return `| ${subjectName}${
                winnerName === name ? ' 🏆' : ''
            } | ${prettyMs(result.time)} |`;
        })
        .join('\n');

    return `
| Subject | Time |
| --- | --- |
${rows}
`;
}

/**
 * @param {{ benchmark: any; }} result
 */
async function renderBenchmarks(result) {
    const {benchmark: benchmarks} = result;

    let renderStr = `## Benchmarks\n\n`;

    for (const [benchmarkName, benchmark] of Object.entries(benchmarks)) {
        console.log(benchmarkName);
        // @ts-ignore
        const benchmarkTitle = BENCHMARK_NAMES[benchmarkName];
        console.log(benchmarkTitle);

        renderStr += `\n\n### ${benchmarkTitle ?? benchmarkName}`;

        for (const benchmarkType of BENCHMARK_TYPES) {
            // @ts-ignore
            const benchTable = await renderBenchmark(benchmark, benchmarkType);

            renderStr += `\n${benchTable}`;
        }
    }

    return renderStr;
}

/**
 * @param {ArrayLike<any> | { [s: string]: any; }} benchmark
 * @param {string | number} type
 */
async function renderBenchmark(benchmark, type) {
    const subjects = Object.entries(benchmark);

    const winnerSubject = subjects
        .slice(0)
        .sort(
            (
                /** @type {[string, any]} */ [, a],
                /** @type {[string, any]} */ [, b]
            ) => b[type][0].requests.average - a[type][0].requests.average
        )[0][0];

    const result = `
#### ${
        // @ts-ignore
        BENCHMARK_TYPE_TO_TITLE[type]
    }
| Stat | ${subjects
        .map(
            ([name]) =>
                // @ts-ignore
                SUBJECT_NAMES[name] + (winnerSubject === name ? ' 🏆' : '')
        )
        .join(' | ')} | 
| --- | ${subjects.map(() => '---').join(' | ')} |`;

    const latency = await renderLatency(
        subjects.map(([, result]) => result[type][0].latency.average)
    );

    const rps = await renderRps(
        subjects.map(([, result]) => result[type][0].requests.average)
    );

    const throughput = await renderThroughput(
        subjects.map(([, result]) => result[type][0].throughput.average)
    );

    const requests = await renderTotalRequests(
        subjects.map(([, result]) => result[type][0].requests.total)
    );

    return `${result}
${latency}
${rps}
${throughput}
${requests}`;
}

/**
 * @param {number[]} values
 */
async function renderLatency(values) {
    const prettyMs = (await import('pretty-ms')).default;

    const entries = values.map((value) => `${prettyMs(value)}`).join(' | ');

    return `| Latency | ${entries} |`;
}

/**
 * @param {number[]} values
 */
async function renderRps(values) {
    const entries = values.map((value) => `${value.toFixed(0)}`).join(' | ');

    return `| Req/Sec | ${entries} |`;
}

/**
 * @param {number[]} values
 */
async function renderThroughput(values) {
    const entries = values
        .map((value) => `${(value / 1024 / 1024).toFixed(2)}`)
        .join(' | ');

    return `| Bytes/Sec | ${entries} |`;
}

/**
 * @param {number[]} values
 */
async function renderTotalRequests(values) {
    const entries = values
        .map((value) => `${(value / 1000).toFixed(0)}K`)
        .join(' | ');

    return `| Total Requests | ${entries} |`;
}

async function renderReadme() {
    const results = getResults();

    const bootstrap = await renderBootstrapTable(results);
    const benchmarks = await renderBenchmarks(results);

    const template = fs.readFileSync(getTemplateReadmeFilePath(), 'utf-8');
    const renderedTemplate = ejs.render(template, {
        bootstrap: bootstrap,
        benchmarks: benchmarks,
    });

    fs.writeFileSync(getReadmeFilePath(), renderedTemplate);
}

module.exports = {
    renderReadme,
};

renderReadme();
