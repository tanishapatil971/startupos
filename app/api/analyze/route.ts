import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an expert startup advisor.

Analyze this startup:

${body.context}

Return ONLY valid JSON:

{
  "healthScore": 0,
  "risks": [],
  "opportunities": [],
  "nextActions": []
}

No markdown.
No explanation.
Only JSON.
`,
    });

    const analysis = JSON.parse(response.text || "{}");

    return Response.json({
      success: true,
      analysis,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}