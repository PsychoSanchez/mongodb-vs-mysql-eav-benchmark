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
| MongoDB🥇 | 21.9s |
| MySQL JSON🥈 | 24.3s |
| MySQL EAV | 2m 57.8s |
| PostgreSQL JSONB🥉 | 25.6s |


### Benchmarks
<!-- table -->

## Benchmarks



### Get random by ID (full document 100 fields)

#### 10 connections over 30 seconds
| Stat | MongoDB🥉 | MySQL JSON🥇 | MySQL EAV | PostgreSQL JSONB🥈 | 
| --- | --- | --- | --- | --- |
| Latency | 2ms | 2ms | 8ms | 2ms |
| Req/Sec | 3807 | 4888 | 1191 | 4129 |
| Bytes/Sec | 7.57 | 9.57 | 2.31 | 8.08 |
| Total Requests | 114K | 147K | 36K | 124K |
| Server errors | - | - | - | - |

#### 50 connections over 20 seconds
| Stat | MongoDB🥉 | MySQL JSON🥈 | MySQL EAV | PostgreSQL JSONB🥇 | 
| --- | --- | --- | --- | --- |
| Latency | 9ms | 7ms | 59ms | 7ms |
| Req/Sec | 5293 | 6297 | 844 | 6378 |
| Bytes/Sec | 10.53 | 12.33 | 1.64 | 12.48 |
| Total Requests | 106K | 126K | 17K | 128K |
| Server errors | - | - | - | - |

#### 100 connections over 10 seconds
| Stat | MongoDB🥉 | MySQL JSON🥈 | MySQL EAV | PostgreSQL JSONB🥇 | 
| --- | --- | --- | --- | --- |
| Latency | 19ms | 15ms | 134ms | 15ms |
| Req/Sec | 5250 | 6346 | 739 | 6364 |
| Bytes/Sec | 10.45 | 12.43 | 1.43 | 12.46 |
| Total Requests | 53K | 70K | 7K | 64K |
| Server errors | - | - | - | - |

### Get random by ID (bulk 100 documents)

#### 10 connections over 30 seconds
| Stat | MongoDB🥉 | MySQL JSON🥈 | MySQL EAV | PostgreSQL JSONB🥇 | 
| --- | --- | --- | --- | --- |
| Latency | 65ms | 35ms | 1s | 33ms |
| Req/Sec | 153 | 280 | 12 | 296 |
| Bytes/Sec | 27.89 | 50.23 | 2.07 | 54.26 |
| Total Requests | 5K | 8K | 0K | 9K |
| Server errors | - | - | - | - |

#### 50 connections over 20 seconds
| Stat | MongoDB🥉 | MySQL JSON🥇 | MySQL EAV | PostgreSQL JSONB🥈 | 
| --- | --- | --- | --- | --- |
| Latency | 331ms | 168ms | 2.4s | 170ms |
| Req/Sec | 150 | 296 | 20 | 292 |
| Bytes/Sec | 27.33 | 53.07 | 3.48 | 53.38 |
| Total Requests | 3K | 6K | 0K | 6K |
| Server errors | - | - | - | - |

#### 100 connections over 10 seconds
| Stat | MongoDB🥈 | MySQL JSON | MySQL EAV🥉 | PostgreSQL JSONB🥇 | 
| --- | --- | --- | --- | --- |
| Latency | 640ms | 41ms | 4.6s | 372ms |
| Req/Sec | 151 | 2406 | 17 | 264 |
| Bytes/Sec | 27.60 | 36.83 | 2.98 | 48.29 |
| Total Requests | 2K | 24K | 0K | 3K |
| Server errors | - | ❌ 22054 | - | - |

### Get random by ID (partial document 10 fields)

#### 10 connections over 30 seconds
| Stat | MongoDB | MySQL JSON🥇 | MySQL EAV🥉 | PostgreSQL JSONB🥈 | 
| --- | --- | --- | --- | --- |
| Latency | 2ms | 2ms | 2ms | 2ms |
| Req/Sec | 4181 | 4948 | 4275 | 4294 |
| Bytes/Sec | 2.93 | 3.31 | 2.85 | 2.87 |
| Total Requests | 125K | 148K | 128K | 129K |
| Server errors | - | - | - | - |

#### 50 connections over 20 seconds
| Stat | MongoDB🥇 | MySQL JSON🥉 | MySQL EAV | PostgreSQL JSONB🥈 | 
| --- | --- | --- | --- | --- |
| Latency | 7ms | 7ms | 9ms | 7ms |
| Req/Sec | 6748 | 6410 | 5383 | 6532 |
| Bytes/Sec | 4.72 | 4.29 | 3.59 | 4.37 |
| Total Requests | 135K | 128K | 108K | 131K |
| Server errors | - | - | - | - |

#### 100 connections over 10 seconds
| Stat | MongoDB🥇 | MySQL JSON🥉 | MySQL EAV | PostgreSQL JSONB🥈 | 
| --- | --- | --- | --- | --- |
| Latency | 14ms | 15ms | 18ms | 15ms |
| Req/Sec | 6687 | 6443 | 5501 | 6504 |
| Bytes/Sec | 4.68 | 4.31 | 3.67 | 4.35 |
| Total Requests | 67K | 64K | 55K | 65K |
| Server errors | - | - | - | - |

### Get random by ID (bulk 100 documents, partial document 10 fields)

#### 10 connections over 30 seconds
| Stat | MongoDB🥇 | MySQL JSON🥉 | MySQL EAV | PostgreSQL JSONB🥈 | 
| --- | --- | --- | --- | --- |
| Latency | 15ms | 24ms | 133ms | 23ms |
| Req/Sec | 650 | 403 | 75 | 432 |
| Bytes/Sec | 32.98 | 20.46 | 3.79 | 21.89 |
| Total Requests | 20K | 12K | 2K | 13K |
| Server errors | - | - | - | - |

#### 50 connections over 20 seconds
| Stat | MongoDB🥇 | MySQL JSON | MySQL EAV🥉 | PostgreSQL JSONB🥈 | 
| --- | --- | --- | --- | --- |
| Latency | 80ms | 14ms | 516ms | 118ms |
| Req/Sec | 619 | 3544 | 96 | 421 |
| Bytes/Sec | 31.41 | 12.03 | 4.84 | 21.38 |
| Total Requests | 12K | 71K | 2K | 8K |
| Server errors | - | ❌ 66611 | - | - |

#### 100 connections over 10 seconds
| Stat | MongoDB🥇 | MySQL JSON | MySQL EAV🥉 | PostgreSQL JSONB🥈 | 
| --- | --- | --- | --- | --- |
| Latency | 159ms | 14ms | 877ms | 233ms |
| Req/Sec | 621 | 7072 | 109 | 424 |
| Bytes/Sec | 31.51 | 2.55 | 5.49 | 21.52 |
| Total Requests | 6K | 71K | 1K | 4K |
| Server errors | - | ❌ 70707 | - | - |

<!-- tablestop -->
