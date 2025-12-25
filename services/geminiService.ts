
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getWeddingQuote = async (groom: string, bride: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buatkan kutipan (quote) pernikahan islami puitis untuk pasangan ${groom} dan ${bride}. 
      Gunakan metafora pendakian gunung, petualangan, perjalanan alam, atau mencapai puncak bersama. 
      Bahasa Indonesia yang sangat indah, romantis, dan bermakna. Maksimal 2 kalimat pendek.`,
    });
    return response.text || "Mendaki bersama menuju puncak ketaatan, merajut rida-Nya dalam setiap langkah petualangan cinta.";
  } catch (error) {
    console.error("Error fetching quote:", error);
    return "Cinta adalah perjalanan mendaki menuju satu rida-Nya, di mana doa adalah bekal dan sabar adalah kompasnya.";
  }
};
