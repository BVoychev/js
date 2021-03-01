const { Kafka } = require("kafkajs");

const msg = process.argv[2].toLowerCase();
async function run(){
  try {
    const kafka = new Kafka({
      "clientId": "myapp",
      "brokers": ["Boriss-MacBook-Pro.local:9092"],
    });

    const producer = kafka.producer();
    console.log("Connecting.....");
    await producer.connect();
    console.log("Connected!");

    // A-M -> Partition 0, N-Z -> Partition 1
    
    // In order to decide in which partion we should put the message
    // we will check the first char of the message and check if it is 
    // larger and euqal than 'N' or smaller 
    const partition = msg[0] < "n" ? 0 : 1
    const result = await producer.send({
      "topic": "Users",
      "messages": [
        {
          "value": msg,
          "partition": partition
        }
      ]
    });
    console.log(`Sned successfully ${JSON.stringify(result)}!`);
    await producer.disconnect();

  } catch (err) {
    console.error(`Something bad happened ${err}`);
  } finally {
    process.exit(0);
  }
}

run();