const amqp = require('amqplib');

const open = amqp.connect(process.env.SAMMLER_RABBITMQ_URL);
const queue = 'queue';

open.then(conn => conn.createChannel())
  .then(ch => ch.assertQueue(queue)
    .then(() => ch.consume(queue, msg => {
      if (msg !== null) {
        console.log('message: ', msg);
        console.log('Got message from MQ: ', JSON.parse(msg.content));

        // Do the long running job

        // Log the result

        // Mark completed in jobs-service

        ch.ack(msg);
      }
    })))
  .catch(console.warn);
