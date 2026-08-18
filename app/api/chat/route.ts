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

    const { success: rateLimitSuccess, reset } = await checkRateLimit(user.id, "chat");
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
    const message = body.message;
    
    if (!message || typeof message !== "string") {
       return NextResponse.json({ success: false, error: "Invalid message" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are StartupOS AI Co-Founder.

Answer like an experienced startup founder.

Keep answers practical, concise, and actionable.

Founder Question:
${message.substring(0, 1000)}
`,
    });

    return NextResponse.json({
      success: true,
      reply: response.text,
    });
  } catch (error) {
    logger.error("Chat failed", { error, route: "/api/chat", operation: "POST" });
    return NextResponse.json({
      success: false,
      error: "Chat service is temporarily unavailable.",
    }, { status: 500 });
  }
}