const path = require("path");
const { fork } = require("child_process");
const { program } = require("commander");
const autocannon = require("autocannon");


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

function runServerWithMongo() {
    return fork(path.join(__dirname, "mongo", "server.js"));
}

function runServerWithMySql() {
    return fork(path.join(__dirname, "mysql", "server.js"));
}

/**
 * @param {string} type
 */
async function runBenchmark(type) {
    console.log(`Running benchmark for ${type}...`);

    console.log("Starting server...");
    const server = type === "mongo" ? runServerWithMongo() : runServerWithMySql();

    await new Promise((resolve) => {
        server.on("message", (message) => {
            if (message === "ready") {
                resolve();
            }
        });
    });

    console.log("Starting benchmark...");

    const tests = [{
        connections: 10,
        duration: 30
    }, {
        connections: 50,
        duration: 20
    }, {
        connections: 100,
        duration: 10
    }];

    const url = `http://localhost:3000/product`;
    for (const test of tests) {
        const { connections, duration } = test;
        console.log(`Connections: ${connections}, Duration: ${duration}s`);
        const instance = await fire(url, connections, duration);
    }

    server.kill("SIGINT");
    process.exit(0);
}

program
    .command("mongo")
    .description("Benchmark mongo")
    .action(() => runBenchmark("mongo"));

program
    .command("mysql")
    .description("Benchmark mysql")
    .action(() => runBenchmark("mysql"));

program.parse(process.argv);

