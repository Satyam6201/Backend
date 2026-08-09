import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import router from "./router.js";
import morgan from "morgan";
dotenv.config();

const app = express();
app.use(express.json());

app.use(morgan())

await db();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    return res.status(200).json({ message: "Server is Running"});
});

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Our port is running on ${PORT}`);
});