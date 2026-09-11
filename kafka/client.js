const { Kafka, logLevel } = require("kafkajs");

const broker = (process.env.KAFKA_BROKER || "192.168.29.35:9092").replace(/^https?:\/\//, "");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [broker],
  logLevel: logLevel.ERROR,
  retry: {
    initialRetryTime: 100,
    retries: 1,
  },
});

exports.kafka = kafka;
exports.Kafka = kafka;