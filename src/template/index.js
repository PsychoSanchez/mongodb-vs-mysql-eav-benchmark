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
    'get-random-by-id': 'Get random by ID (full document 100 fields)',
    'get-random-by-id-obj-part':
        'Get random by ID (partial document 10 fields)',
    'get-random-by-id-bulk': 'Get random by ID (bulk 100 documents)',
    'get-random-by-id-bulk-obj-part':
        'Get random by ID (bulk 100 documents, partial document 10 fields)',
};

const BENCHMARK_TYPES = ['balanced', 'high', 'spike'];

const BENCHMARK_TYPE_TO_TITLE = {
    balanced: '10 connections over 30 seconds',
    high: '50 connections over 20 seconds',
    spike: '100 connections over 10 seconds',
};

const BRONZE_MEDAL = '🥉';
const SILVER_MEDAL = '🥈';
const GOLD_MEDAL = '🥇';

const MEDALS = [GOLD_MEDAL, SILVER_MEDAL, BRONZE_MEDAL];

/**
 * @param {{ bootstrap: { [s: string]: any; } | ArrayLike<any>; }} results
 */
async function renderBootstrapTable(results) {
    const prettyMs = (await import('pretty-ms')).default;

    const subjectBootstraps = Object.entries(results.bootstrap);
    const subjectCups = subjectBootstraps
        .slice(0)
        .sort(
            (
                /** @type {[string, any]} */ [, a],
                /** @type {[string, any]} */ [, b]
            ) => a.time - b.time
        )
        .map(([name], index) => [name, MEDALS[index]]);

    const rows = subjectBootstraps
        .map(([name, result]) => {
            // @ts-ignore
            const subjectName = SUBJECT_NAMES[name];

            return `| ${subjectName}${
                subjectCups.find(([subject]) => subject === name)?.[1] ?? ''
            } | ${prettyMs(result.time ?? 0)} |`;
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
        // @ts-ignore
        const benchmarkTitle = BENCHMARK_NAMES[benchmarkName];

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

    const subjectsCups = subjects
        .slice(0)
        .filter(([, subject]) => subject[type][0].non2xx === 0)
        .sort(
            (
                /** @type {[string, any]} */ [, a],
                /** @type {[string, any]} */ [, b]
            ) => b[type][0].requests.average - a[type][0].requests.average
        )
        .map(([name], index) => [name, MEDALS[index]]);

    const result = `
#### ${
        // @ts-ignore
        BENCHMARK_TYPE_TO_TITLE[type]
    }
| Stat | ${subjects
        .map(
            ([name]) =>
                // @ts-ignore
                SUBJECT_NAMES[name] +
                (subjectsCups.find(([subject]) => subject === name)?.[1] ?? '')
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

    const errors = await renderErrors(
        subjects.map(([, result]) => result[type][0].non2xx)
    );

    return `${result}
${latency}
${rps}
${throughput}
${requests}
${errors}`;
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

/**
 * @param {any[]} values
 */
async function renderErrors(values) {
    const entries = values
        .map((value) => `${value === 0 ? '-' : `❌ ${value}`}`)
        .join(' | ');
    return `| Server errors | ${entries} |`;
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
