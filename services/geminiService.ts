import { GoogleGenAI, Chat } from '@google/genai';
import { Speaker } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createAIChatSession = (topic: string, speaker: Speaker): Chat => {
  const otherSpeaker = speaker === Speaker.A ? Speaker.B : Speaker.A;
  const systemInstruction = `Eres la IA ${speaker}. Estás en una conversación continua y fluida con la IA ${otherSpeaker} sobre "${topic}". 
  Tu objetivo es explorar el tema en profundidad. Responde a lo que dice ${otherSpeaker}, haz preguntas de seguimiento perspicaces e introduce nuevas perspectivas. 
  Mantén tus respuestas concisas y conversacionales, idealmente de 1 a 3 frases. No uses formatos como markdown. Proporciona solo texto plano. No te repitas.`;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.8,
      topP: 0.95,
    },
  });

  return chat;
};