# sammler-flow-prototype

> A prototype to continuously validate the entire flow.

## Purpose
The purpose of this project is to validate the entire flow of sammler with a very minimalistic setup.

### Basic services:

### Basic flow

- s5r-scheduler posts a new message (`strategy-x` to RabbitMQ every minute
- s5r-strategy-x listens to RabbitMQ and
  - adds the job to s5r-job-service
  - runs the job (takes 2 mins)
  - marks the job as completed in the s5r-job-service
  - acknowledges the job on RabbitMQ

## Configuration

## Author
**Stefan Walther**

* [github/stefanwalther](https://github.com/stefanwalther)
* [twitter/waltherstefan](http://twitter.com/waltherstefan)

## License
Released under the MIT license.

