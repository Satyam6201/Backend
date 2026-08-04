import express from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT = 8080 || process.env.PORT;

const app = express();

app.get("/", (req, res) => {
    return res.status(200).json({message: "Our server is running"});
});

app.listen(PORT, () => {
    console.log(`Our Port is running on ${PORT}`);
})