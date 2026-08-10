import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/db.js";
import User from "./model/user.model.js";
import Redis from "ioredis";
import { ratelimit } from "./middleware/ratelimit.js";
dotenv.config();

const app = express();
app.use(express.json());

await dbConnection();

const PORT = process.env.PORT || 8080;

export const redis = new Redis(process.env.REDIS_URL);

redis.on("error", (err) => {
  console.error("Redis Error:", err.message);
});


app.get("/", (req, res) => {
    return res.status(200).json({ message: "Server is Running on 8080"});
});

app.post("/create" , async (req, res) => {
    const {name, email, password} = req.body;
    await redis.del("user:all");

    const user = await User.create({
        name, email, password
    });

    return res.status(201).json(user);
});

app.get("/get", ratelimit, async (req, res) => {
    const user = await User.find({});

    return res.status(200).json(user);
});

app.get("/get-redis", async (req, res) => {

    const cached = await redis.get("user:all"); // get the data 
    if (cached) {  // if data is allready present in the redis the get the data 
        return res.status(200).json(JSON.parse(cached));
    }

    const user = await User.find({});
    // if data is not present in redis the find the data in db then add those data in the redis 
    await redis.set("user:all", JSON.stringify(user));
    return res.status(200).json(user);
});

app.post("/send-opt", async (req, res) => {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(`otp:${email}`, otp, "EX",30); // ex means expire 30 means 30 sec
    return res.json({ otp });
});

app.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    const cachedOtp = await redis.get(`otp:${email}`);

    if (!cachedOtp) {
        return res.status(400).json({ message: "Otp is not found or expire"});
    }

    if (cachedOtp == otp) {
        return res.status(400).json({ message: "Otp is not found"});
    }
 
    return res.json({ message: "Otp is verify" });
})


app.listen(PORT, () => {
    console.log(`Our port is running on ${PORT}`);
});