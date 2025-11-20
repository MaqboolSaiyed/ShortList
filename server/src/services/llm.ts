import Groq from 'groq-sdk';
import { pipeline } from '@xenova/transformers';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GROQ_API_KEY;

if (!API_KEY) {
    console.error("GROQ_API_KEY is not set in .env file");
}

const groq = new Groq({
    apiKey: API_KEY
});

// Singleton for the embedding pipeline to avoid reloading model
let embeddingPipeline: any = null;

export const getEmbedding = async (text: string): Promise<number[]> => {
    try {
        if (!embeddingPipeline) {
            console.log("Loading embedding model...");
            embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        }

        const output = await embeddingPipeline(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    } catch (error) {
        console.error("Error getting embedding:", error);
        throw error;
    }
};

export const getChatResponse = async (prompt: string, context: string): Promise<string> => {
    try {
        // 1. Generate detailed response
        const fullPrompt = `
    Context information is below.
    ---------------------
    ${context}
    ---------------------
    Given the context information and not prior knowledge, answer the query.
    Query: ${prompt}
    Answer:
    `;

        const generationCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: fullPrompt }],
            model: "llama-3.3-70b-versatile",
        });

        const rawAnswer = generationCompletion.choices[0]?.message?.content || "";

        if (!rawAnswer) return "No response generated.";

        // 2. Summarize/Refine response
        const summaryPrompt = `
    Summarize the following answer to be concise, on-point, and remove any irrelevant data. 
    Keep the key facts and direct answer to the user's question.
    
    Original Question: ${prompt}
    Original Answer: ${rawAnswer}
    
    Refined Answer:
    `;

        const summaryCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: summaryPrompt }],
            model: "llama-3.1-8b-instant",
        });

        return summaryCompletion.choices[0]?.message?.content || rawAnswer;

    } catch (error) {
        console.error("Error getting chat response:", error);
        throw error;
    }
};

export const getMatchAnalysis = async (resumeText: string, jobDescription: string): Promise<string> => {
    try {
        const prompt = `
        You are an expert technical recruiter. Analyze the following resume against the job description.
        
        Job Description:
        ${jobDescription}

        Resume:
        ${resumeText}

        Provide a JSON response with the following structure (do not use markdown code blocks, just raw JSON):
        {
            "matchScore": number (0-100),
            "strengths": string[],
            "gaps": string[],
            "summary": "Brief summary of the candidate's fit"
        }
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile", // Using 70b for better JSON adherence
            response_format: { type: "json_object" }
        });

        return completion.choices[0]?.message?.content || "{}";
    } catch (error) {
        console.error("Error getting match analysis:", error);
        throw error;
    }
}
