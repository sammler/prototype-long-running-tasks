const amqp = require('amqplib');

const open = amqp.connect(process.env.SAMMLER_RABBITMQ_URL);
const queue = 'queue';

open.then(conn => conn.createChannel())
  .then(channel => channel.assertQueue(queue)
    .then(() => channel.consume(queue, msg => {
      if (msg !== null) {
        // Log the msg to stdout
        _logMsg(msg);

        // Do the long running job

        // Log the result

        // Mark completed in jobs-service

        return ack(channel, msg);
      }
    })))
  .catch(console.warn);

function _logMsg(msg) {
  console.log('message: ', msg);
  console.log('Got message from MQ: ', JSON.parse(msg.content));
  console.log('xx');
}

function longRunning() {
  return new Promise(resolve => {
    return resolve();
  });
}

function logResult() {
  return Promise.resolve();
}

function ack(channel, msg) {
  return new Promise( (resolve) => {
    channel.ack(msg);
    resolve();
  })
}
