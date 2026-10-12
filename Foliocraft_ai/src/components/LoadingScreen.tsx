import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

export const LoadingScreen: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Loading FolioCraft Builder...";

  // Typing effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Soft random floating particles
  const particles = Array.from({ length: 15 });

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
      className="fixed inset-0 bg-stone-950 flex flex-col justify-center items-center z-[9999]"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-amber-500/10 rounded-full filter blur-[100px] pointer-events-none animate-pulse duration-2000" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: Math.random() * 0.4 + 0.1, 
              scale: Math.random() * 0.6 + 0.4,
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 20
            }}
            animate={{ 
              y: -50,
              x: `calc(10px + ${Math.random() * 100}px + ${Math.sin(i) * 30}px)`
            }}
            transition={{ 
              duration: Math.random() * 7 + 5, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 3
            }}
            className="absolute w-1.5 h-1.5 bg-[#F4B400] rounded-full"
          />
        ))}
      </div>

      <div className="flex flex-col items-center space-y-6 z-10">
        {/* Futuristic Loader */}
        <div className="relative flex justify-center items-center">
          {/* Animated glow pulse outer ring */}
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.7, 0.3],
              rotate: 360
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3, 
              ease: "easeInOut" 
            }}
            className="w-20 h-20 border border-[#F4B400]/40 rounded-full absolute shadow-[0_0_30px_rgba(244,180,0,0.3)]"
          />
          {/* Inner rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-14 h-14 border-t-2 border-r-2 border-b border-[#F4B400] rounded-full"
          />
          {/* Logo element center */}
          <div className="absolute p-2 bg-stone-900 rounded-xl border border-stone-800 text-[#F4B400]">
            <Sparkles className="w-5 h-5 fill-current animate-pulse text-[#F4B400]" />
          </div>
        </div>

        {/* Typing text with cursor */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center gap-1">
            <h2 className="text-sm font-semibold tracking-widest font-mono text-stone-200 uppercase min-h-[20px]">
              {typedText}
            </h2>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-1.5 h-4 bg-[#F4B400]"
            />
          </div>
          <p className="text-[10px] text-stone-500 tracking-widest uppercase font-mono uppercase">
            Securing Sandbox environment & Assets
          </p>
        </div>
      </div>
    </motion.div>
  );
};
