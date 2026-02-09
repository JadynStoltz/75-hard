import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

export const getDailyMotivation = async (day: number, isToughDay: boolean): Promise<string> => {
  if (!apiKey) return "Stay hard. Keep pushing.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      You are a tough, no-nonsense military-style fitness coach for the 75 Hard challenge.
      The user is on Day ${day} of 75.
      ${isToughDay ? 'The user is struggling or it is a critical milestone day.' : 'The user is progressing.'}
      Give a short, punchy, aggressive motivational quote (max 2 sentences) to keep them disciplined.
      Do not be polite. Be demanding. Focus on discipline, mental toughness, and execution.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Execute the mission.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Silence the inner bitch. Do the work.";
  }
};

export const getRecoveryAdvice = async (): Promise<string> => {
  if (!apiKey) return "Reset and restart. No excuses.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      The user just failed the 75 Hard challenge and has to restart from Day 1.
      Give them a stern but encouraging speech (max 50 words) about how failure is a lesson, not the end.
      Tell them to get back up immediately.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Failure is the tuition you pay for success. Restart now.";
  } catch (error) {
    return "Get back up. Day 1 starts now.";
  }
};
