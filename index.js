const pubsub = require('@google-cloud/pubsub');
const mysql = require('mysql');
const moment = require('moment');

const pubsubClient = pubsub({
  keyFilename: process.env.KEY_FILE_NAME
});

const topic = pubsubClient.topic(process.env.TOPIC);

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

connection.connect();

const options = {
  reuseExisting: true
};

subscribeToPubsub();

function subscribeToPubsub () {
  topic.subscribe(process.env.SUBSCRIPTION_NAME, options, (err, subscription) => {
    if (err) {
      throw err;
    }

    function onError (err) {
      throw err;
    }

    function onMessage ({ id, data, attributes, ack }) {
      const query = `INSERT INTO ${process.env.MYSQL_TABLE_NAME} (
          id,
          data,
          event,
          device_id,
          fw_version,
          published_at
        ) VALUES (
          "${id}",
          "${data}",
          "${attributes.event}",
          "${attributes.device_id}",
          "${attributes.fw_version}",
          "${moment(attributes.published_at).format('YYYY-MM-DD HH:mm:ss')}"
        )`;

      connection.query(query, (err, rows) => {
        if (!err) {
          ack();
        } else {
          console.error(query);
          throw err;
        }
      });
    }

    subscription.on('error', onError);
    subscription.on('message', onMessage);
  });
}
