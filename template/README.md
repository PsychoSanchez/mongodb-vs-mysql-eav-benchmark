# MongoDB vs MySQL EAV benchmark

This is a benchmark of MongoDB vs MySQL for EAV (Entity-Attribute-Value) data model. 

It tests bulk insert operations and get by entity id queries for 100000 entities with 100 attributes each.

Both MongoDB and MySQL are running in Docker containers, gateway is a Node.js app running fastify.

Test runs autoncannon requests from 100 connections over 30 seconds on a 2022 Macbook Pro M1 with 32GB RAM.

## Setup

Install docker and docker-compose.

- Install nodejs dependencies: `nvm use && npm install`
- Drop projects docker containers `npm run stop:all`
- Start selected container `npm run start:mongo` or `npm run start:mysql`
- Initialize database `npm run init:mongo` or `npm run init:mysql`

## Run benchmark

- Run benchmark `npm run benchmark mongo` or `npm run benchmark mysql`

## Results

### Database initialization with 100000 entities and 100 attributes each using bulk insert

| Database | Time |
| -------- | ---- |
| MongoDB  | 21.4s |
| MySQL    | 183.4s |

<!-- table -->

### 10 connections over 30 seconds (Balanced load)

| Stat | MongoDB | MySQL EAV | MySQL JSON |
| --- | --- | --- | --- |
| Latency | 🏆 2.05ms | 7.07ms | 173.93ms |
| Req/Sec | 🏆 3965 | 1321 | 57 |
| Bytes/Sec | 🏆 7.89 MB | 2.56 MB | 0.11 MB |
| Total Requests | 🏆 119K | 40K | 2K |

### 50 connections over 20 seconds (High load)

| Stat | MongoDB | MySQL EAV | MySQL JSON |
| --- | --- | --- | --- |
| Latency | 🏆 8.67ms | 58.03ms | 735.13ms |
| Req/Sec | 🏆 5455 | 853 | 67 |
| Bytes/Sec | 🏆 10.86 MB | 1.65 MB | 0.13 MB |
| Total Requests | 🏆 109K | 17K | 1K |

### 100 connections over 10 seconds (Spike load)

| Stat | MongoDB | MySQL EAV | MySQL JSON |
| --- | --- | --- | --- |
| Latency | 🏆 17.59ms | 122.54ms | 1476.05ms |
| Req/Sec | 🏆 5531 | 809 | 62 |
| Bytes/Sec | 🏆 11.01 MB | 1.57 MB | 0.12 MB |
| Total Requests | 🏆 55K | 8K | 1K |

<!-- tablestop -->

# Conclusion

## Bulk insert operations

MongoDb is `9.1` times faster on average in this test case than MySQL.

## Single random read operations

MongoDb has `2-7` times less latency and more throughput.
