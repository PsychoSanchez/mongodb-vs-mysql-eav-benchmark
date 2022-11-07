# MongoDB vs MySQL EAV benchmark

This is a benchmark of MongoDB vs MySQL for EAV (Entity-Attribute-Value) data model. 

It tests bulk insert operations and get by entity id queries for 100000 entities with 100 attributes each.

Both MongoDB and MySQL are running in Docker containers, gateway is a Node.js app running fastify.

Test runs autoncannon requests from 100 connections over 30 seconds on a 2022 Macbook Pro M1 with 32GB RAM.

## Setup

Install docker and docker-compose.

-   Install nodejs dependencies: `nvm use && npm install`
-   Start benchmark `npm start`
-   Select benchmarks to run via interactive shell
-   Update README.md with results by running `npm run update-readme`

## Results

### Database initialization with 100000 entities and 100 attributes each using bulk insert


| Subject | Time |
| --- | --- |
| MongoDB 🏆 | 21.9s |
| MySQL JSON | 24.3s |
| MySQL EAV | 3m 0.2s |


### Benchmarks
<!-- table -->

## Benchmarks



### Get random by ID (full document)

#### 10 connections over 30 seconds
| Stat | MongoDB | MySQL JSON 🏆 | 
| --- | --- | --- |
| Latency | 2ms | 2ms |
| Req/Sec | 3772 | 4952 |
| Bytes/Sec | 7.51 | 9.69 |
| Total Requests | 113K | 149K |

#### 50 connections over 20 seconds
| Stat | MongoDB | MySQL JSON 🏆 | 
| --- | --- | --- |
| Latency | 9ms | 8ms |
| Req/Sec | 5479 | 6236 |
| Bytes/Sec | 10.91 | 12.21 |
| Total Requests | 110K | 125K |

#### 100 connections over 10 seconds
| Stat | MongoDB | MySQL JSON 🏆 | 
| --- | --- | --- |
| Latency | 18ms | 15ms |
| Req/Sec | 5388 | 6270 |
| Bytes/Sec | 10.73 | 12.27 |
| Total Requests | 54K | 69K |

### Get random by ID (partial document)

#### 10 connections over 30 seconds
| Stat | MongoDB | MySQL JSON | MySQL EAV 🏆 | 
| --- | --- | --- | --- |
| Latency | 2ms | 2ms | 1ms |
| Req/Sec | 3847 | 4960 | 5502 |
| Bytes/Sec | 2.57 | 3.32 | 1.71 |
| Total Requests | 115K | 149K | 165K |

#### 50 connections over 20 seconds
| Stat | MongoDB | MySQL JSON | MySQL EAV 🏆 | 
| --- | --- | --- | --- |
| Latency | 8ms | 7ms | 6ms |
| Req/Sec | 5622 | 6434 | 7246 |
| Bytes/Sec | 3.76 | 4.30 | 2.25 |
| Total Requests | 112K | 129K | 145K |

#### 100 connections over 10 seconds
| Stat | MongoDB | MySQL JSON | MySQL EAV 🏆 | 
| --- | --- | --- | --- |
| Latency | 17ms | 15ms | 14ms |
| Req/Sec | 5570 | 6468 | 7107 |
| Bytes/Sec | 3.72 | 4.33 | 2.20 |
| Total Requests | 56K | 65K | 71K |

<!-- tablestop -->
