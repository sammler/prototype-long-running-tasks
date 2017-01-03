const schedule = require('node-schedule');
const amqp = require('amqplib');
const RABBIT_URI = process.env.SAMMLER_RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
const uuidV4 = require('uuid/v4');

const rule = new schedule.RecurrenceRule();
rule.minute = 1;

function encode(obj) {
  return new Buffer(JSON.stringify(obj));
}

/**
 * Post a very basic message to s5r-rabbitmq.
 */
schedule.scheduleJob('* * * * *', () => {
  const open = amqp.connect(RABBIT_URI);
  const queue = 'queue';
  open.then(conn => {
    const msgOptions = {
      persistent: true,
      correlationId: uuidV4()
    };

    return conn.createChannel()
      .then(channel => {
        return Promise.all([
          channel.assertQueue(queue),
          channel.sendToQueue(queue, encode('strategy-x'), msgOptions)
        ])
          .then(() => {
            console.log('Send message to MQ: strategy-x');
          });
      });
  })
    .catch(err => {
      console.log('error connecting to RabbitMG', err);
    });
});

// Even simpler, post a message every 30 sec. to RabbitMQ
// - Exchange "github"
//
setInterval(() => {
  amqp.connect(RABBIT_URI)
    .then(conn => {
      conn.createChannel()
        .then(ch => {
          const ex = 'topic_logs';
          const key = 'kern.critical';
          const msg = {
            foo: 'bar',
            bar: 'baz'
          };
          ch.assertExchange(ex, 'topic', {durable: true});
          ch.publish(ex, key, encode(msg));
          console.log(" [x] Sent %s:'%s'", key, JSON.stringify(msg, null)); // eslint-disable-line quotes
          setTimeout(() => {
            conn.close();
          }, 500);
        });
    });
}, 1000 * 10);
