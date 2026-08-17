import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

app.post("/ai", async (req, res) => {
    const { input } = req.body;
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
            {
                role: "user",
                parts: [{text: input}]
            },
        ],
        config: {
                systemInstruction: "You are my AI Agent and your name is MultiAgent."
            }
    });

    return res.status(200).json(response.text);
})

app.get("/", async (req, res) => {
    return res.status(200).json({message: "Server is started"});
});

app.listen(PORT, () => {
    console.log(`Our Port is running on ${PORT}`);
});