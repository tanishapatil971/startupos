"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CofounderPage() {

  const [question, setQuestion] = useState("");

  const [messages, setMessages] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);



  async function askAI() {

    if (!question.trim()) return;


    setLoading(true);



    const {
      data: { user },
    } = await supabase.auth.getUser();


    if (!user) return;




    const { data: company } =
      await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .single();





    const prompt = `

You are StartupOS, an AI Chief of Staff for founders.

You ONLY help with:
- startups
- business strategy
- growth
- marketing
- product decisions
- fundraising
- operations


Reject unrelated requests politely.


Company Context:

Name:
${company.name}

Industry:
${company.industry}

Stage:
${company.stage}

Description:
${company.description}

Customers:
${company.target_customers}

Business Model:
${company.business_model}

Current Problem:
${company.current_problem}

Main Goal:
${company.main_goal}



Founder Question:

${question}


Give practical founder-level advice.

`;




    const response =
      await fetch("/api/cofounder", {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            prompt: prompt,
          }),

      });



    const result =
      await response.json();


    const answer =
      result.answer;

    await supabase
      .from("ai_chats")
      .insert({

        user_id:
          user.id,

        company_id:
          company.id,

        question,

        answer,

      });




    setMessages([

      ...messages,

      {
        role: "user",
        text: question,
      },

      {
        role: "ai",
        text: answer,
      },

    ]);



    setQuestion("");

    setLoading(false);

  }







  return (

    <main className="min-h-screen p-10 text-white">


      <h1 className="shimmer-text text-5xl font-bold leading-tight pb-2">

        AI Cofounder

      </h1>


      <p className="text-gray-400 mb-8">

        Ask StartupOS anything about your company.

      </p>





      <div className="space-y-5 mb-8">


        {messages.map((m, i) => (

          <div

            key={i}

            className="
              glass
              rounded-3xl
              p-5
            "

          >

            <b>
              {m.role === "ai"
                ? "StartupOS"
                : "You"}
            </b>


            <p className="mt-3 whitespace-pre-wrap">

              {m.text}

            </p>


          </div>

        ))}


      </div>






      <div className="glass rounded-3xl p-5 flex gap-4">


        <input

          value={question}

          onChange={(e) =>
            setQuestion(e.target.value)
          }


          placeholder="Ask your AI Cofounder..."

          className="
            flex-1
            bg-transparent
            outline-none
          "

        />



        <button

          onClick={askAI}

          className="
            rounded-xl
            bg-indigo-500
            px-6
            py-3
            font-semibold
          "

        >

          {loading
            ? "Thinking..."
            : "Ask"}

        </button>


      </div>


    </main>

  );

}