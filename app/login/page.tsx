"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [hoverFeature, setHoverFeature] = useState<number | null>(null);

  async function loginWithGoogle() {
    setIsLoggingIn(true);
    
    // Simulate a brief loading/success transition before actual redirect
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (!error) {
         setLoginSuccess(true);
      }
    } catch (e) {
      console.error(e);
      setIsLoggingIn(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-[#08090d] text-white overflow-hidden">
      {/* Left Panel: Value Prop & Preview */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 border-r border-white/10 relative bg-[#0e1015]">
        
        {/* Background glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[120px]" />
          <div className="absolute top-[60%] -right-[20%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold">
               S
             </div>
             <span className="text-xl font-semibold tracking-tight">StartupOS</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl lg:text-5xl font-bold leading-tight mb-6"
          >
            Your AI founder <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              workspace.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-lg max-w-md mb-12"
          >
            Build, validate, and scale your startup with an intelligent OS that learns your business context.
          </motion.p>
          
          {/* Interactive Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 max-w-md"
          >
            {[
              { title: "Company Brain", desc: "Context-aware AI tailored to your startup." },
              { title: "Strategic Roadmaps", desc: "Actionable steps from idea to scale." },
              { title: "Market Intelligence", desc: "Real-time insights and competitor analysis." }
            ].map((feature, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => setHoverFeature(idx)}
                onMouseLeave={() => setHoverFeature(null)}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-default ${
                  hoverFeature === idx 
                    ? "bg-white/10 border-white/20 scale-[1.02]" 
                    : "bg-white/5 border-white/5"
                }`}
              >
                <h3 className="font-medium text-gray-200 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-gray-500 mt-12">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Enterprise-grade security. Privacy-first architecture.
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
           
           <AnimatePresence mode="wait">
             {!loginSuccess ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <h2 className="text-3xl font-bold mb-3 tracking-tight">Welcome back</h2>
                  <p className="text-gray-400 mb-8">Sign in to your secure workspace.</p>

                  <button
                    onClick={loginWithGoogle}
                    disabled={isLoggingIn}
                    aria-label="Continue with Google"
                    className="
                      group relative w-full flex items-center justify-center gap-3 rounded-2xl
                      bg-white text-black px-6 py-4 font-semibold text-[15px]
                      transition-all duration-300 hover:bg-gray-200 disabled:opacity-80 disabled:cursor-not-allowed
                    "
                  >
                    {isLoggingIn ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )}
                    {isLoggingIn ? "Authenticating..." : "Continue with Google"}
                  </button>
                  
                  <p className="mt-8 text-xs text-gray-500">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </motion.div>
             ) : (
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Authenticated successfully</h2>
                  <p className="text-gray-400">Preparing your workspace...</p>
                </motion.div>
             )}
           </AnimatePresence>

        </div>
      </div>
    </main>
  );
}