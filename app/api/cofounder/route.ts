import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success: rateLimitSuccess, reset } = await checkRateLimit(user.id, "cofounder");
    if (!rateLimitSuccess) {
      return NextResponse.json(
        { error: "Too Many Requests" },
        { 
          status: 429, 
          headers: {
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt.substring(0, 1000));
    const response = result.response.text();

    return NextResponse.json({
      answer: response,
    });
  } catch (error) {
    logger.error("Cofounder service failed", { error, route: "/api/cofounder", operation: "POST" });
    return NextResponse.json(
      { error: "AI Cofounder is temporarily unavailable." },
      { status: 500 }
    );
  }
}