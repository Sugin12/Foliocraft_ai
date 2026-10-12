import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Regular parser middleware
app.use(express.json());

// Initialize Gemini SDK lazily to prevent crash if key is missing or invalid
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "" || apiKey === "undefined") {
      throw new Error("Invalid or missing GEMINI_API_KEY. Please set a valid Gemini API key in the Settings > Secrets configuration.");
    }
    // Clean key of any potential quotes or whitespace
    const cleanKey = apiKey.replace(/['"]/g, "").trim();
    aiClient = new GoogleGenAI({
      apiKey: cleanKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper algorithm to generate beautiful customized bios programmatically when API call is skipped/unavailable
function generateProgrammaticBio(
  fullName?: string, 
  tagline?: string, 
  location?: string, 
  skills?: string[], 
  additionalContext?: string
): string {
  const name = fullName && fullName.trim() ? fullName.trim() : "";
  const role = tagline && tagline.trim() ? tagline.trim() : "Creative Professional";
  const loc = location && location.trim() ? location.trim() : "";
  const skillArray = Array.isArray(skills) && skills.length > 0 ? skills.map(s => s.trim()).filter(Boolean) : [];
  const context = (additionalContext || "").toLowerCase();

  // Pick semantic adjectives in case skills or title indicates category
  const roleLower = role.toLowerCase();
  const isTech = roleLower.match(/(dev|engineer|tech|code|program|web|software|sys|data|front|back|full)/);
  const isEdu = roleLower.match(/(teach|edu|student|school|learn|academy|curriculum|prof|lesson)/);
  const isDesign = roleLower.match(/(design|art|creative|ui|ux|brand|product|graphic|illustr|photo)/);

  // Focus areas
  let skillPhrase = "";
  if (skillArray.length > 0) {
    if (skillArray.length === 1) {
      skillPhrase = `mastery in ${skillArray[0]}`;
    } else if (skillArray.length === 2) {
      skillPhrase = `expertise in ${skillArray[0]} and ${skillArray[1]}`;
    } else {
      skillPhrase = `specialization in ${skillArray.slice(0, -1).join(", ")}, and ${skillArray[skillArray.length - 1]}`;
    }
  } else {
    skillPhrase = isTech ? "building efficient applications and scalable modular architectures" : 
                  isEdu ? "crafting impactful learning modules and interactive mentorship experiences" :
                  isDesign ? "fine visual styling, brand identity design, and modern interactive interfaces" :
                  "driving innovation and building polished, user-centered solutions";
  }

  // Generate introductory sentence
  const introHooks = [
    `Hi, I am ${name || "a dedicated specialist"}. As a ${role}${loc ? ` based in ${loc}` : ""}, I thrive at the intersection of passion, discipline, and user-centric branding.`,
    `Welcome! I am ${name || "a creative builder"}. Working as a ${role}${loc ? ` from ${loc}` : ""}, my ultimate objective is to transform complex challenges into elegant, highly efficient digital solutions.`,
    `Hello there, I'm ${name || "an innovator"}. Serving as a ${role}${loc ? ` in ${loc}` : ""}, I bring a dedicated focus on professional quality and visual elegance to every endeavor.`
  ];

  // Choose hook
  let chosenHook = introHooks[0];
  if (isTech) {
    chosenHook = `Hi, I am ${name || "a software developer"}. Currently active as a ${role}${loc ? ` based in ${loc}` : ""}, I dedicate my energy to writing clean, maintainable systems and bridging technical structures with elegant user logic.`;
  } else if (isEdu) {
    chosenHook = `Greetings, my name is ${name || "an educator"}. Working as a ${role}${loc ? ` in ${loc}` : ""}, my teaching philosophy centers on inspiring minds, sharing collaborative workspace knowledge, and making complex themes deeply accessible.`;
  } else if (isDesign) {
    chosenHook = `Hello, I'm ${name || "a digital designer"}. Working as a ${role}${loc ? ` based out of ${loc}` : ""}, I guide clients through the creative process, focusing heavily on brand strategy, visual aesthetics, and delightful user interactions.`;
  } else {
    const seed = name.length + role.length;
    chosenHook = introHooks[seed % introHooks.length];
  }

  // Paragraph 1 core
  let p1 = chosenHook;
  p1 += ` With a deep-seated love for ${skillPhrase}, I constantly strive to improve and refine my crafts. Every project I undertake is driven by a desire to combine meaningful design with flawless functional implementation.`;

  // Paragraph 2: Professional experience details and concluding focus
  let p2 = "";
  const concludes = [
    `Ultimately, I love collaborating on forward-thinking projects, sharing knowledge with peers, and building work that leaves a lasting positive footprint. Let's connect and turn creative visions into reality!`,
    `I am deeply interested in collaborative environments that push the boundaries of conventional standards. If you are looking to collaborate, build something meaningful, or simply swap stories—let's keep in touch!`,
    `My journey is fueled by constant learning, exploring new mediums, and creating intuitive spaces where technology meets humanity. Let's team up to deliver outstanding, high-fidelity experiences that matter.`
  ];

  let chosenConclude = concludes[0];
  if (context.includes("minimal") || context.includes("clean") || context.includes("short")) {
    chosenConclude = `I'm always eager to collaborate on meaningful projects. Let's partner up to build something beautiful together!`;
  } else if (context.includes("bold") || context.includes("creative") || context.includes("royal")) {
    chosenConclude = `Let's join forces to disrupt conventions and launch experiences that captivate. Feel free to reach out—let's build work that truly matters!`;
  } else if (context.includes("academic") || context.includes("teacher") || context.includes("professional")) {
    chosenConclude = `I look forward to growing alongside fellow innovators, sharing knowledge guides, and delivering top-tier solutions. Let's begin our dialogue today!`;
  } else {
    const seed = name.length + role.length;
    chosenConclude = concludes[seed % concludes.length];
  }

  if (isTech) {
    p2 = `Throughout my development journey, I have prioritized system reliability, performance optimization, and elegant code formatting. ${chosenConclude}`;
  } else if (isEdu) {
    p2 = `My experience spans crafting custom curriculum paths, dynamic activity plans, and hosting collaborative training workshops. ${chosenConclude}`;
  } else if (isDesign) {
    p2 = `Whether creating modern responsive layouts, fine-tuning typography tracking, or configuring beautiful theme palettes, my goal is always visual perfection. ${chosenConclude}`;
  } else {
    p2 = `By maintaining a meticulous eye for details and keeping an adaptable learning mindset, I aim to create work that stands the test of time. ${chosenConclude}`;
  }

  return `${p1}\n\n${p2}`;
}

// Dynamic route to serve profile picture with automatic fallback to github avatar if the file is missing/empty
app.get("/Pro_pic.jpeg", (req, res) => {
  const possiblePaths = [
    path.join(process.cwd(), "src", "Pro_pic.jpeg"),
    path.join(process.cwd(), "Pro_pic.jpeg"),
    path.join(process.cwd(), "assets", "Pro_pic.jpeg"),
  ];
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        const stats = fs.statSync(p);
        if (stats.size > 100) {
          return res.sendFile(p);
        }
      }
    } catch (e) {
      // ignore
    }
  }
  // Redirect to GitHub avatar as high-quality fallback
  res.redirect("https://github.com/suginj9.png");
});

// Ensure the endpoints are declared BEFORE the Vite middleware
// 1. AI Bio Generator Endpoint
app.post("/api/generate-bio", async (req, res) => {
  const { fullName, tagline, location, skills, additionalContext } = req.body;

  try {
    const ai = getGeminiClient();
    const prompt = `You are an expert resume writer and branding consultant.
Create a professional, highly engaging, and modern "About Me" bio for a personal portfolio website.

User Details:
- Name: ${fullName || "A professional"}
- Tagline/Role: ${tagline || "Software Developer"}
- Location: ${location || "Remote"}
- Key Skills: ${Array.isArray(skills) ? skills.join(", ") : "Various Technologies"}
- Custom Note/Style: ${additionalContext || "Make it sound creative, warm, yet professional"}

Requirements:
1. Write 2 solid, refined, and distinct paragraphs (max 150 words total).
2. Paragraph 1: An engaging hook introducing who they are, their core passion, and unique perspective.
3. Paragraph 2: Their professional experience/skills focus and a concluding sentence about what they love building or teaching.
4. Keep the tone warm, confident, elegant, and modern. Perfect for a college student, teacher, or freelancer.
5. Provide ONLY the final bio plain-text. Do not add markdown labels, titles, prefixes like "Paragraph 1:" or quotes. Just standard spacing between paragraphs.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    const bio = response.text || "I am a driven professional specialized in building impactful solutions. Let's connect.";
    res.json({ success: true, bio: bio.trim() });
  } catch (error: any) {
    console.warn("Notice: Gemini Bio execution mode is utilizing local/algorithmic fallback because the key is missing or invalid.");
    
    // Fallback bio creator (generates a customized beautiful bio algorithmically in case API key is missing/fails info)
    const fallbackBio = generateProgrammaticBio(fullName, tagline, location, skills, additionalContext);
    
    res.json({ 
      success: false, 
      bio: fallbackBio, 
      message: error.message || "Using fallback generator due to missing API configuration." 
    });
  }
});

// 2. AI Skill Auto-Suggestion Endpoint
app.post("/api/suggest-skills", async (req, res) => {
  const { tagline, industry } = req.body;

  try {
    const ai = getGeminiClient();
    const prompt = `Provide a list of exactly 10 highly relevant skill keywords/tags suitable for a professional portfolio, based on the provided role details:

Role / Tagline: ${tagline || "Full Stack Developer"}
Industry Focus: ${industry || "Technology / Education / Creative Engineering"}

Generate only standard, high-demand industry skills or technical terms (e.g., "Web Development", "UI/UX Design", "Curriculum Planning", "Lesson Plan Development", "Figma", "React", "TypeScript").
Return ONLY a JSON array containing strings, and nothing else.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    let suggested: string[] = [];
    if (response.text) {
      try {
        suggested = JSON.parse(response.text.trim());
      } catch (err) {
        console.error("JSON parsing error on skills response:", err);
      }
    }

    if (!Array.isArray(suggested) || suggested.length === 0) {
      suggested = ["Communication", "Problem Solving", "Collaboration", "Critical Thinking", "Adaptability"];
    }

    res.json({ success: true, skills: suggested });
  } catch (error: any) {
    console.warn("Notice: Gemini Skill suggestion is utilizing responsive local fallbacks because the key is missing or invalid.");
    
    // Excellent fallback suggestions tailored to keywords in tagline
    const lower = (tagline || "").toLowerCase();
    let fallbackSkills = ["Project Management", "UI/UX Design", "Strategic Thinking", "Public Speaking", "Problem Solving", "Team Collaboration"];
    if (lower.includes("dev") || lower.includes("engineer") || lower.includes("code") || lower.includes("software")) {
      fallbackSkills = ["React", "TypeScript", "Tailwind CSS", "JavaScript", "Node.js", "Git & GitHub", "REST APIs", "SQL", "Front-end Development", "Responsive Layouts"];
    } else if (lower.includes("teach") || lower.includes("educat") || lower.includes("student") || lower.includes("school")) {
      fallbackSkills = ["Public Speaking", "Curriculum Design", "Mentoring", "Research", "Technical Writing", "Lesson Planning", "Time Management", "Adobe Photoshop", "Creative Presentation", "Classroom Leadership"];
    } else if (lower.includes("design") || lower.includes("art") || lower.includes("creative") || lower.includes("free")) {
      fallbackSkills = ["Figma", "UI/UX Design", "Wireframing", "Brand Identity", "Adobe CC", "Responsive Interfaces", "Prototyping", "Freelance Management", "Visual Presentation", "Typography"];
    }

    res.json({ 
      success: false, 
      skills: fallbackSkills, 
      message: error.message || "Using fallback suggestions because of API config." 
    });
  }
});

// 3. AI Custom Template Selector & Theme Generator
app.post("/api/generate-template", async (req, res) => {
  const { prompt: customPrompt } = req.body;

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are a high-end UI/UX design consultant and layout styling engineer.
The user wants you to generate a custom visually-stunning theme configuration for their personal portfolio website based on this design request: "${customPrompt || "Modern Synthwave Neon"}".

Design rules for returned parameters:
1. backgroundColor: Specify a gorgeous Tailwind background color class or dark HEX style (e.g. 'bg-[#0b0c10]' or 'bg-zinc-950' or 'bg-slate-900').
2. textColor: Descriptive text color that is clean and legible against the background (e.g., 'text-slate-300' or 'text-gray-300').
3. headingColor: Bold, elegant heading title color with maximum legibility (e.g., 'text-white' or 'text-[#f8fafc]').
4. taglineColor: Subtitle role text color (e.g. 'text-cyan-400' or 'text-[#00ffd2]').
5. accentColor: Hex value for key highlights, icons, or visual markers (e.g. '#00fcfc' or '#e11d48').
6. accentBg: Accent fill background, matching the accent with transparency (e.g. 'bg-cyan-500/10' or 'bg-[#e11d48]/15').
7. accentBorder: Outline border for tags, matching the accent (e.g. 'border-cyan-500/20' or 'border-[#e11d48]/25').
8. cardBg: Component panel background (e.g., 'bg-slate-900/60' or 'bg-zinc-900/40').
9. cardBorder: Boundary border for containers (e.g., 'border-slate-800' or 'border-zinc-800').
10. fontFamily: Choose exactly one of four:
    - 'sans' (Inter / standard)
    - 'serif' (Playfair / vintage / academic)
    - 'mono' (JetBrains / cyberpunk / brutalist)
    - 'space' (Space Grotesk / SaaS tech / bold digital)
11. badgeBg: Badge component pill background (e.g., 'bg-slate-800', 'bg-zinc-800/40').
12. layoutStyle: Choose exactly one of four structures that matches the concept:
    - 'stack': Clean classical vertical timeline columns.
    - 'grid': Balanced grid layout.
    - 'sidebar': Two-column layout with floating left navigation/hero module.
    - 'bento': Premium Gen Z offset bento grid tiles.
13. themeName: A beautiful, bespoke branding name (e.g., 'Synthwave Twilight', 'Earthy Sage Archive').
14. floatingGlows: A JSON array containing exactly two distinct glow circle hex values (e.g. ['#ff007f', '#00ffd2']).
15. heroPreset: High-contrast capitalized design status subtitle (e.g., 'SYSTEM CHIP // REV 2' or 'ARCHIVAL LOG').

Return ONLY the config object fitting this structure in JSON format. Ensure excellent design cohesion and absolute color contrast.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            backgroundColor: { type: Type.STRING },
            textColor: { type: Type.STRING },
            headingColor: { type: Type.STRING },
            taglineColor: { type: Type.STRING },
            accentColor: { type: Type.STRING },
            accentBg: { type: Type.STRING },
            accentBorder: { type: Type.STRING },
            cardBg: { type: Type.STRING },
            cardBorder: { type: Type.STRING },
            fontFamily: { type: Type.STRING },
            badgeBg: { type: Type.STRING },
            layoutStyle: { type: Type.STRING },
            themeName: { type: Type.STRING },
            floatingGlows: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            heroPreset: { type: Type.STRING }
          },
          required: [
            "backgroundColor", "textColor", "headingColor", "taglineColor",
            "accentColor", "accentBg", "accentBorder", "cardBg", "cardBorder",
            "fontFamily", "badgeBg", "layoutStyle", "themeName", "floatingGlows", "heroPreset"
          ]
        },
      },
    });

    let config: any = null;
    if (response.text) {
      config = JSON.parse(response.text.trim());
    }

    if (config) {
      res.json({ success: true, config });
    } else {
      throw new Error("Could not parse AI generated configuration");
    }

  } catch (error: any) {
    console.warn("Notice: Gemini Template Generator is building beautiful thematic layouts using programmatic design presets because the key is missing or invalid.");

    // Semantic fallback theme mapper
    const promptLower = (customPrompt || "").toLowerCase();
    let fallbackConfig = {
      backgroundColor: "bg-[#0b0f19]",
      textColor: "text-slate-300",
      headingColor: "text-white",
      taglineColor: "text-cyan-400",
      accentColor: "#00fcfc",
      accentBg: "bg-cyan-500/10",
      accentBorder: "border-cyan-500/20",
      cardBg: "bg-slate-900/60",
      cardBorder: "border-slate-800",
      fontFamily: "space",
      badgeBg: "bg-slate-800",
      layoutStyle: "bento",
      themeName: "Indigo Synthwave (Fallback)",
      floatingGlows: ["rgba(255,0,128,0.12)", "rgba(0,252,252,0.12)"],
      heroPreset: "SYNTH ENGINE // RUNNING"
    };

    if (promptLower.includes("green") || promptLower.includes("nature") || promptLower.includes("forest") || promptLower.includes("sage")) {
      fallbackConfig = {
        backgroundColor: "bg-[#081C15]",
        textColor: "text-emerald-100/90",
        headingColor: "text-white",
        taglineColor: "text-[#D8F3DC]",
        accentColor: "#52B788",
        accentBg: "bg-emerald-500/10",
        accentBorder: "border-emerald-500/20",
        cardBg: "bg-[#1B4332]/40",
        cardBorder: "border-[#2D6A4F]",
        fontFamily: "serif",
        badgeBg: "bg-[#2D6A4F]/30",
        layoutStyle: "stack",
        themeName: "Forest Sage (Fallback)",
        floatingGlows: ["rgba(82,183,136,0.12)", "rgba(116,198,157,0.1)"],
        heroPreset: "ARCHIVAL NATURE MANUSCRIPT"
      };
    } else if (promptLower.includes("warm") || promptLower.includes("sunset") || promptLower.includes("red") || promptLower.includes("orange")) {
      fallbackConfig = {
        backgroundColor: "bg-[#1A0F0F]",
        textColor: "text-amber-100/90",
        headingColor: "text-[#FFF5F5]",
        taglineColor: "text-amber-400",
        accentColor: "#FF5A5F",
        accentBg: "bg-[#FF5A5F]/10",
        accentBorder: "border-[#FF5A5F]/20",
        cardBg: "bg-stone-900/60",
        cardBorder: "border-stone-800",
        fontFamily: "sans",
        badgeBg: "bg-[#FF5A5F]/15",
        layoutStyle: "grid",
        themeName: "Warm Crimson Sunset (Fallback)",
        floatingGlows: ["rgba(255,90,95,0.12)", "rgba(244,180,0,0.1)"],
        heroPreset: "WARM AUTUMN HORIZON"
      };
    } else if (promptLower.includes("matrix") || promptLower.includes("hack") || promptLower.includes("terminal") || promptLower.includes("green code")) {
      fallbackConfig = {
        backgroundColor: "bg-[#000000]",
        textColor: "text-[#00FF00]/80",
        headingColor: "text-[#00FF00]",
        taglineColor: "text-[#00FF00]/90",
        accentColor: "#00FF00",
        accentBg: "bg-[#00FF00]/10",
        accentBorder: "border-[#00FF00]/30",
        cardBg: "bg-[#050505]",
        cardBorder: "border-[#00FF00]/20",
        fontFamily: "mono",
        badgeBg: "bg-[#00FF00]/10",
        layoutStyle: "sidebar",
        themeName: "Digital Matrix Code (Fallback)",
        floatingGlows: ["rgba(0,255,0,0.06)", "rgba(0,50,0,0.2)"],
        heroPreset: "CONSTRUCT ENGINE // SECURE"
      };
    } else if (promptLower.includes("cute") || promptLower.includes("pastel") || promptLower.includes("pink") || promptLower.includes("rainbow")) {
      fallbackConfig = {
        backgroundColor: "bg-pink-50/50",
        textColor: "text-rose-950/80",
        headingColor: "text-rose-950",
        taglineColor: "text-rose-500",
        accentColor: "#EC4899",
        accentBg: "bg-rose-100",
        accentBorder: "border-rose-200",
        cardBg: "bg-white/80",
        cardBorder: "border-rose-100",
        fontFamily: "sans",
        badgeBg: "bg-pink-100/50",
        layoutStyle: "grid",
        themeName: "Pastel Sweet Pink (Fallback)",
        floatingGlows: ["rgba(236,72,153,0.15)", "rgba(244,180,0,0.12)"],
        heroPreset: "CREATIVE COTTON CANDY HUB"
      };
    }

    res.json({
      success: false,
      config: fallbackConfig,
      message: error.message || "Using beautiful algorithmic fallback design."
    });
  }
});

// Configure Vite middleware for development or Static Asset serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("In development mode. Setting up Vitex middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving compiled static files in production...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio Builder server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
