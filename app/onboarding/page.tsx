"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const ONBOARDING_STEPS = [
  {
    id: "basics",
    title: "The Basics",
    subtitle: "Let's start with the fundamental identity of your startup.",
    fields: [
      { key: "name", label: "Company Name", example: "e.g., StartupOS, Acme Corp" },
      { key: "industry", label: "Industry", example: "e.g., B2B SaaS, Fintech, Healthtech" },
    ],
  },
  {
    id: "solution",
    title: "Your Solution",
    subtitle: "Tell us what you are building and where you are at.",
    fields: [
      { key: "stage", label: "Current Stage", example: "e.g., Idea, Prototype, Seed" },
      { key: "description", label: "Brief Description", example: "e.g., An AI-powered platform for founders to manage..." },
    ],
  },
  {
    id: "market",
    title: "Market & Model",
    subtitle: "Who are you serving and how does it work?",
    fields: [
      { key: "target_customers", label: "Target Customers", example: "e.g., Mid-market marketing teams" },
      { key: "business_model", label: "Business Model", example: "e.g., B2B Subscription, Marketplace take rate" },
    ],
  },
  {
    id: "goals",
    title: "Current Focus",
    subtitle: "Help the Company Brain understand your immediate priorities.",
    fields: [
      { key: "current_problem", label: "Current Biggest Problem", example: "e.g., High churn rate, finding product-market fit" },
      { key: "main_goal", label: "Main Goal (Next 3 months)", example: "e.g., Reach $10k MRR, launch v1.0" },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(0);
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

  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load auto-save
  useEffect(() => {
    const saved = localStorage.getItem("startupos_onboarding");
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch (e) {
        // ignore parsing error
      }
    }
    setIsLoaded(true);
  }, []);

  // Auto-save on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("startupos_onboarding", JSON.stringify(form));
    }
  }, [form, isLoaded]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrorMsg("");
  };

  const handleNext = () => {
    const stepDef = ONBOARDING_STEPS[currentStep];
    // Simple validation
    for (const field of stepDef.fields) {
      if (!(form as any)[field.key].trim()) {
        setErrorMsg("Please fill out all fields to continue.");
        return;
      }
    }
    
    setErrorMsg("");
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((c) => c + 1);
    } else {
      saveCompany();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((c) => c - 1);
      setErrorMsg("");
    }
  };

  async function saveCompany() {
    setIsSaving(true);
    setErrorMsg("");
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setErrorMsg("Authentication error. Please sign in again.");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.from("companies").insert({
      user_id: user.id,
      ...form,
    });

    if (error) {
      setErrorMsg(error.message);
      setIsSaving(false);
      return;
    }

    // Success animation phase
    setIsSuccess(true);
    localStorage.removeItem("startupos_onboarding");
    
    // Smooth transition to dashboard after animation
    setTimeout(() => {
      router.push("/");
    }, 2500);
  }

  if (!isLoaded) return null; // Avoid hydration mismatch

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#08090d] text-white flex items-center justify-center relative overflow-hidden">
        {/* Success background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(99,102,241,0.5)]"
          >
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
          >
            Company Brain Created
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-xl text-indigo-200"
          >
            Entering your workspace...
          </motion.p>
        </motion.div>
      </main>
    );
  }

  const stepDef = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <main className="min-h-screen bg-[#08090d] text-white flex flex-col items-center pt-24 px-6 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header & Progress */}
        <div className="mb-12">
           <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-[10px]">
                  S
                </div>
                <span className="font-semibold text-sm tracking-tight text-gray-300">StartupOS</span>
             </div>
             <button 
                onClick={() => {
                   // Using native alert for simplicity in exit action, but it just saves automatically
                   alert("Progress saved. You can safely close this window and resume later.");
                }}
                className="text-sm text-gray-500 hover:text-white transition-colors"
             >
                Save & Exit
             </button>
           </div>
           
           <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               transition={{ duration: 0.3 }}
             />
           </div>
           <div className="mt-2 text-xs font-medium text-indigo-400 uppercase tracking-widest">
             Step {currentStep + 1} of {ONBOARDING_STEPS.length}
           </div>
        </div>

        {/* Form Container */}
        <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl relative">
           <AnimatePresence mode="wait">
             <motion.div
               key={stepDef.id}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
             >
                <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">{stepDef.title}</h1>
                <p className="text-gray-400 mb-10 text-lg">{stepDef.subtitle}</p>

                <div className="space-y-8">
                  {stepDef.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300 ml-1">
                        {field.label}
                      </label>
                      <input
                        value={(form as any)[field.key]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="
                          w-full rounded-xl bg-white/[0.03] border border-white/10 
                          px-5 py-4 text-white outline-none transition-all
                          focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-indigo-500/10
                        "
                      />
                      <p className="text-xs text-gray-500 ml-1 mt-1 font-medium">{field.example}</p>
                    </div>
                  ))}
                </div>
             </motion.div>
           </AnimatePresence>

           {errorMsg && (
             <motion.div 
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
             >
               {errorMsg}
             </motion.div>
           )}

           {/* Navigation Controls */}
           <div className="mt-12 flex items-center justify-between pt-6 border-t border-white/10">
             <button
                onClick={handleBack}
                disabled={currentStep === 0 || isSaving}
                className={`text-sm font-medium transition-colors ${
                  currentStep === 0 ? "text-transparent pointer-events-none" : "text-gray-400 hover:text-white"
                }`}
             >
                &larr; Back
             </button>
             
             <button
               onClick={handleNext}
               disabled={isSaving}
               className="
                 relative flex items-center justify-center gap-2 rounded-xl
                 bg-white text-black px-8 py-3.5 font-semibold text-sm
                 transition-all hover:bg-gray-100 disabled:opacity-80
               "
             >
               {isSaving ? (
                 <>
                   <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Creating Brain...
                 </>
               ) : (
                 currentStep === ONBOARDING_STEPS.length - 1 ? "Initialize Brain 🧠" : "Continue"
               )}
             </button>
           </div>
        </div>
      </div>
    </main>
  );
}