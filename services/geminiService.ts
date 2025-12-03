import { GoogleGenAI } from "@google/genai";
import { Track } from "../types";

// Safety check for API Key to prevent runtime crashes if process is undefined
const getApiKey = () => {
  try {
    // Check if process is defined first to avoid ReferenceError in some browser envs
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || '';
    }
    return '';
  } catch (e) {
    console.warn("process.env is not accessible.");
    return '';
  }
};

const apiKey = getApiKey();
// Only initialize AI if key exists, otherwise handle gracefully in function
const ai = apiKey ? new GoogleGenAI({ apiKey: apiKey }) : null;

export const getSongInsight = async (track: Track): Promise<string> => {
  try {
    if (!ai) {
      return "Gemini API Key 缺失，請設定環境變數 API_KEY。";
    }

    const model = 'gemini-2.5-flash';
    
    const prompt = `
      You are a music critic and cultural expert assisting the artist "Willwi".
      Analyze the song metadata below and provide a creative, engaging insight about the song's potential meaning, cultural context, or production style.
      Please write the response in Traditional Chinese (繁體中文).
      Keep it brief (under 100 words) and inspiring for fans.
      
      Song Title: ${track.title}
      Artist: ${track.artist}
      Languages: ${track.languages.join(', ')}
      Project Type: ${track.project}
      Description: ${track.description || 'No description provided.'}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "目前無法生成解析。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 解析暫時不可用。";
  }
};