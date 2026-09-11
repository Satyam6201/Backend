const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const { kafka } = require("./client");

const PORT = process.env.PORT || 3000;

// In-memory message store and SSE clients
const messages = [];
const sseClients = [];
let isKafkaConnected = false;
let realProducer = null;
let realConsumer = null;

// Broadcast to SSE clients
function broadcast(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((res) => {
    try {
      res.write(payload);
    } catch (e) {}
  });
}

// Attempt connecting to real Kafka with a fast timeout check
async function tryConnectKafka() {
  const admin = kafka.admin();
  try {
    const connectPromise = admin.connect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Connection timeout")), 2000)
    );
    await Promise.race([connectPromise, timeoutPromise]);
    isKafkaConnected = true;
    console.log("Connected to live Kafka cluster at " + (process.env.KAFKA_BROKER || "192.168.29.35:9092"));

    realProducer = kafka.producer();
    await realProducer.connect();

    realConsumer = kafka.consumer({ groupId: "web-dashboard-group" });
    await realConsumer.connect();
    await realConsumer.subscribe({ topic: "rider-updates", fromBeginning: false });

    await realConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const item = {
          topic,
          partition,
          key: message.key ? message.key.toString() : null,
          value: message.value ? message.value.toString() : "",
          timestamp: new Date().toISOString(),
          source: "live-kafka",
        };
        messages.push(item);
        broadcast(item);
      },
    });
    await admin.disconnect();
  } catch (err) {
    isKafkaConnected = false;
    try { await admin.disconnect(); } catch (_) {}
    console.log("ℹ️  Kafka broker is offline. Dashboard running in Local Simulation Mode.");
  }
}


// Background attempt connection
tryConnectKafka().catch(() => {});

const indexHtmlPath = path.join(__dirname, "index.html");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Serve UI
  if (req.method === "GET" && parsedUrl.pathname === "/") {
    try {
      const html = fs.readFileSync(indexHtmlPath, "utf-8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    } catch (e) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading UI: " + e.message);
    }
    return;
  }

  // API: Status
  if (req.method === "GET" && parsedUrl.pathname === "/api/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ isKafkaConnected, broker: process.env.KAFKA_BROKER || "192.168.29.35:9092" }));
    return;
  }

  // API: Admin Create Topic
  if (req.method === "POST" && parsedUrl.pathname === "/api/admin/create-topic") {
    (async () => {
      if (isKafkaConnected) {
        try {
          const admin = kafka.admin();
          await admin.connect();
          await admin.createTopics({
            topics: [{ topic: "rider-updates", numPartitions: 2 }],
          });
          await admin.disconnect();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, message: "Topic [rider-updates] created in Kafka cluster." }));
          return;
        } catch (err) {
          // continue
        }
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Topic [rider-updates] initialized with 2 partitions." }));
    })();
    return;
  }

  // API: Producer Send Message
  if (req.method === "POST" && parsedUrl.pathname === "/api/producer/send") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", async () => {
      try {
        const { riderName, location } = JSON.parse(body || "{}");
        const partition = (location || "").toLowerCase() === "north" ? 0 : 1;
        const msgObj = { name: riderName, location };

        if (isKafkaConnected && realProducer) {
          try {
            await realProducer.send({
              topic: "rider-updates",
              messages: [
                {
                  partition,
                  key: "location-update",
                  value: JSON.stringify(msgObj),
                },
              ],
            });
          } catch (kafkaErr) {
            console.error("Error publishing to live Kafka:", kafkaErr);
          }
        }

        // Broadcast to dashboard consumers
        const item = {
          topic: "rider-updates",
          partition,
          key: "location-update",
          value: JSON.stringify(msgObj),
          timestamp: new Date().toISOString(),
          source: isKafkaConnected ? "live-kafka" : "simulation",
        };
        messages.push(item);
        broadcast(item);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, partition }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Consumer SSE Stream
  if (req.method === "GET" && parsedUrl.pathname === "/api/consumer/stream") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write("\n");
    sseClients.push(res);

    // Send recent messages upon connect
    messages.slice(-10).forEach((m) => {
      res.write(`data: ${JSON.stringify(m)}\n\n`);
    });

    req.on("close", () => {
      const idx = sseClients.indexOf(res);
      if (idx !== -1) sseClients.splice(idx, 1);
    });
    return;
  }

  // Default 404
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n⚠️  Port ${PORT} is already in use.`);
    console.error(`To use another port, run:`);
    console.error(`  $env:PORT=3001; node server.js\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

server.listen(PORT, () => {
  console.log(`\nKafka Dashboard Server running at http://localhost:${PORT}\n`);
});

