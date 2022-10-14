# MongoDB vs MySQL EAV benchmark

This is a benchmark of MongoDB vs MySQL for EAV (Entity-Attribute-Value) data model. 

It tests bulk insert operations and get by entity id queries for 100000 entities with 100 attributes each.

Both MongoDB and MySQL are running in Docker containers, gateway is a Node.js app running fastify.

Test runs autoncannon requests from 100 connections over 30 seconds on a 2022 Macbook Pro M1 with 32GB RAM.

## Setup

Install docker and docker-compose.
Install nodejs dependencies:
```
nvm use && npm install
```

### MongoDB

Stop all docker containers
```
npm run stop:all
```

Start MongoDB container
```    
npm run start:mongo
```

Initialize MongoDB database
```
npm run init:mongo
```

### MySQL

Stop all docker containers
```
npm run stop:all
```

Start MySQL container
```
npm run start:mysql
```

Initialize MySQL database
```
npm run init:mysql
```

## Run benchmark

### MongoDB
```
npm run benchmark mongo
```

### MySQL
```
npm run benchmark mysql
```

## Results

### MongoDB

100000 entities average initialization time on 3 runs `21413ms`

10 connections x 30 seconds
```
┌─────────┬───────┬───────┬───────┬───────┬──────────┬─────────┬────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev   │ Max    │
├─────────┼───────┼───────┼───────┼───────┼──────────┼─────────┼────────┤
│ Latency │ 26 ms │ 51 ms │ 83 ms │ 92 ms │ 50.11 ms │ 16.4 ms │ 230 ms │
└─────────┴───────┴───────┴───────┴───────┴──────────┴─────────┴────────┘
┌───────────┬────────┬────────┬────────┬────────┬────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg    │ Stdev   │ Min    │
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤
│ Req/Sec   │ 164    │ 164    │ 200    │ 213    │ 197.57 │ 9.78    │ 164    │
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤
│ Bytes/Sec │ 343 kB │ 343 kB │ 418 kB │ 446 kB │ 413 kB │ 20.7 kB │ 343 kB │
└───────────┴────────┴────────┴────────┴────────┴────────┴─────────┴────────┘
```

50 connections x 20 seconds
```
┌─────────┬────────┬────────┬────────┬────────┬───────────┬──────────┬────────┐
│ Stat    │ 2.5%   │ 50%    │ 97.5%  │ 99%    │ Avg       │ Stdev    │ Max    │
├─────────┼────────┼────────┼────────┼────────┼───────────┼──────────┼────────┤
│ Latency │ 187 ms │ 226 ms │ 276 ms │ 289 ms │ 227.27 ms │ 24.14 ms │ 351 ms │
└─────────┴────────┴────────┴────────┴────────┴───────────┴──────────┴────────┘
┌───────────┬────────┬────────┬────────┬────────┬────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg    │ Stdev   │ Min    │
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤
│ Req/Sec   │ 204    │ 204    │ 219    │ 223    │ 218.35 │ 3.95    │ 204    │
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤
│ Bytes/Sec │ 424 kB │ 424 kB │ 457 kB │ 466 kB │ 456 kB │ 8.68 kB │ 424 kB │
└───────────┴────────┴────────┴────────┴────────┴────────┴─────────┴────────┘
```

100 connections x 10 seconds
```
┌─────────┬────────┬────────┬────────┬────────┬───────────┬──────────┬────────┐
│ Stat    │ 2.5%   │ 50%    │ 97.5%  │ 99%    │ Avg       │ Stdev    │ Max    │
├─────────┼────────┼────────┼────────┼────────┼───────────┼──────────┼────────┤
│ Latency │ 390 ms │ 453 ms │ 519 ms │ 553 ms │ 454.18 ms │ 37.31 ms │ 645 ms │
└─────────┴────────┴────────┴────────┴────────┴───────────┴──────────┴────────┘
┌───────────┬────────┬────────┬────────┬────────┬────────┬───────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg    │ Stdev │ Min    │
├───────────┼────────┼────────┼────────┼────────┼────────┼───────┼────────┤
│ Req/Sec   │ 177    │ 177    │ 220    │ 223    │ 215.4  │ 13.34 │ 177    │
├───────────┼────────┼────────┼────────┼────────┼────────┼───────┼────────┤
│ Bytes/Sec │ 369 kB │ 369 kB │ 459 kB │ 466 kB │ 450 kB │ 28 kB │ 369 kB │
└───────────┴────────┴────────┴────────┴────────┴────────┴───────┴────────┘
```

