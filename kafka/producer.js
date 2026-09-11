const { kafka } = require("./client");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function init() {
  const producer = kafka.producer();

  try {
    console.log("Connecting Producer...");
    await producer.connect();
    console.log("Producer Connected Successfully");
    console.log("Enter updates in format: <riderName> <location> (e.g., 'tony north' or 'john south')");
    console.log("Type 'exit' or press Ctrl+C to quit.\n");

    rl.setPrompt("> ");
    rl.prompt();

    rl.on("line", async function (line) {
      const trimmed = line.trim();
      if (!trimmed) {
        rl.prompt();
        return;
      }

      if (trimmed.toLowerCase() === "exit" || trimmed.toLowerCase() === "quit") {
        rl.close();
        return;
      }

      const parts = trimmed.split(/\s+/);
      if (parts.length < 2) {
        console.log("Invalid format. Please use: <riderName> <location> (e.g., 'tony north')");
        rl.prompt();
        return;
      }

      const [riderName, location] = parts;

      try {
        await producer.send({
          topic: "rider-updates",
          messages: [
            {
              partition: location.toLowerCase() === "north" ? 0 : 1,
              key: "location-update",
              value: JSON.stringify({ name: riderName, location }),
            },
          ],
        });
        console.log(`Sent update for ${riderName} at ${location} (partition ${location.toLowerCase() === "north" ? 0 : 1})`);
      } catch (sendError) {
        console.error("Failed to send message:", sendError.message || sendError);
      }

      rl.prompt();
    }).on("close", async () => {
      console.log("\nDisconnecting producer...");
      try {
        await producer.disconnect();
        console.log("Producer disconnected successfully");
      } catch (err) {
        console.error("Error while disconnecting producer:", err.message || err);
      }
      process.exit(0);
    });

    process.on("SIGINT", () => {
      rl.close();
    });
  } catch (error) {
    console.error("Failed to initialize producer:", error.message || error);
    rl.close();
  }
}

init();