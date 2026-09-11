const { kafka } = require("./client");

const group = process.argv[2];

if (!group) {
  console.error("Error: Consumer groupId is required.");
  console.error("Usage: node consumer.js <group-name>");
  console.error("Example: node consumer.js user-1");
  process.exit(1);
}

async function init() {
  const consumer = kafka.consumer({ groupId: group });

  const shutdown = async () => {
    console.log(`\nDisconnecting consumer group [${group}]...`);
    try {
      await consumer.disconnect();
      console.log("Consumer disconnected successfully.");
    } catch (err) {
      console.error("Error during consumer disconnect:", err.message || err);
    }
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  try {
    console.log(`Connecting consumer for group [${group}]...`);
    await consumer.connect();
    console.log(`Consumer connected for group [${group}]`);

    await consumer.subscribe({ topics: ["rider-updates"], fromBeginning: true });
    console.log(`Subscribed to topic [rider-updates]. Waiting for messages...`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log(
          `${group}: [${topic}]: PART:${partition}:`,
          message.value ? message.value.toString() : "<empty>"
        );
      },
    });
  } catch (error) {
    console.error(`Consumer [${group}] encountered an error:`, error.message || error);
    await shutdown();
  }
}

init();