### MySQL

100000 entities average initialization time on 3 runs `146453ms`

10 connections x 30 seconds
```
┌─────────┬─────────┬─────────┬─────────┬─────────┬───────────┬───────────┬─────────┐
│ Stat    │ 2.5%    │ 50%     │ 97.5%   │ 99%     │ Avg       │ Stdev     │ Max     │
├─────────┼─────────┼─────────┼─────────┼─────────┼───────────┼───────────┼─────────┤
│ Latency │ 8360 ms │ 9051 ms │ 9552 ms │ 9552 ms │ 9031.8 ms │ 319.43 ms │ 9552 ms │
└─────────┴─────────┴─────────┴─────────┴─────────┴───────────┴───────────┴─────────┘
┌───────────┬─────┬──────┬─────┬─────────┬─────────┬────────┬─────────┐
│ Stat      │ 1%  │ 2.5% │ 50% │ 97.5%   │ Avg     │ Stdev  │ Min     │
├───────────┼─────┼──────┼─────┼─────────┼─────────┼────────┼─────────┤
│ Req/Sec   │ 0   │ 0    │ 0   │ 6       │ 1       │ 2.04   │ 4       │
├───────────┼─────┼──────┼─────┼─────────┼─────────┼────────┼─────────┤
│ Bytes/Sec │ 0 B │ 0 B  │ 0 B │ 12.1 kB │ 2.02 kB │ 4.1 kB │ 8.02 kB │
└───────────┴─────┴──────┴─────┴─────────┴─────────┴────────┴─────────┘
```

50 connections x 20 seconds
```
┌─────────┬──────┬──────┬───────┬──────┬──────┬───────┬──────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg  │ Stdev │ Max  │
├─────────┼──────┼──────┼───────┼──────┼──────┼───────┼──────┤
│ Latency │ 0 ms │ 0 ms │ 0 ms  │ 0 ms │ 0 ms │ 0 ms  │ 0 ms │
└─────────┴──────┴──────┴───────┴──────┴──────┴───────┴──────┘
┌───────────┬─────┬──────┬─────┬───────┬─────┬───────┬─────┐
│ Stat      │ 1%  │ 2.5% │ 50% │ 97.5% │ Avg │ Stdev │ Min │
├───────────┼─────┼──────┼─────┼───────┼─────┼───────┼─────┤
│ Req/Sec   │ 0   │ 0    │ 0   │ 0     │ 0   │ 0     │ 0   │
├───────────┼─────┼──────┼─────┼───────┼─────┼───────┼─────┤
│ Bytes/Sec │ 0 B │ 0 B  │ 0 B │ 0 B   │ 0 B │ 0 B   │ 0 B │
└───────────┴─────┴──────┴─────┴───────┴─────┴───────┴─────┘
```

100 connections x 10 seconds
```
┌─────────┬──────┬──────┬───────┬──────┬──────┬───────┬──────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg  │ Stdev │ Max  │
├─────────┼──────┼──────┼───────┼──────┼──────┼───────┼──────┤
│ Latency │ 0 ms │ 0 ms │ 0 ms  │ 0 ms │ 0 ms │ 0 ms  │ 0 ms │
└─────────┴──────┴──────┴───────┴──────┴──────┴───────┴──────┘
┌───────────┬─────┬──────┬─────┬───────┬─────┬───────┬─────┐
│ Stat      │ 1%  │ 2.5% │ 50% │ 97.5% │ Avg │ Stdev │ Min │
├───────────┼─────┼──────┼─────┼───────┼─────┼───────┼─────┤
│ Req/Sec   │ 0   │ 0    │ 0   │ 0     │ 0   │ 0     │ 0   │
├───────────┼─────┼──────┼─────┼───────┼─────┼───────┼─────┤
│ Bytes/Sec │ 0 B │ 0 B  │ 0 B │ 0 B   │ 0 B │ 0 B   │ 0 B │
└───────────┴─────┴──────┴─────┴───────┴─────┴───────┴─────┘
```

# Conclusion

## Bulk insert operations

MongoDb is `6.8` times faster on average in this test case than MySQL.

## Single random read operations

MongoDb has `17.3` times less latency and handles `210` times more requests per second than MySQL.
