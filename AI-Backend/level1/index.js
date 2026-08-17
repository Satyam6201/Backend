import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_API_KEY,
// });

// app.post("/ai", async (req, res) => {
//     const { input } = req.body;
//     const response = await ai.models.generateContent({
//         model: "gemini-3.6-flash",
//         contents: [
//             {
//                 role: "user",
//                 parts: [{text: input}]
//             },
//         ],
//         config: {
//                 systemInstruction: "You are my AI Agent and your name is MultiAgent."
//             }
//     });

//     return res.status(200).json(response.text);
// });

//  Langchain
const llm = new ChatGoogleGenerativeAI({
    model: "gemini-3.6-flash",
});

app.post("/ai", async (req, res) => {
    const { input } = req.body;

    const response = await llm.invoke(input);
    return res.status(200).json(response.content);
});

const llm2 = new ChatGroq({
    model: "openai/gpt-oss-120b"
});

app.post("/ai/groq", async (req, res) => {
    const { input } = req.body;

    const response = await llm2.invoke(input);
    return res.status(200).json(response.content);
});

// LangGraph
const State = Annotation.Root({
    prompt: Annotation, // return most recent value 
    aiMessage: Annotation
});

// Create a tools for extranal data 
const tools = [];
const toolNode = new ToolNode(tools);

const CallLLM = async (state) => {
    const response = await llm.invoke([
        {
            role: "system",
            content: "You are an AI Assistant and your name is Multi AI"
        },
        {
            role: "human",
            content: state.prompt
        }
    ]);

    return { aiMessage: response.content };
}

const shouldContinue = async (params) => {
    
}

const graph = new StateGraph(State)
.addNode("agent", CallLLM)
// .addNode("tools", toolNode)
.addEdge("__start__", "agent")
// .addEdge("tools", "agent")
// .addConditionalEdges("agent", shouldContinue)
.compile()

app.post("/ai/langgraph", async (req, res) => {
    const { input } = req.body;

    const response = await graph.invoke({prompt: input});
    console.log(response);

    return res.status(200).json(response);
})

app.get("/", async (req, res) => {
    return res.status(200).json({message: "Server is started"});
});

app.listen(PORT, () => {
    console.log(`Our Port is running on ${PORT}`);
});