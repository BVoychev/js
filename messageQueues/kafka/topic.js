const { Kafka } = require("kafkajs");

async function run() {
  try {
    const kafka = new Kafka({
      "clientId": "myapp",
      "brokers": ["Boriss-MacBook-Pro.local:9092"],
    });

    const admin = kafka.admin();
    console.log("Connecting.....");
    await admin.connect();
    console.log("Connected!");

    // A-M -> Partition 0, N-Z -> Partition 1
    await admin.createTopics({
      "topics": [{
        "topic": "Users",
        "numPartitions": 2,
      }]
    });

    console.log("Create Successfully!");
    await admin.disconnect();
  } catch (err) {
    console.error(`Something bad happened ${err}`);
  } finally {
    process.exit(0);
  }
}

run();