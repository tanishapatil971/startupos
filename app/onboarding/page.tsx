"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {

  const router = useRouter();

  const [form, setForm] = useState({

    name: "",
    industry: "",
    stage: "",
    description: "",
    target_customers: "",
    business_model: "",
    current_problem: "",
    main_goal: "",

  });


  async function saveCompany() {

    const {
      data: { user },
    } = await supabase.auth.getUser();


    if (!user) return;


    const { error } =
      await supabase
        .from("companies")
        .insert({

          user_id: user.id,

          ...form,

        });


    if (error) {

      alert(error.message);
      return;

    }


    router.push("/");

  }



  return (

    <main className="min-h-screen p-10 text-white">


      <h1 className="shimmer-text text-5xl font-bold mb-3 leading-tight pb-2">

        Build your Company Brain

      </h1>


      <p className="text-gray-400 mb-10">

        StartupOS learns your startup before giving advice.

      </p>



      <div className="glass rounded-3xl p-8 space-y-5 max-w-3xl">


        {Object.keys(form).map((key) => (

          <input

            key={key}

            placeholder={
              key.replace("_", " ")
            }

            value={
              (form as any)[key]
            }

            onChange={(e) =>
              setForm({

                ...form,

                [key]:
                  e.target.value,

              })
            }


            className="
              w-full
              rounded-xl
              bg-white/[0.05]
              border
              border-white/10
              p-4
              outline-none
            "

          />

        ))}



        <button

          onClick={saveCompany}

          className="
            rounded-2xl
            bg-indigo-500
            px-8
            py-3
            font-semibold
          "

        >

          Create Company Brain 🧠

        </button>


      </div>


    </main>

  );
}