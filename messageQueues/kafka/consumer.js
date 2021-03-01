const { Kafka } = require("kafkajs");

async function run(){
  try {
    const kafka = new Kafka({
      "clientId": "myapp",
      "brokers": [`${host}:9092`],
    });

    const consumer = kafka.consumer({"groupId": "test"});
    console.log("Connecting.....");
    await consumer.connect();
    console.log("Connected!");

    await consumer.subscribe({
      "topic": "Users",
      "fromBeginning": true
    })

    await consumer.run({
      eachMessage: async message => {
        console.log(`Received message: ${message.message.value} on partition ${message.partition}`);
      }
    });
    
    // We want to consume the whole time
    // await consumer.disconnect();
  } catch (err) {
    console.error(`Something bad happened ${err}`);
  } finally {
    // process.exit(0);
  }
}

run();