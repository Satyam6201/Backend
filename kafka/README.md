# 🚀 Apache Kafka in Node.js - Rider Updates System

A complete, production-ready Node.js demonstration of **Apache Kafka** using **KafkaJS**. This project demonstrates topic creation, message partitioning, real-time message production, consumer groups, and includes a full-featured **Interactive Web Dashboard**.

---

## 📁 Project Structure

```
kafka/
├── client.js       # Kafka client initialization and broker configuration
├── admin.js        # Admin client to create topics and configure partitions
├── producer.js     # Interactive CLI prompt to send rider location updates
├── consumer.js     # CLI consumer that joins a group and streams partition data
├── server.js       # Web server serving the dashboard & REST/SSE endpoints
├── index.html      # Frontend single-page UI for the web dashboard
├── package.json    # Project configuration and npm scripts
└── README.md       # Project documentation
```

---

## 🧠 Key Architecture & Concepts

1. **Topic (`rider-updates`)**:
   - Configured with **2 Partitions** (`Partition 0` and `Partition 1`).
2. **Deterministic Partition Routing**:
   - `North` &rarr; Sent directly to **Partition 0**
   - `South` (or other locations) &rarr; Sent to **Partition 1**
3. **Consumer Groups**:
   - Consumers subscribe with a `groupId`. Kafka automatically distributes partitions across consumers within the same group for horizontal scalability.
4. **Dual-Mode Operation**:
   - **Live Cluster Mode**: Automatically connects to your local or remote Kafka broker (`process.env.KAFKA_BROKER || 192.168.29.35:9092`).
   - **Simulation Mode**: If Kafka is not running, the Web Dashboard gracefully falls back to an internal in-memory broker so you can test all routing and UI features immediately.

---

## 🛠️ Prerequisites & Installation

- **Node.js**: v18+ or v20+ (Check with `node -v`)
- **Docker** (Optional, for running a real local Kafka broker)

### Install Dependencies
```bash
npm install
```

---

## 🖥️ Running the Project

### Option A: Interactive Web Dashboard (Recommended)

Start the web dashboard server:
```bash
npm start
```
Or:
```bash
node server.js
```

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

#### Web Dashboard Features:
- **🛠️ Admin Panel**: One-click topic creation (`rider-updates` with 2 partitions).
- **📤 Producer**: Interactive form to publish rider updates with automatic partition mapping.
- **📥 Live Consumer Stream**: Server-Sent Events (SSE) feed showing consumed messages, partitions, and timestamps in real time.
- **⚡ Status Detection**: Automatically displays whether connected to a live Kafka broker or running in simulation mode.

---

### Option B: Terminal CLI (Step-by-Step)

If you want to run Apache Kafka and interact via terminal sessions:

#### Step 1: Start Apache Kafka via Docker
You can run Kafka using KRaft (no Zookeeper required):
```bash
docker run -d --name kafka -p 9092:9092 bashj79/kafka-kraft
```
*(Or if using Zookeeper + Kafka, run Zookeeper on port `2181` and Kafka on port `9092`)*.

#### Step 2: Initialize Topic with Admin
```bash
node admin.js
```
*Output: Connects to Kafka, creates the `rider-updates` topic with 2 partitions, and disconnects safely.*

#### Step 3: Start Consumer(s)
Open a new terminal window:
```bash
node consumer.js group-1
```
*(You can open multiple terminals with different group names or the same group name to observe partition balancing!)*

#### Step 4: Start Interactive Producer
Open another terminal window:
```bash
node producer.js
```
Type your updates in the format `<riderName> <location>`:
```text
> tony north
Sent update for tony at north (partition 0)

> bruce south
Sent update for bruce at south (partition 1)

> peter north
Sent update for peter at north (partition 0)

> exit
```

---

## 📜 Available NPM Scripts

| Command | Description |
|---|---|
| `npm start` | Launches the interactive Web Dashboard at `http://localhost:3000` |
| `npm run admin` | Runs `admin.js` to create the topic and partitions |
| `npm run producer` | Launches the interactive CLI producer |
| `npm run consumer -- <group>` | Launches a CLI consumer with the specified group name |

---

## ❓ Troubleshooting & FAQs

### 1. `Error: listen EADDRINUSE: address already in use :::3000`
- **Cause**: Another process or background instance of `server.js` is already running on port 3000.
- **Solution 1**: Stop the existing process:
  ```powershell
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
  ```
- **Solution 2**: Run the server on a different port:
  ```powershell
  $env:PORT=3001; node server.js
  ```

### 2. `Error: Consumer groupId is required.`
- **Cause**: Running `node consumer.js` without specifying a group name.
- **Solution**: Always pass a group name: `node consumer.js <group-name>` (e.g., `node consumer.js user-1`).

### 3. Kafka Broker Connection Timeout / Refused
- **Cause**: Kafka is not running on the configured host/port.
- **Solution**:
  - Check your broker IP / Port. By default it uses `192.168.29.35:9092` or `localhost:9092`.
  - Override the broker via environment variable:
    ```powershell
    $env:KAFKA_BROKER="localhost:9092"; node server.js
    ```
  - Note: The web dashboard automatically falls back to **Simulation Mode** so you can still use the interface even if Kafka is offline.
