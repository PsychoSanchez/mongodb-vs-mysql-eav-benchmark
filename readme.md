# MongoDB vs MySQL EAV benchmark

This is a benchmark of MongoDB vs MySQL for EAV (Entity-Attribute-Value) data model. 

It tests bulk insert operations and get by entity id queries for 100000 entities with 100 attributes each.

Both MongoDB and MySQL are running in Docker containers, gateway is a Node.js app running fastify.

Test runs autoncannon requests from 100 connections over 30 seconds on a 2022 Macbook Pro M1 with 32GB RAM.

## Setup

- Install docker and docker-compose.
- Install nodejs dependencies: `nvm use && npm install`

## Run

-   Start benchmark with `npm start`
-   Update README.md by running `npm run update-readme`

## Results

### Database initialization with 100000 entities and 100 attributes each using bulk insert


| Subject | Time |
| --- | --- |
| MongoDB🥇 | 21.7s |
| MySQL JSON🥈 | 24.8s |
| MySQL EAV🥉 | 3m 1.5s |


### Benchmarks
<!-- table -->

## Benchmarks



### Get random by ID (full document 100 fields)

#### 10 connections over 30 seconds
| Stat | MongoDB🥈 | MySQL JSON🥇 | MySQL EAV🥉 | 
| --- | --- | --- | --- |
| Latency | 2ms | 2ms | 8ms |
| Req/Sec | 3807 | 4888 | 1191 |
| Bytes/Sec | 7.57 | 9.57 | 2.31 |
| Total Requests | 114K | 147K | 36K |
| Server errors | - | - | - |

#### 50 connections over 20 seconds
| Stat | MongoDB🥈 | MySQL JSON🥇 | MySQL EAV🥉 | 
| --- | --- | --- | --- |
| Latency | 9ms | 7ms | 59ms |
| Req/Sec | 5293 | 6297 | 844 |
| Bytes/Sec | 10.53 | 12.33 | 1.64 |
| Total Requests | 106K | 126K | 17K |
| Server errors | - | - | - |

#### 100 connections over 10 seconds
| Stat | MongoDB🥈 | MySQL JSON🥇 | MySQL EAV🥉 | 
| --- | --- | --- | --- |
| Latency | 19ms | 15ms | 134ms |
| Req/Sec | 5250 | 6346 | 739 |
| Bytes/Sec | 10.45 | 12.43 | 1.43 |
| Total Requests | 53K | 70K | 7K |
| Server errors | - | - | - |

### Get random by ID (bulk 100 documents)

#### 10 connections over 30 seconds
| Stat | MongoDB🥈 | MySQL JSON🥇 | MySQL EAV🥉 | 
| --- | --- | --- | --- |
| Latency | 65ms | 35ms | 1s |
| Req/Sec | 153 | 280 | 12 |
| Bytes/Sec | 27.89 | 50.23 | 2.07 |
| Total Requests | 5K | 8K | 0K |
| Server errors | - | - | - |

#### 50 connections over 20 seconds
| Stat | MongoDB🥈 | MySQL JSON🥇 | MySQL EAV🥉 | 
| --- | --- | --- | --- |
| Latency | 331ms | 168ms | 2.4s |
| Req/Sec | 150 | 296 | 20 |
| Bytes/Sec | 27.33 | 53.07 | 3.48 |
| Total Requests | 3K | 6K | 0K |
| Server errors | - | - | - |

#### 100 connections over 10 seconds
| Stat | MongoDB🥇 | MySQL JSON | MySQL EAV🥈 | 
| --- | --- | --- | --- |
| Latency | 640ms | 41ms | 4.6s |
| Req/Sec | 151 | 2406 | 17 |
| Bytes/Sec | 27.60 | 36.83 | 2.98 |
| Total Requests | 2K | 24K | 0K |
| Server errors | - | ❌ 22054 | - |

### Get random by ID (partial document 10 fields)

#### 10 connections over 30 seconds
| Stat | MongoDB🥉 | MySQL JSON🥇 | MySQL EAV🥈 | 
| --- | --- | --- | --- |
| Latency | 5ms | 2ms | 2ms |
| Req/Sec | 3979 | 4948 | 4275 |
| Bytes/Sec | 2.66 | 3.31 | 2.85 |
| Total Requests | 119K | 148K | 128K |
| Server errors | - | - | - |

#### 50 connections over 20 seconds
| Stat | MongoDB🥈 | MySQL JSON🥇 | MySQL EAV🥉 | 
| --- | --- | --- | --- |
| Latency | 8ms | 7ms | 9ms |
| Req/Sec | 5606 | 6410 | 5383 |
| Bytes/Sec | 3.75 | 4.29 | 3.59 |
| Total Requests | 112K | 128K | 108K |
| Server errors | - | - | - |

#### 100 connections over 10 seconds
| Stat | MongoDB🥈 | MySQL JSON🥇 | MySQL EAV🥉 | 
| --- | --- | --- | --- |
| Latency | 17ms | 15ms | 18ms |
| Req/Sec | 5707 | 6443 | 5501 |
| Bytes/Sec | 3.81 | 4.31 | 3.67 |
| Total Requests | 57K | 64K | 55K |
| Server errors | - | - | - |

<!-- tablestop -->
