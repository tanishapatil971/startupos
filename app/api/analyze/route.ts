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

Startup Goal:
${body.goal}

Startup Context:
${body.context}

Return ONLY valid JSON in this exact format:

{
  "healthScore": 82,
  "risks": [
    "...",
    "...",
    "..."
  ],
  "opportunities": [
    "...",
    "...",
    "..."
  ],
  "nextActions": [
    "...",
    "...",
    "..."
  ],
  "roadmap": [
    {
      "week": "Week 1",
      "title": "...",
      "status": "Pending"
    },
    {
      "week": "Week 2",
      "title": "...",
      "status": "Pending"
    },
    {
      "week": "Week 3",
      "title": "...",
      "status": "Pending"
    },
    {
      "week": "Week 4",
      "title": "...",
      "status": "Goal"
    }
  ]
}

Rules:
- Return ONLY JSON.
- No markdown.
- No explanation.
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