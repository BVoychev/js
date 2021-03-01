const amqp = require("amqplib");

const consumedMessages = []

const port = process.env.TARGET_PORT;

async function consume(){
  try {
    const conn = await amqp.connect(`amqp://localhost:${port}`);
    const channel = await conn.createChannel();
    await channel.assertQueue("logs",{
      durable: false
    });
  
    channel.consume("logs", message => {
      const input = JSON.parse(message.content.toString());
      console.log(`Recieved job with input ${input.text}`)
      consumedMessages.push(input.text);
      channel.ack(message);
    });

    console.log(`Waiting for messages....`);
  } catch (error) {
    console.error(error);
  }
}

consume()