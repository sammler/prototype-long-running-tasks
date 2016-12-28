const amqp = require('amqplib');

const open = amqp.connect(process.env.SAMMLER_RABBITMQ_URL);
const queue = 'queue';

open.then(conn => conn.createChannel())
  .then(channel => channel.assertQueue(queue)
    .then(() => channel.consume(queue, msg => {
      if (msg !== null) {

        // Do the long running job
        // Log the msg to stdout
        _logMsg(msg)
          .then(() => { longRunning.bind(null, msg);}) // eslint-disable-line brace-style

          // Log the result of the long-running task
          .then(logResult) // eslint-disable-line brace-style

          // Mark completed in jobs-service

          // acknowledge on RabbitMQ
          .then(() => { ack(channel, msg); });  // eslint-disable-line brace-style
      }
    })))
  .catch(console.warn);

function _logMsg(msg) {
  console.log('xx LOG MESSAGE --');
  console.log('Got message from MQ: ', JSON.parse(msg.content));
  console.log('==> message-id: ', msg.properties.correlationId);
  console.log('==> message details:\r\n', msg);
  return new Promise( resolve => {
    setTimeout(() => {
      console.log('xx LOG MESSAGE xx');
      return resolve();
    }, 500);
  });
}

function longRunning(msg) {
  console.log('xx LONG RUNNING --');
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('xx LONG RUNNING xx');
      console.log('Long running tasks finished for ', msg.properties.correlationId);
      return resolve();
    }, 1000 * 2);
  });
}

function logResult() {
  console.log('xx LOG RESULT --');
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('xx LOG RESULT xx');
      return resolve();
    }, 100);
  });
}

function ack(channel, msg) {
  console.log('xx ACK --');
  return new Promise(resolve => {
    console.log('xx ACK xx');
    channel.ack(msg);
    resolve();
  });
}
