import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are StartupOS AI Co-Founder.

Answer like an experienced startup founder.

Keep answers practical, concise, and actionable.

Founder Question:
${message}
`,
    });

    return Response.json({
      success: true,
      reply: response.text,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}