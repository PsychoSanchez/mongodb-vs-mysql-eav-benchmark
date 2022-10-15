const path = require("path");
const fs = require("fs");
const { fork } = require("child_process");
const { program } = require("commander");
const autocannon = require("autocannon");

const { waitForServerMessage } = require("./messages");


const TESTS = [{
    name: "balanced",
    connections: 10,
    duration: 30
}, {
    name: "high",
    connections: 50,
    duration: 20
}, {
    name: "spike",
    connections: 100,
    duration: 10
}];

/**
 * @param {string} url
 * @param {number} connections
 * @param {number} duration
 */
async function fire(url, connections, duration) {
    const instance = autocannon({
        url,
        connections,
        duration,
        headers: {
            "Content-Type": "application/json"
        },
        body: "{}",
        title: "benchmark"
    });

    autocannon.track(instance, {
        renderProgressBar: true
    });

    return instance;
}

/**
 * @param {'mysql-eav' | 'mysql-blob' | 'mongo'} type
 */
function runServer(type) {
    return fork(path.join(__dirname, type, "server.js"));
}


/**
 * @param {'mysql-eav' | 'mysql-blob' | 'mongo'} type
 */
async function runBenchmark(type) {
    console.log(`Running benchmark for ${type}...`);

    console.log("Starting server...");
    const server = runServer(type);
    await waitForServerMessage(server);

    console.log("Starting benchmark...");

    const url = `http://localhost:3000/product`;
    const results = {
        name: type,
        ...TESTS.reduce((acc, test) => {
            acc[test.name] = [];
            return acc;
        }, {})
    };

    for (const test of TESTS) {
        const { connections, duration } = test;
        console.log(`Connections: ${connections}, Duration: ${duration}s`);
        const instance = await fire(url, connections, duration);

        results[test.name].push(instance);
    }

    server.kill("SIGINT");

    saveResults(type, results);
    process.exit(0);
}

program
    .command("mongo")
    .description("Benchmark mongo")
    .action(() => runBenchmark("mongo"));

program
    .command("mysql-eav")
    .description("Benchmark mysql")
    .action(() => runBenchmark("mysql-eav"));

program
    .command("mysql-blob")
    .description("Benchmark mysql")
    .action(() => runBenchmark("mysql-blob"));


program.parse(process.argv);

function saveResults(type, results) {
    fs.writeFileSync(path.join(__dirname, "results", `${type}.json`), JSON.stringify(results, null, 4));
}

