const amqp = require('amqplib');
const amqpCb = require('amqplib/callback_api');

const uri = process.env.SAMMLER_RABBITMQ_URL;

// listenQueue();
listenExchange();
// listenExchangeCb();

function listenExchange() {

  function handleMessages(msg) {
    console.log('handle messages\n', msg);

    return Promise.reject();
  }

  const ex = 'topic_logs';
  const exchangeType = 'topic';
  const queueAll = 'q-all';
  const queueCritical = 'testQ1';

  // Todo: This can definitely be simplified ...
  amqp.connect(uri)
    .then(conn => {
      return conn.createChannel();
    })
    .then(channel => {
      return Promise.all([
        channel.assertExchange(ex, exchangeType, {durable: false}),
        channel.assertQueue(queueAll, {exclusive: false}),
        channel.bindQueue(queueAll, ex, '#'),
        channel.consume(queueAll, msg => {
          // eslint-disable-next-line quotes
          console.log(" [x] %s - %s:'%s'", '#', msg.fields.routingKey, msg.content.toString());
          channel.ack(msg);
        }, {noAck: false}),
        channel.assertQueue(queueCritical, {exclusive: false}),
        channel.bindQueue(queueCritical, ex, '*.critical'),
        // result.channel.bindQueue(result.queue.queue, ex, '#'),
        channel.consume(queueCritical, msg => {
          // eslint-disable-next-line quotes
          console.log(" [x] %s - %s:'%s'", '*.critical', msg.fields.routingKey, msg.content.toString());
          channel.ack(msg);
        }, {noAck: false})
      ]);
    })
    .catch(err => {
      console.log('An error occurred:', err);
    });
}

function listenExchangeCb() {
  amqpCb.connect(uri, (err, conn) => {
    if (err) {
      console.log('err connect', err);
    }
    conn.createChannel((err, ch) => {
      const ex = 'topic_logs';

      ch.assertExchange(ex, 'topic', {durable: false});

      ch.assertQueue('', {exclusive: true}, (err, q) => {
        console.log(' [*] Waiting for logs. To exit press CTRL+C');

        const key = '#';
        ch.bindQueue(q.queue, ex, key);

        ch.consume(q.queue, msg => {
          // console.log('x', msg);
          console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString()); // eslint-disable-line quotes
        }, {noAck: true});
      });
    });
  });
}

function listenQueue() {

  const queue = 'queue';
  amqp.connect(uri)
    .then(conn => {
      conn.createChannel()
        .then(channel => channel.assertQueue(queue)
          .then(() => channel.consume(queue, msg => {
            if (msg !== null) {
              // Do the long running job
              // Log the msg to stdout
              _logMsg(msg)
                .then(() => {
                  longRunning.bind(null, msg);
                }) // eslint-disable-line brace-style

                // Log the result of the long-running task
                .then(logResult) // eslint-disable-line brace-style

                // Mark completed in jobs-service

                // acknowledge on RabbitMQ
                .then(() => {
                  ack(channel, msg);
                });  // eslint-disable-line brace-style
            }
          })))
        .catch(console.warn);
    });
}

function _logMsg(msg) {
  console.log('xx LOG MESSAGE --');
  console.log('Got message from MQ: ', JSON.parse(msg.content));
  console.log('==> message-id: ', msg.properties.correlationId);
  console.log('==> message details:\r\n', msg);
  return new Promise(resolve => {
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
