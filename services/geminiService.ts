import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION_COACH, SYSTEM_INSTRUCTION_TASK_BREAKDOWN, SYSTEM_INSTRUCTION_HABIT_ANALYSIS } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const geminiService = {
  // Chat with the AI Coach
  async chatWithCoach(history: {role: 'user' | 'model', text: string}[], message: string) {
    if (!apiKey) throw new Error("API Key missing");

    try {
      // Use flash for quick conversational responses
      const model = 'gemini-3-flash-preview';
      
      const response = await ai.models.generateContent({
        model,
        contents: [
            ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
            { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_COACH,
        }
      });
      return response.text || "I'm having trouble thinking right now. Try again?";
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return "Sorry, I couldn't connect to the coach. Please check your connection.";
    }
  },

  // Break down a large task into smaller ones
  async breakDownTask(taskDescription: string): Promise<any[]> {
    if (!apiKey) throw new Error("API Key missing");

    try {
        // Use pro for better logic/reasoning on task breakdown
        const model = 'gemini-3-pro-preview';
        const response = await ai.models.generateContent({
            model,
            contents: taskDescription,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION_TASK_BREAKDOWN,
                responseMimeType: "application/json",
                 responseSchema: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        category: { type: Type.STRING, enum: ['work', 'personal', 'growth'] }
                      },
                      required: ['title', 'category']
                    }
                 }
            }
        });

        const jsonStr = response.text || "[]";
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Task Error:", error);
        return [];
    }
  },

  // Analyze habit consistency
  async analyzeHabits(habitData: string): Promise<string> {
      if (!apiKey) return "API Key missing.";
      
      try {
          const model = 'gemini-3-flash-preview';
          const response = await ai.models.generateContent({
              model,
              contents: `Here is my habit data: ${habitData}`,
              config: {
                  systemInstruction: SYSTEM_INSTRUCTION_HABIT_ANALYSIS
              }
          });
          return response.text || "Keep going! Consistency is key.";
      } catch (error) {
          console.error("Gemini Habit Error:", error);
          return "Great job keeping track of your habits!";
      }
  }
};