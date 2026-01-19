import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client lazily
// Note: In a production environment, you should proxy these requests through a backend
// to keep your API key secure. For this demo, we're using the client-side key.

let aiInstance: GoogleGenAI | null = null;

export const getAi = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiInstance;
};

export const MODELS = {
  text: "gemini-2.5-flash",
  vision: "gemini-2.5-flash-image",
  image: "gemini-2.5-flash-image",
};
