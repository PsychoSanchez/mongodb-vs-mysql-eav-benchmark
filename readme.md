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
| MongoDB 🏆 | 21.6s |
| MySQL JSON | 25.5s |
| MySQL EAV | 3m |


### Benchmarks
<!-- table -->

## Benchmarks



### Get random by ID (full document)

#### 10 connections over 30 seconds
| Stat | MongoDB | MySQL JSON 🏆 | 
| --- | --- | --- |
| Latency | 2ms | 2ms |
| Req/Sec | 3784 | 4952 |
| Bytes/Sec | 7.53 | 9.69 |
| Total Requests | 113K | 149K |
| Errors count | 0 | 0 |

#### 50 connections over 20 seconds
| Stat | MongoDB | MySQL JSON 🏆 | 
| --- | --- | --- |
| Latency | 9ms | 8ms |
| Req/Sec | 5318 | 6236 |
| Bytes/Sec | 10.58 | 12.21 |
| Total Requests | 106K | 125K |
| Errors count | 0 | 0 |

#### 100 connections over 10 seconds
| Stat | MongoDB | MySQL JSON 🏆 | 
| --- | --- | --- |
| Latency | 18ms | 15ms |
| Req/Sec | 5390 | 6270 |
| Bytes/Sec | 10.72 | 12.27 |
| Total Requests | 54K | 69K |
| Errors count | 0 | 0 |

### Get random by ID (bulk)

#### 10 connections over 30 seconds
| Stat | MongoDB 🏆 | MySQL JSON | MySQL EAV | 
| --- | --- | --- | --- |
| Latency | 2ms | 4ms | 803ms |
| Req/Sec | 4331 | 4855 | 12 |
| Bytes/Sec | 0.71 | 1.50 | 2.17 |
| Total Requests | 130K | 146K | 0K |
| Errors count | 0 | 145655 | 0 |

#### 50 connections over 20 seconds
| Stat | MongoDB 🏆 | MySQL JSON | MySQL EAV | 
| --- | --- | --- | --- |
| Latency | 8ms | 9ms | 3.4s |
| Req/Sec | 6229 | 5452 | 13 |
| Bytes/Sec | 1.02 | 1.69 | 2.37 |
| Total Requests | 125K | 109K | 0K |
| Errors count | 0 | 109033 | 0 |

#### 100 connections over 10 seconds
| Stat | MongoDB 🏆 | MySQL JSON | MySQL EAV | 
| --- | --- | --- | --- |
| Latency | 15ms | 18ms | 5.3s |
| Req/Sec | 6297 | 5458 | 14 |
| Bytes/Sec | 1.03 | 1.69 | 2.39 |
| Total Requests | 69K | 60K | 0K |
| Errors count | 0 | 60034 | 0 |

### Get random by ID (partial document)

#### 10 connections over 30 seconds
| Stat | MongoDB | MySQL JSON 🏆 | MySQL EAV | 
| --- | --- | --- | --- |
| Latency | 2ms | 6ms | 3ms |
| Req/Sec | 3939 | 4989 | 5601 |
| Bytes/Sec | 2.63 | 3.34 | 1.74 |
| Total Requests | 118K | 150K | 168K |
| Errors count | 0 | 0 | 168022 |

#### 50 connections over 20 seconds
| Stat | MongoDB | MySQL JSON 🏆 | MySQL EAV | 
| --- | --- | --- | --- |
| Latency | 8ms | 7ms | 6ms |
| Req/Sec | 5618 | 6390 | 7182 |
| Bytes/Sec | 3.76 | 4.27 | 2.23 |
| Total Requests | 112K | 128K | 144K |
| Errors count | 0 | 0 | 143640 |

#### 100 connections over 10 seconds
| Stat | MongoDB | MySQL JSON 🏆 | MySQL EAV | 
| --- | --- | --- | --- |
| Latency | 17ms | 15ms | 13ms |
| Req/Sec | 5642 | 6512 | 7313 |
| Bytes/Sec | 3.77 | 4.35 | 2.27 |
| Total Requests | 62K | 65K | 80K |
| Errors count | 0 | 0 | 80434 |

<!-- tablestop -->
