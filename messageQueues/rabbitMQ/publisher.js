const amqp = require("amqplib");

const msg = {text:process.argv[2]};

const port = process.env.TARGET_PORT;

async function publish(){
  try {
    const conn = await amqp.connect(`amqp://localhost:${port}`);
    const channel = await conn.createChannel();
    await channel.assertQueue("logs", {
      durable: false
    });
  
    await channel.sendToQueue("logs", Buffer.from(JSON.stringify(msg)));
    console.log(`Job send successfully ${msg.text}`);

    // Close channel and connection
    await channel.close();
    await conn.close();
  } catch (error) {
    console.error(error);
  }
}

publish();