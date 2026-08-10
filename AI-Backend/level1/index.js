import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const interaction = await ai.interactions.create({
  model: "gemini-3.6-flash",
  input: "Explain how AI works in a few words",
});
console.log(interaction.output_text);

app.get("/", async (req, res) => {
    return res.status(200).json({message: "Server is started"});
});

app.listen(PORT, () => {
    console.log(`Our Port is running on ${PORT}`);
});