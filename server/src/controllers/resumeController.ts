import { Request, Response } from 'express';
import multer from 'multer';
import pdf from 'pdf-parse';
import fs from 'fs';
import { addDocument, clearVectorStore, retrieveContext } from '../services/rag';
import { getMatchAnalysis, getChatResponse } from '../services/llm';

// Multer setup for memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

// Store latest analysis in memory for simplicity (per user session ideally, but global for this demo)
let currentResumeText = "";
let currentJobDescription = "";

export const analyzeResume = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        const { jobDescription } = req.body;

        if (!file || !jobDescription) {
            return res.status(400).json({ error: "Resume PDF and Job Description are required." });
        }

        // 1. Parse PDF
        const pdfData = await pdf(file.buffer);
        const resumeText = pdfData.text;
        currentResumeText = resumeText;
        currentJobDescription = jobDescription;

        // 2. Index for RAG
        clearVectorStore(); // Clear previous resume
        await addDocument(resumeText);

        // 3. Generate Analysis
        const analysisJson = await getMatchAnalysis(resumeText, jobDescription);

        let analysis;
        try {
            analysis = JSON.parse(analysisJson);
        } catch (e) {
            console.error("Failed to parse Gemini response as JSON", analysisJson);
            // Fallback if JSON parsing fails
            analysis = {
                matchScore: 0,
                strengths: ["Error parsing analysis"],
                gaps: ["Error parsing analysis"],
                summary: analysisJson
            };
        }

        res.json(analysis);

    } catch (error) {
        console.error("Error in analyzeResume:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const chatWithResume = async (req: Request, res: Response) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        // 1. Retrieve relevant context
        const context = await retrieveContext(question);

        // 2. Get LLM response
        const answer = await getChatResponse(question, context);

        res.json({ answer, context }); // Return context for debugging/transparency

    } catch (error) {
        console.error("Error in chatWithResume:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
