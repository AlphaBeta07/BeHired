import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Ensure GEMINI_API_KEY is present in your .env file
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "YOUR_API_KEY"
});

/**
 * Intelligent Analyst: Summarize Job Descriptions and structure unstructured data
 */
export async function summarizeJobDescription(jdText: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `You are an expert HR 'Intelligent Analyst'. Summarize the following job description and extract key points, required skills, and the primary role in a structured format:
      
Job Description:
${jdText}
      `
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini AI Summarization Failed:", error);
    throw error;
  }
}
