const { kafka } = require("./client");

async function init() {
  const admin = kafka.admin();

  try {
    console.log("Admin is Connecting...");
    await admin.connect();
    console.log("Admin Connection Success...");

    console.log("Creating Topic [rider-updates]");
    const created = await admin.createTopics({
      topics: [
        {
          topic: "rider-updates",
          numPartitions: 2,
        },
      ],
    });

    if (created) {
      console.log("Topic Created Successfully [rider-updates]");
    } else {
      console.log("Topic [rider-updates] already exists or was not created");
    }
  } catch (error) {
    console.error("Admin encountered an error:", error.message || error);
  } finally {
    console.log("Disconnecting Admin...");
    await admin.disconnect();
    console.log("Admin Disconnected");
  }
}

init();