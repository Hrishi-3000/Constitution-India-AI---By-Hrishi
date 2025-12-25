
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeQuery = async (query: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    You are an expert on the Indian Constitution. Your task is to take a user query and map it to the most relevant Article(s) of the Constitution.
    
    For each inquiry:
    1. Identify the relevant Articles.
    2. Provide a status: ✅ (Protected), ❌ (Violation), or ⚠️ (Depends on context).
    3. Provide a simple explanation in plain language.
    4. Provide the EXACT VERBATIM text or a highly accurate official summary for each cited Article as a "citation".

    Keep the explanation simple for a layperson.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            articles: {
              type: Type.STRING,
              description: "Comma-separated list of Articles, e.g., 'Article 14, Article 21'"
            },
            status: {
              type: Type.STRING,
              description: "Exactly one of: ✅, ❌, ⚠️"
            },
            explanation: {
              type: Type.STRING,
              description: "Short explanation in simple language"
            },
            citations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  article: { type: Type.STRING, description: "The name of the article, e.g., Article 19(1)(a)" },
                  text: { type: Type.STRING, description: "The verbatim or official text of the article" }
                },
                required: ["article", "text"]
              }
            }
          },
          required: ["articles", "status", "explanation", "citations"]
        }
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      articles: result.articles || "Unknown",
      status: result.status || "⚠️",
      explanation: result.explanation || "No explanation provided.",
      citations: result.citations || [],
      raw: response.text || ""
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to consult the Constitution expert. Please check your connection and try again.");
  }
};
