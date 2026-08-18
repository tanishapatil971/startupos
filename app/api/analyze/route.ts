import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { success: rateLimitSuccess, reset } = await checkRateLimit(user.id, "analyze");
    if (!rateLimitSuccess) {
      return NextResponse.json(
        { success: false, error: "Too Many Requests" },
        { 
          status: 429, 
          headers: {
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    const body = await request.json();
    
    // Add basic rate-limit simulation/protection or just input validation
    if (!body.goal || !body.context) {
       return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an expert startup advisor.

Startup Goal:
${body.goal.substring(0, 2000)}

Startup Context:
${body.context.substring(0, 5000)}

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

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    logger.error("Analysis failed", { error, route: "/api/analyze", operation: "POST" });
    return NextResponse.json({
      success: false,
      error: "Analysis failed. Please try again later.",
    }, { status: 500 });
  }
}