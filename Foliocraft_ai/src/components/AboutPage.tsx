import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, Layers, Share2, Database, Download, Zap, 
  ArrowLeft, Github, Linkedin, Mail, Twitter, Globe,
  FileText, BarChart3, Move, Globe2, Bot, Award, Heart, Instagram
} from "lucide-react";

interface AboutPageProps {
  onBack: () => void;
  onEnterBuilder: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack, onEnterBuilder }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const features = [
    {
      title: "AI Portfolio Builder",
      description: "Generates tailored professional content instantly using Google Gemini 3.5 AI APIs.",
      icon: <Sparkles className="w-5 h-5 text-[#F4B400]" />
    },
    {
      title: "Premium Templates",
      description: "A wide variety of clean, eye-catching, modern, and neobrutalist presentation styles.",
      icon: <Layers className="w-5 h-5 text-[#F4B400]" />
    },
    {
      title: "One Click Sharing",
      description: "Zero deployment required! Instantly secure custom share links for recruiters or portfolios.",
      icon: <Share2 className="w-5 h-5 text-[#F4B400]" />
    },
    {
      title: "Firebase Cloud Storage",
      description: "Secure, durable offloaded storage structure keeping user records protected and online.",
      icon: <Database className="w-5 h-5 text-[#F4B400]" />
    },
    {
      title: "Portfolio Downloads",
      description: "Instantly export high quality print-optimized vector PDF formats or offline pages.",
      icon: <Download className="w-5 h-5 text-[#F4B400]" />
    },
    {
      title: "Real-time Generation",
      description: "Adaptive WYSIWYG editor compiles standalone components with responsive live preview.",
      icon: <Zap className="w-5 h-5 text-[#F4B400]" />
    }
  ];

  const upcomingProjects = [
    {
      title: "Drag & Drop Builder",
      description: "Interactive visual layout playground with atomic layout blocks, custom sidebars, and rows.",
      icon: <Move className="w-5 h-5 text-[#F4B400]" />
    },
    {
      title: "AI Bio Generator",
      description: "Smart text processor crafting elegant professional statements for developers and freelancers.",
      icon: <Bot className="w-5 h-5 text-[#F4B400]" />
    }
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection-yellow relative overflow-x-hidden p-0 m-0 font-sans pb-24">
      {/* Background radial glow elements */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full filter blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-1/3 right-[5%] w-[450px] h-[450px] bg-yellow-500/5 rounded-full filter blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />
      <div className="absolute bottom-10 left-[10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full filter blur-[130px] pointer-events-none mix-blend-screen" />

      {/* Modern Saas toolbar */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mt-4 px-6 py-4 flex justify-between items-center bg-[#F4B400] text-stone-950 border-2 border-stone-950 shadow-[4px_4px_0px_rgba(24,24,27,1)] rounded-2xl sticky top-4 z-40"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-950 font-extrabold hover:text-stone-900 transition-colors text-xs font-mono uppercase bg-stone-50/20 px-3.5 py-2.5 rounded-xl border border-stone-950/10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> 
          <span className="hidden sm:inline">Back to Home</span>
          <span className="inline sm:hidden">Home</span>
        </button>
        
        <div className="flex items-center gap-2">
          <motion.span 
            whileHover={{ rotate: 12 }}
            className="p-1.5 bg-stone-950 rounded-lg text-[#F4B400] border border-stone-850"
          >
            <Sparkles className="w-4 h-4 fill-current" />
          </motion.span>
          <span 
            className="text-md font-black tracking-tight text-white font-display uppercase leading-tight"
            style={{
              textShadow: "1px 1px 0px #1c1917, -1px -1px 0px #1c1917, 1px -1px 0px #1c1917, -1px 1px 0px #1c1917, 1.5px 1.5px 0px rgba(28,25,23,0.85)"
            }}
          >
            FolioCraft
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnterBuilder}
          className="bg-stone-950 hover:bg-stone-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-stone-800 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>Get Started</span>
        </motion.button>
      </motion.header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-6 mt-16 space-y-24"
      >
        {/* 1. HERO SECTION */}
        <motion.section variants={itemVariants} className="text-center space-y-6 max-w-4xl mx-auto py-12 relative">
          <div className="absolute inset-0 bg-[#F4B400]/5 rounded-full blur-[80px] -z-10 pointer-events-none" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4B400]/10 border border-[#F4B400]/30 rounded-full select-none">
            <Sparkles className="w-3.5 h-3.5 text-[#F4B400] animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-stone-200 tracking-wider uppercase">Independent Tech Stack v2.1</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight lead-none font-display uppercase">
            Building Digital Identity <br />
            <span className="text-[#F4B400]">for the Modern Generation</span>
          </h1>
          <p className="text-sm md:text-base text-stone-400 font-medium leading-relaxed max-w-2xl mx-auto font-mono">
            FolioCraft helps students, developers, freelancers, teachers, and creators build elegant portfolios with modern AI-powered experiences.
          </p>
        </motion.section>

        {/* BENTO MIX SECTION (Mission & Founder in Bento Grid style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 2. MISSION SECTION */}
          <motion.section 
            variants={itemVariants}
            className="lg:col-span-5 bg-gradient-to-br from-stone-900/90 to-stone-950 border-2 border-stone-850 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between group shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4B400]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="p-2 bg-[#F4B400]/10 text-[#F4B400] rounded-xl w-fit border border-[#F4B400]/20">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <h2 className="text-2xl font-black tracking-tight font-display text-stone-100 uppercase">
                Why FolioCraft Exists
              </h2>
              <p className="text-xs md:text-sm text-stone-400 leading-relaxed font-semibold">
                Many students and creators struggle to present themselves professionally online. FolioCraft aims to make portfolio creation simple, modern, accessible, and visually premium for everyone.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-800/80 flex items-center gap-1.5 text-[10px] font-mono text-stone-500 uppercase tracking-widest">
              <span>EST. 2026</span>
              <span>•</span>
              <span className="text-[#F4B400]">Empowering Creators</span>
            </div>
          </motion.section>

          {/* 3. FOUNDER SECTION */}
          <motion.section 
            variants={itemVariants}
            className="lg:col-span-7 bg-stone-900/90 border-2 border-[#F4B400]/20 rounded-3xl p-8 relative overflow-hidden shadow-xl hover:border-[#F4B400]/40 transition-all duration-300 group"
          >
            {/* Glowing borders and backgrounds */}
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#F4B400]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* circular portfolio placeholder / picture */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-[#F4B400] rounded-full blur-sm animate-pulse opacity-30" />
                <div className="w-24 h-24 rounded-full border-2 border-[#F4B400] bg-stone-950 flex items-center justify-center relative overflow-hidden group-hover:scale-130 transition-transform duration-300">
                  <img
                    src="src/Pro_pic2.jpeg"
                    alt="Sugin Joshuva"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Founder Information Details */}
              <div className="space-y-4 text-center md:text-left flex-1">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#F4B400]/15 text-[#F4B400] border border-[#F4B400]/30 rounded-lg text-[9px] font-mono uppercase font-black tracking-widest mb-2">
                    Founder & Developer
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white font-sans tracking-tight">Sugin Joshuva</h3>
                  <p className="text-xs text-[#F4B400] font-mono font-bold uppercase tracking-wider">Independent Developer & Creator</p>
                  <p className="text-[10px] text-stone-500 font-mono mt-0.5">Location: India</p>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed font-semibold italic">
                  "FolioCraft started as a vision to simplify professional portfolio creation for students, creators, developers, freelancers, and educators. The platform focuses on clean design, modern user experience, and intelligent portfolio generation systems."
                </p>

                {/* Social icons */}
                <div className="flex gap-3 justify-center md:justify-start pt-2 border-t border-stone-800/85">
                  <a href="https://github.com/suginj9" target="_blank" rel="noopener noreferrer" className="p-2 bg-stone-950 text-stone-400 hover:text-[#F4B400] border border-stone-800 rounded-xl transition-colors cursor-pointer" aria-label="GitHub">
                    <Github className="w-4 h-4" />
                  </a>
                  <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="p-2 bg-stone-950 text-stone-400 hover:text-[#F4B400] border border-stone-800 rounded-xl transition-colors cursor-pointer" aria-label="LinkedIn">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="mailto:suginjoshuva@gmail.com" className="p-2 bg-stone-950 text-stone-400 hover:text-[#F4B400] border border-stone-800 rounded-xl transition-colors cursor-pointer" aria-label="Mail">
                    <Mail className="w-4 h-4" />
                  </a> 
                  <a href="https://www.instagram.com/_._it.z_._mr_._jas_._?igsh=MTNmb3gwdTl2N3BnNw==" className="p-2 bg-stone-950 text-stone-400 hover:text-[#F4B400] border border-stone-800 rounded-xl transition-colors cursor-pointer" aria-label="Instagram">
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* 4. PLATFORM FEATURES SECTION */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight font-display uppercase">
              Engineered with Premium Features
            </h2>
            <p className="text-xs text-stone-400 font-mono">
              Designed to serve top-tier portfolios out-of-the-box directly inside browser contexts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => (
              <motion.div
                key={feat.title}
                whileHover={{ y: -4, borderColor: "#F4B400" }}
                className="bg-stone-900/60 border-2 border-stone-850 p-6 rounded-3xl space-y-3.5 transition-all duration-300 relative group"
              >
                <div className="p-2.5 bg-[#F4B400]/10 text-[#F4B400] rounded-xl w-fit border border-[#F4B400]/25 group-hover:bg-[#F4B400]/20 transition-all">
                  {feat.icon}
                </div>
                <h3 className="text-sm font-black text-stone-100 uppercase tracking-wide font-sans">{feat.title}</h3>
                <p className="text-xs text-stone-400 leading-relaxed font-semibold">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 5. UPCOMING PROJECTS SECTION */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight font-display uppercase">
              Upcoming Pipelines
            </h2>
            <p className="text-xs text-stone-400 font-mono">
              What Sugin is actively manufacturing next to expand FolioCraft ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingProjects.map((proj) => (
              <motion.div
                key={proj.title}
                whileHover={{ y: -4, borderColor: "rgba(244,180,0,0.5)" }}
                className="bg-stone-900/40 border border-stone-800/80 p-6 rounded-3xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between h-48"
              >
                {/* Pulsing Glow Border effect */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#F4B400]/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-stone-950 text-[#F4B400] border border-stone-800 rounded-lg">
                      {proj.icon}
                    </div>
                    {/* Animated 'On Process' badge */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4B400]/10 text-[#F4B400] text-[9px] font-black font-mono uppercase rounded-full border border-[#F4B400]/20 select-none shadow-sm animate-pulse">
                      <span className="w-1.5 h-1.5 bg-[#F4B400] rounded-full inline-block animate-ping"></span>
                      On Process
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-stone-200 uppercase tracking-widest">{proj.title}</h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800/80 text-[9px] font-mono text-stone-500 uppercase tracking-wider font-extrabold flex justify-between">
                  <span>Currently in development</span>
                  <span>v2.2 DEV</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};
