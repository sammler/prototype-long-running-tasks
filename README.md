# sammler-flow-prototype

[![Greenkeeper badge](https://badges.greenkeeper.io/sammler/sammler-flow-prototype.svg)](https://greenkeeper.io/)

> A prototype to continuously validate the entire flow.

## Purpose
The purpose of this project is to validate the entire flow of _sammler_ with a very minimalistic setup. At the same time this setup should be representative to what will happen with multiple _sammler_ strategies.

### Basic services:

- scheduler
- db
- rabbitmq
- strategy-x
- jobs-service
- log-service

### Basic flow

- _scheduler_ 
  - creates a new unique message (every minute / 10x a minute),
  - posts the new message (`strategy-x`) to RabbitMQ
- _strategy-x_ listens to RabbitMQ

---
Tasks:
- add the job to jobs-service
- run the job (takes 2 mins)
- mark the job as completed in the jobs-service
- acknowledge the job on RabbitMQ

## Configuration

## Author
**Stefan Walther**

* [github/stefanwalther](https://github.com/stefanwalther)
* [twitter/waltherstefan](http://twitter.com/waltherstefan)

## License
Released under the MIT license.

