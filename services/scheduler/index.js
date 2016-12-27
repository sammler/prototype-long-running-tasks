const schedule = require('node-schedule');
const amqp = require('amqplib');
const URL = process.env.SAMMLER_RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

const rule = new schedule.RecurrenceRule();
rule.minute = 1;

function encode(doc) {
  return new Buffer(JSON.stringify(doc));
}

/**
 * Post a very basic message to s5r-rabbitmq.
 */
schedule.scheduleJob('* * * * *', () => {
  const open = amqp.connect(URL);
  const queue = 'queue';
  open.then(conn => {
    return conn.createChannel()
      .then(channel => {
        return Promise.all([
          channel.assertQueue(queue),
          channel.sendToQueue(queue, encode('strategy-x'), {persistent: true})
        ]);
      });
  })
    .catch(err => {
      console.log('error connecting to RabbitMG', err);
    });
});
