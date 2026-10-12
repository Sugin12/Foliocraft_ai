import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PortfolioData, Education, Experience, Project, Certificate } from "../types";
import { 
  Sparkles, Plus, Trash2, Globe, Github, Linkedin, Instagram, 
  MapPin, Phone, Mail, Award, ArrowLeft, ArrowRight, BookOpen, Laptop, Camera, FileText,
  SlidersHorizontal, RotateCw, Move, Check, X, RefreshCw
} from "lucide-react";

interface StepFormProps {
  data: PortfolioData;
  updateData: (updates: Partial<PortfolioData>) => void;
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onGenerateBio: (additionalContext: string) => Promise<void>;
  isGeneratingBio: boolean;
  onGenerateSkills: () => Promise<void>;
  isGeneratingSkills: boolean;
  onShareLink?: () => void;
  onDownloadPDF?: () => void;
  isExportingPDF?: boolean;
  isSharing?: boolean;
  onTriggerPrint?: () => void;
  onGenerateTemplate?: (prompt: string) => Promise<void>;
  isGeneratingTemplate?: boolean;
  currentUser?: any;
}

// Creative avatar options
const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", // Female tech Enthusiast
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", // Male Dev
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", // Creator
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200", // Designer
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200", // Academic Teacher
];

export const StepForm: React.FC<StepFormProps> = ({
  data,
  updateData,
  currentStep,
  onNext,
  onBack,
  onGenerateBio,
  isGeneratingBio,
  onGenerateSkills,
  isGeneratingSkills,
  onShareLink,
  onDownloadPDF,
  isExportingPDF = false,
  isSharing = false,
  onTriggerPrint,
  onGenerateTemplate,
  isGeneratingTemplate = false,
  currentUser = null
}) => {
  // Input fields for step forms
  const [eduInst, setEduInst] = useState("");
  const [eduDeg, setEduDeg] = useState("");
  const [eduDept, setEduDept] = useState("");
  const [eduStart, setEduStart] = useState("");
  const [eduEnd, setEduEnd] = useState("");
  const [eduGrade, setEduGrade] = useState("");

  const [expComp, setExpComp] = useState("");
  const [expRole, setExpRole] = useState("");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");
  const [expIsCurrent, setExpIsCurrent] = useState(false);
  const [expLocation, setExpLocation] = useState("");
  const [expDesc, setExpDesc] = useState("");

  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projTags, setProjTags] = useState("");
  const [projRepo, setProjRepo] = useState("");
  const [projLive, setProjLive] = useState("");
  const [projTheme, setProjTheme] = useState("from-amber-400 to-yellow-500");

  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certUrl, setCertUrl] = useState("");

  const [newSkill, setNewSkill] = useState("");
  const [bioContext, setBioContext] = useState("");
  const [showBioPrompt, setShowBioPrompt] = useState(false);
  const [tmplPrompt, setTmplPrompt] = useState("");

  // Photo cropper states
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [imgIsLandscape, setImgIsLandscape] = useState(false);

  // Quick skill suggestions
  const SUGGESTED_SKILL_POOL = [
    "HTML5 & CSS3", "React", "TypeScript", "Tailwind CSS", "Node.js", 
    "Figma", "UI/UX Design", "Python", "SQL", "Git & GitHub",
    "Public Speaking", "Classroom Leadership", "Lesson Planning", "Curriculum Design",
    "Technical Writing", "Creative Presentation", "Problem Solving"
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageUrl(reader.result as string);
        setZoom(1.0);
        setRotation(0);
        setOffsetX(0);
        setOffsetY(0);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditCurrentPhoto = () => {
    if (data.basicDetails.avatarUrl) {
      setTempImageUrl(data.basicDetails.avatarUrl);
      setZoom(1.0);
      setRotation(0);
      setOffsetX(0);
      setOffsetY(0);
      setIsCropperOpen(true);
    }
  };

  const handlePresetSelect = (url: string) => {
    setTempImageUrl(url);
    setZoom(1.0);
    setRotation(0);
    setOffsetX(0);
    setOffsetY(0);
    setIsCropperOpen(true);
  };

  const cropImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    if (!tempImageUrl.startsWith("data:")) {
      img.crossOrigin = "anonymous";
    }
    img.src = tempImageUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, 300, 300);
      ctx.save();
      ctx.translate(150, 150);

      // Translate offsets proportional to preview diameter of 192px and canvas width of 300px
      const scaleFactor = 300 / 192;
      ctx.translate(offsetX * scaleFactor, offsetY * scaleFactor);

      // Rotate context
      ctx.rotate((rotation * Math.PI) / 185);

      let drawWidth = 300;
      let drawHeight = 300;
      const imgRatio = img.width / img.height;
      
      if (imgRatio > 1) {
        drawHeight = 300;
        drawWidth = 300 * imgRatio;
      } else {
        drawWidth = 300;
        drawHeight = 300 / imgRatio;
      }

      drawWidth *= zoom;
      drawHeight *= zoom;

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      const finalUrl = canvas.toDataURL("image/jpeg", 0.92);
      updateData({
        basicDetails: {
          ...data.basicDetails,
          avatarUrl: finalUrl
        }
      });
      setIsCropperOpen(false);
    };
  };

  const addEducation = () => {
    if (!eduInst || !eduDeg || !eduDept) return;
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: eduInst,
      degree: eduDeg,
      department: eduDept,
      startDate: eduStart || "2022",
      endDate: eduEnd || "Present",
      grade: eduGrade,
    };
    updateData({ educations: [...data.educations, newEdu] });
    setEduInst(""); setEduDeg(""); setEduDept(""); setEduStart(""); setEduEnd(""); setEduGrade("");
  };

  const deleteEducation = (id: string) => {
    updateData({ educations: data.educations.filter(e => e.id !== id) });
  };

  const addExperience = () => {
    if (!expComp || !expRole || !expDesc) return;
    const newExp: Experience = {
      id: Date.now().toString(),
      company: expComp,
      role: expRole,
      startDate: expStart || "2023",
      endDate: expIsCurrent ? "Present" : (expEnd || "Present"),
      isCurrent: expIsCurrent,
      location: expLocation,
      description: expDesc
    };
    updateData({ experiences: [...data.experiences, newExp] });
    setExpComp(""); setExpRole(""); setExpStart(""); setExpEnd(""); setExpIsCurrent(false); setExpLocation(""); setExpDesc("");
  };

  const deleteExperience = (id: string) => {
    updateData({ experiences: data.experiences.filter(e => e.id !== id) });
  };

  const addProject = () => {
    if (!projTitle || !projDesc) return;
    const newProj: Project = {
      id: Date.now().toString(),
      title: projTitle,
      description: projDesc,
      tags: projTags ? projTags.split(",").map(t => t.trim()) : ["Featured"],
      githubUrl: projRepo,
      liveUrl: projLive,
      imageTheme: projTheme
    };
    updateData({ projects: [...data.projects, newProj] });
    setProjTitle(""); setProjDesc(""); setProjTags(""); setProjRepo(""); setProjLive("");
  };

  const deleteProject = (id: string) => {
    updateData({ projects: data.projects.filter(p => p.id !== id) });
  };

  const addCertificate = () => {
    if (!certTitle || !certIssuer) return;
    const newCert: Certificate = {
      id: Date.now().toString(),
      title: certTitle,
      issuer: certIssuer,
      date: certDate || "2024",
      credentialUrl: certUrl
    };
    updateData({ certificates: [...data.certificates, newCert] });
    setCertTitle(""); setCertIssuer(""); setCertDate(""); setCertUrl("");
  };

  const deleteCertificate = (id: string) => {
    updateData({ certificates: data.certificates.filter(c => c.id !== id) });
  };

  const handleAddSkill = (skillText?: string) => {
    const textToUse = skillText || newSkill;
    if (!textToUse || data.skills.includes(textToUse)) return;
    updateData({ skills: [...data.skills, textToUse] });
    setNewSkill("");
  };

  const handleRemoveSkill = (skillText: string) => {
    updateData({ skills: data.skills.filter(s => s !== skillText) });
  };

  const handleCallAIBio = async () => {
    await onGenerateBio(bioContext);
    setBioContext("");
    setShowBioPrompt(false);
  };

  return (
    <div id={`step-form-view-${currentStep}`} className="space-y-6">
      {/* Title block */}
      <div className="border-b border-stone-200 pb-4">
        {currentStep === 1 && <h2 className="text-xl font-extrabold text-stone-900">Step 1: Tell Us About Yourself</h2>}
        {currentStep === 2 && <h2 className="text-xl font-extrabold text-stone-900">Step 2: Scholastic Background</h2>}
        {currentStep === 3 && <h2 className="text-xl font-extrabold text-stone-900">Step 3: Core Competencies and Skills</h2>}
        {currentStep === 4 && <h2 className="text-xl font-extrabold text-stone-900">Step 4: Professional Milestones</h2>}
        {currentStep === 5 && <h2 className="text-xl font-extrabold text-stone-900">Step 5: Masterpieces & Badges</h2>}
        {currentStep === 6 && <h2 className="text-xl font-extrabold text-stone-900">Step 6: Digital Connections</h2>}
        {currentStep === 7 && <h2 className="text-xl font-extrabold text-stone-900">Step 7: Pick Your Identity Template</h2>}
        {currentStep === 8 && <h2 className="text-xl font-extrabold text-stone-900">Step 8: Publish & Share Studio</h2>}
        <p className="text-xs text-[#5F6368] font-medium mt-1">Configure your content correctly to feed the responsive website engine.</p>
      </div>

      {/* --- STEP 1: BASIC DETAILS --- */}
      {currentStep === 1 && (
        <div className="space-y-5">
          {/* Avatar Upload block */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <label className="text-xs font-bold font-mono text-stone-500 uppercase block mb-3">Profile Portrait</label>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                {data.basicDetails.avatarUrl ? (
                  <img src={data.basicDetails.avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-amber-400 shadow-[0_0_15px_rgba(244,180,0,0.4)]" referrerPolicy="no-referrer" />
                ) : (
                  <motion.div 
                    animate={{ boxShadow: ["0 0 0 0px rgba(244, 180, 0, 0.2)", "0 0 0 6px rgba(244, 180, 0, 0)", "0 0 0 0px rgba(244, 180, 0, 0.2)"] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-full bg-zinc-900 border border-stone-800 flex items-center justify-center text-stone-400 relative overflow-hidden"
                  >
                    <motion.div 
                      animate={{ opacity: [0.15, 0.4, 0.15] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-tr from-[#F4B400]/25 to-amber-600/10 rounded-full" 
                    />
                    <svg className="w-12 h-12 text-stone-600 absolute bottom-0 translate-y-[2px]" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4.5" />
                      <path d="M12 14c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
                    </svg>
                  </motion.div>
                )}
                <label className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center cursor-pointer text-white">
                  <Camera className="w-5 h-5" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>

              <div className="flex-1 space-y-3.5 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {data.basicDetails.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleEditCurrentPhoto}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-850 text-white border border-stone-800 text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#F4B400]" />
                      ✏️ Edit Photo (Zoom / Position / Tilt)
                    </button>
                  )}
                  <label className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200/80 text-stone-855 border border-stone-200 text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer">
                    <Camera className="w-3.5 h-3.5 text-stone-500" />
                    Upload Custom Photo...
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold font-mono text-stone-500 uppercase block mb-1">Full Name</label>
              <input
                id="input-full-name"
                type="text"
                value={data.basicDetails.fullName}
                onChange={(e) => updateData({ basicDetails: { ...data.basicDetails, fullName: e.target.value } })}
                placeholder="Jane Doe"
                className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm focus:border-[#F4B400] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold font-mono text-stone-500 uppercase block mb-1">Impact Tagline</label>
              <input
                id="input-tagline"
                type="text"
                value={data.basicDetails.tagline}
                onChange={(e) => updateData({ basicDetails: { ...data.basicDetails, tagline: e.target.value } })}
                placeholder="Full Stack Developer & CS Club Lead"
                className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm focus:border-[#F4B400] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold font-mono text-stone-500 uppercase block mb-1">Email Coordinates</label>
              <input
                id="input-email"
                type="email"
                value={data.basicDetails.email}
                onChange={(e) => updateData({ basicDetails: { ...data.basicDetails, email: e.target.value } })}
                placeholder="jane.doe@university.edu"
                className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm focus:border-[#F4B400] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold font-mono text-stone-500 uppercase block mb-1">Contact Phone</label>
              <input
                id="input-phone"
                type="text"
                value={data.basicDetails.phone}
                onChange={(e) => updateData({ basicDetails: { ...data.basicDetails, phone: e.target.value } })}
                placeholder="+1 (555) 019-2834"
                className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm focus:border-[#F4B400] outline-none transition-colors"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold font-mono text-stone-500 uppercase block mb-1">Geographical Location</label>
              <input
                id="input-location"
                type="text"
                value={data.basicDetails.location}
                onChange={(e) => updateData({ basicDetails: { ...data.basicDetails, location: e.target.value } })}
                placeholder="San Francisco, California"
                className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm focus:border-[#F4B400] outline-none transition-colors"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold font-mono text-stone-500 uppercase block mb-1">Languages Known</label>
              <input
                id="input-languages"
                type="text"
                value={data.basicDetails.languages || ""}
                onChange={(e) => updateData({ basicDetails: { ...data.basicDetails, languages: e.target.value } })}
                placeholder="e.g. English, Tamil, Spanish, German (separated by commas)"
                className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm focus:border-[#F4B400] outline-none transition-colors"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold font-mono text-stone-500 uppercase block mb-1">Short Portfolio Executive Summary</label>
              <textarea
                id="input-summary"
                value={data.basicDetails.summary || ""}
                onChange={(e) => updateData({ basicDetails: { ...data.basicDetails, summary: e.target.value } })}
                placeholder="e.g. Passionate software developer specializing in scalable frontend architectures and modern visual designs."
                rows={2}
                className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm focus:border-[#F4B400] outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* Biography Block with AI Bio Generator */}
          <div className="bg-[#FFFDF7] rounded-2xl border-2 border-[#F4B400]/40 p-5 space-y-3 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-[#F4B400]/5 rounded-bl-full"></div>
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold font-mono text-stone-600 uppercase">Self Biography</label>
              <button
                id="btn-trigger-ai-bio"
                onClick={() => setShowBioPrompt(!showBioPrompt)}
                className="flex items-center gap-1.5 text-xs font-extrabold bg-stone-900 hover:bg-stone-800 text-white rounded-lg px-3 py-1.5 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F4B400] fill-[#F4B400]" />
                <span>AI Bio Creator</span>
              </button>
            </div>

            {/* AI Custom guidelines box */}
            {showBioPrompt && (
              <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3 shadow-md animate-in fade-in zoom-in-95 duration-150">
                <p className="text-xs font-bold text-stone-800">Add any creative guidance or custom style for your biography (e.g. "Focus on tutoring and math, write in a very professional teacher tone"):</p>
                <input 
                  id="input-ai-prompt-guidelines"
                  type="text"
                  value={bioContext}
                  onChange={(e) => setBioContext(e.target.value)}
                  placeholder="Creative focus, light-hearted tone..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#F4B400]"
                />
                <div className="flex gap-2 justify-end">
                  <button 
                    id="btn-cancel-ai-bio"
                    onClick={() => setShowBioPrompt(false)} 
                    className="text-xs font-bold text-[#5F6368] bg-stone-100 hover:bg-stone-250 py-1.5 px-3 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-submit-ai-bio"
                    onClick={handleCallAIBio}
                    disabled={isGeneratingBio}
                    className="text-xs font-extrabold text-stone-900 bg-[#F4B400] hover:bg-[#F4B400]/90 py-1.5 px-4 rounded-lg flex items-center gap-1 disabled:opacity-50"
                  >
                    {isGeneratingBio ? "Crafting Bio..." : "Write Bio Now 🚀"}
                  </button>
                </div>
              </div>
            )}

            <textarea
              id="input-about-me"
              value={data.basicDetails.aboutMe}
              onChange={(e) => updateData({ basicDetails: { ...data.basicDetails, aboutMe: e.target.value } })}
              placeholder="Hi, I am Jane! Share professional backgrounds, student groups, interests and future aspirations. Alternatively, tap 'AI Bio Creator' to write a glorious version instantly."
              rows={5}
              className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm focus:border-[#F4B400] outline-none transition-colors resize-y"
            />
          </div>
        </div>
      )}

      {/* --- STEP 2: EDUCATION --- */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Current Schools Cards */}
          <div className="space-y-3">
            <label className="text-xs font-bold font-mono text-stone-500 uppercase block">Registered Schools</label>
            {data.educations.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-stone-200 bg-stone-50 rounded-2xl text-[#5F6368] text-xs font-medium">
                No scholastic history recorded yet. Register one below.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.educations.map((edu) => (
                  <div key={edu.id} className="bg-white border border-stone-200 rounded-2xl p-4 flex justify-between items-start shadow-xs">
                    <div>
                      <h4 className="font-extrabold text-[#5F6368] text-xs font-mono">{edu.startDate} – {edu.endDate}</h4>
                      <h3 className="font-bold text-stone-900 text-sm">{edu.degree} in {edu.department}</h3>
                      <p className="text-xs text-stone-500 font-medium">{edu.institution}</p>
                      {edu.grade && <span className="text-[10px] bg-stone-100 text-[#5F6368] font-bold px-1.5 py-0.5 rounded font-mono block mt-1 w-max">GPA / Percentage: {edu.grade}</span>}
                    </div>
                    <button
                      id={`delete-edu-btn-${edu.id}`}
                      onClick={() => deleteEducation(edu.id)}
                      className="p-1 px-2 border border-stone-100 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      title="Remove education"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Education Card Form */}
          <div className="bg-[#FFFDF7] border border-[#F4B400]/20 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-xs font-mono text-stone-600 uppercase flex items-center gap-1.5"><Plus className="w-4 h-4 text-[#F4B400]" /> Append Education Card</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
              <div>
                <label className="text-stone-550 block mb-1">School / College / University Name</label>
                <input type="text" value={eduInst} onChange={(e) => setEduInst(e.target.value)} placeholder="Stanford University or St. Paul's High School" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
              </div>
              <div>
                <label className="text-stone-550 block mb-1">Degree / Qualification</label>
                <input type="text" value={eduDeg} onChange={(e) => setEduDeg(e.target.value)} placeholder="Bachelor of Science or Grade XII / SSLC" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
              </div>
              <div>
                <label className="text-stone-550 block mb-1">Department / Course</label>
                <input type="text" value={eduDept} onChange={(e) => setEduDept(e.target.value)} placeholder="Computer Science or Pure Science / Biology" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
              </div>
              <div>
                <label className="text-stone-550 block mb-1">GPA / Percentage</label>
                <input type="text" value={eduGrade} onChange={(e) => setEduGrade(e.target.value)} placeholder="3.8 GPA or 95%" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
              </div>
              <div>
                <label className="text-stone-550 block mb-1">Start Year</label>
                <input type="text" value={eduStart} onChange={(e) => setEduStart(e.target.value)} placeholder="2021" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
              </div>
              <div>
                <label className="text-stone-550 block mb-1">Expected / Graduation Year</label>
                <input type="text" value={eduEnd} onChange={(e) => setEduEnd(e.target.value)} placeholder="2025" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
              </div>
            </div>
            <button
              id="btn-add-education-submit"
              onClick={addEducation}
              className="bg-stone-900 text-white font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-1 hover:bg-stone-850 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Scholastic Card
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 3: SKILLS --- */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <label className="text-xs font-bold font-mono text-stone-500 uppercase">My Professional Skills</label>
              
              <button
                id="btn-ai-suggest-skills"
                onClick={onGenerateSkills}
                disabled={isGeneratingSkills}
                className="flex items-center gap-1 text-xs font-extrabold text-stone-900 bg-amber-300 hover:bg-amber-400 border border-stone-900 rounded-lg px-3 py-1.5 shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 fill-stone-900 text-stone-900" />
                <span>{isGeneratingSkills ? "Analyzing profile..." : "Auto AI Skill Suggestions"}</span>
              </button>
            </div>

            {/* Display skill tags */}
            {data.skills.length === 0 ? (
              <p className="text-xs text-[#5F6368] font-medium text-center py-4 border border-dashed border-stone-100 rounded-xl bg-stone-50">
                You haven't listed any expertise yet. Use custom adding or click chips below.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 py-2 border-b border-stone-100">
                {data.skills.map((skill, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FFFDF7] border-2 border-stone-900 rounded-xl text-xs font-bold text-stone-900 shadow-[2px_2px_0px_rgba(24,24,27,1)]">
                    <span>{skill}</span>
                    <button id={`remove-skill-btn-${skill}`} onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500 font-extrabold ml-1 font-mono text-[10px]">×</button>
                  </span>
                ))}
              </div>
            )}

            {/* Manual ADD input */}
            <div className="flex gap-2 w-full max-w-full">
              <input 
                id="input-manual-skill"
                type="text" 
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Type skill tag (e.g. Next.js, Public Relations)..." 
                className="flex-1 min-w-0 bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs outline-none focus:border-[#F4B400] font-medium"
              />
              <button 
                id="btn-manual-skill-add" 
                onClick={() => handleAddSkill()} 
                className="bg-stone-900 text-white font-extrabold text-xs px-5 rounded-xl hover:bg-stone-850 shrink-0 cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Quick Skill Suggestions Block */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3">
            <h4 className="text-xs font-bold font-mono text-stone-505 uppercase">💡 Instant Suggestions (Tap to add)</h4>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-2">
              {SUGGESTED_SKILL_POOL.filter(s => !data.skills.includes(s)).map((sk, idx) => (
                <button
                  id={`skill-pool-chip-${idx}`}
                  key={idx}
                  onClick={() => handleAddSkill(sk)}
                  className="px-2.5 py-1 bg-white border border-stone-300 text-[#5F6368] hover:text-stone-900 hover:border-stone-900 text-xs font-bold rounded-lg transition-transform hover:scale-105"
                >
                  {sk}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- STEP 4: EXPERIENCE --- */}
      {currentStep === 4 && (
        <div className="space-y-6">
          {/* Fresher Option Checkbox Container */}
          <div className="bg-[#FFFDF7] border-l-4 border-amber-500 border-y border-r border-stone-200 rounded-r-2xl p-4 flex items-start gap-3.5 shadow-xs transition-colors hover:bg-stone-50/10">
            <div className="pt-0.5">
              <input 
                type="checkbox" 
                id="is-fresher-toggle" 
                checked={!!data.isFresher} 
                onChange={(e) => {
                  updateData({ isFresher: e.target.checked });
                }} 
                className="w-4.5 h-4.5 rounded text-[#F4B400] focus:ring-[#F4B400] border-stone-300 cursor-pointer" 
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="is-fresher-toggle" className="text-stone-900 font-extrabold text-xs uppercase tracking-wide cursor-pointer block select-none">I am a Fresher (No work experience yet)</label>
              <p className="text-[11px] text-[#5F6368] font-medium leading-relaxed select-none">
                If you are a student, recent graduate, or starting fresh in your field with no formal work/internship experience yet, check this box. It lets you skip directly to listing your projects and certificates.
              </p>
            </div>
          </div>

          {/* Current Experience Timeline display */}
          <div className="space-y-3">
            <label className="text-xs font-bold font-mono text-stone-500 uppercase block">Existing Timeline Cards</label>
            {data.experiences.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-stone-200 bg-stone-50 rounded-2xl text-[#5F6368] text-xs font-medium">
                No work log cards populated yet. Use the wizard below.
              </div>
            ) : (
              <div className="space-y-4">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="bg-white border-l-4 border-[#F4B400] border-y border-r border-stone-200 rounded-r-2xl p-4 flex justify-between items-start shadow-xs">
                    <div>
                      <h4 className="font-bold text-xs font-mono text-[#5F6368]">{exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}</h4>
                      <h3 className="font-extrabold text-stone-900 text-sm mt-0.5">{exp.role}</h3>
                      <p className="text-xs text-stone-500 font-bold">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                      <p className="text-xs text-[#5F6368] line-clamp-2 mt-2 leading-relaxed whitespace-pre-line font-medium">{exp.description}</p>
                    </div>
                    <button
                      id={`delete-exp-btn-${exp.id}`}
                      onClick={() => deleteExperience(exp.id)}
                      className="p-1 px-2 border border-stone-100 rounded-lg hover:bg-red-50 text-red-500 transition-colors ml-4"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form to add Experience details */}
          <div className="bg-[#FFFDF7] border border-[#F4B400]/20 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-xs font-mono text-stone-600 uppercase flex items-center gap-1.5"><Plus className="w-4 h-4 text-[#F4B400]" /> Log New Experience Card</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
              <div>
                <label className="text-stone-550 block mb-1">Company / Team Name</label>
                <input type="text" value={expComp} onChange={(e) => setExpComp(e.target.value)} placeholder="Acme Software Labs" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
              </div>
              <div>
                <label className="text-stone-550 block mb-1">Role / Job Title</label>
                <input type="text" value={expRole} onChange={(e) => setExpRole(e.target.value)} placeholder="Lead Frontend Engineer" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
              </div>
              <div>
                <label className="text-stone-550 block mb-1">Geographical Location</label>
                <input type="text" value={expLocation} onChange={(e) => setExpLocation(e.target.value)} placeholder="New York, NY (Remote)" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
              </div>
              <div className="flex items-center gap-3 pt-5">
                <input type="checkbox" id="curr-exp-check" checked={expIsCurrent} onChange={(e) => setExpIsCurrent(e.target.checked)} className="w-4.5 h-4.5 rounded text-[#F4B400] focus:ring-[#F4B400] border-stone-300" />
                <label htmlFor="curr-exp-check" className="text-stone-700 cursor-pointer">I currently work here</label>
              </div>
              <div>
                <label className="text-stone-550 block mb-1">Start Date</label>
                <input type="text" value={expStart} onChange={(e) => setExpStart(e.target.value)} placeholder="June 2023" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
              </div>
              {!expIsCurrent && (
                <div>
                  <label className="text-stone-550 block mb-1">End Date</label>
                  <input type="text" value={expEnd} onChange={(e) => setExpEnd(e.target.value)} placeholder="December 2024" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className="text-stone-550 block mb-1">Responsibilities / Key Achievements</label>
                <textarea rows={3} value={expDesc} onChange={(e) => setExpDesc(e.target.value)} placeholder="Briefly describe what you did, technologies used, and outcomes achieved." className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400] resize-y" />
              </div>
            </div>
            <button
              id="btn-add-experience-submit"
              onClick={addExperience}
              className="bg-stone-900 text-white font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-1 hover:bg-stone-850 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Append Milestone
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 5: PROJECTS & ACHIEVEMENTS --- */}
      {currentStep === 5 && (
        <div className="space-y-6">
          {/* Skip Option Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* No Projects Toggle */}
            <div className="bg-[#FFFDF7] border-l-4 border-amber-500 border-y border-r border-stone-200 rounded-r-2xl p-4 flex items-start gap-3 shadow-xs hover:bg-stone-50/10 transition-colors">
              <div className="pt-0.5">
                <input 
                  type="checkbox" 
                  id="has-no-projects-toggle" 
                  checked={!!data.hasNoProjects} 
                  onChange={(e) => {
                    updateData({ hasNoProjects: e.target.checked });
                  }} 
                  className="w-4.5 h-4.5 rounded text-[#F4B400] focus:ring-[#F4B400] border-stone-300 cursor-pointer" 
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="has-no-projects-toggle" className="text-stone-900 font-extrabold text-xs uppercase tracking-wide cursor-pointer block select-none">I have no projects yet</label>
                <p className="text-[10px] text-[#5F6368] font-medium leading-relaxed select-none">
                  Check this if you haven't completed any formal individual projects or masterpieces yet.
                </p>
              </div>
            </div>

            {/* No Certificates Toggle */}
            <div className="bg-[#FFFDF7] border-l-4 border-amber-500 border-y border-r border-stone-200 rounded-r-2xl p-4 flex items-start gap-3 shadow-xs hover:bg-stone-50/10 transition-colors">
              <div className="pt-0.5">
                <input 
                  type="checkbox" 
                  id="has-no-certs-toggle" 
                  checked={!!data.hasNoCertificates} 
                  onChange={(e) => {
                    updateData({ hasNoCertificates: e.target.checked });
                  }} 
                  className="w-4.5 h-4.5 rounded text-[#F4B400] focus:ring-[#F4B400] border-stone-300 cursor-pointer" 
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="has-no-certs-toggle" className="text-stone-900 font-extrabold text-xs uppercase tracking-wide cursor-pointer block select-none">I have no certificates yet</label>
                <p className="text-[10px] text-[#5F6368] font-medium leading-relaxed select-none">
                  Check this if you do not hold professional credentials, publication links, or awards yet.
                </p>
              </div>
            </div>
          </div>

          {/* Projects subsection */}
          {!data.hasNoProjects ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold font-mono text-stone-500 uppercase">My Masterpieces & Projects</label>
              </div>

              {data.projects.length === 0 ? (
                <p className="text-xs text-[#5F6368] font-medium text-center py-4 border border-dashed border-stone-200 bg-stone-50 rounded-2xl">No projects loaded below. Formulate one in the panel.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.projects.map((proj) => (
                    <div key={proj.id} className="bg-white border border-stone-200 rounded-2xl p-4 flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full bg-gradient-to-br ${proj.imageTheme}`}></span>
                          <h4 className="font-bold text-stone-900 text-sm truncate">{proj.title}</h4>
                        </div>
                        <p className="text-xs text-stone-500 line-clamp-2 mt-2 leading-relaxed font-medium">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {proj.tags.map((tg, i) => (
                            <span key={i} className="text-[9px] bg-stone-100 text-stone-500 border border-stone-200 px-1 py-0.5 rounded font-mono">{tg}</span>
                          ))}
                        </div>
                      </div>
                      <button id={`delete-proj-btn-${proj.id}`} onClick={() => deleteProject(proj.id)} className="p-1 px-2 text-red-500 bg-stone-50 rounded-lg ml-3">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Project addition form */}
              <div className="bg-[#FFFDF7] border-2 border-[#F4B400]/30 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-xs font-mono text-stone-600 uppercase flex items-center gap-1.5"><Laptop className="w-4 h-4 text-[#F4B400]" /> Design Project Box</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <label className="text-stone-550 block mb-1">Project Title</label>
                    <input type="text" value={projTitle} onChange={(e) => setProjTitle(e.target.value)} placeholder="Personal Finance Dashboard" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
                  </div>
                  <div>
                    <label className="text-stone-550 block mb-1">Code Repository (optional)</label>
                    <input type="text" value={projRepo} onChange={(e) => setProjRepo(e.target.value)} placeholder="github.com/janedoe/finance" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
                  </div>
                  <div>
                    <label className="text-stone-550 block mb-1">Tech Stack tags (comma separated)</label>
                    <input type="text" value={projTags} onChange={(e) => setProjTags(e.target.value)} placeholder="React, Tailwind, Node.js" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
                  </div>
                  <div>
                    <label className="text-stone-550 block mb-1">Live Site Link (optional)</label>
                    <input type="text" value={projLive} onChange={(e) => setProjLive(e.target.value)} placeholder="finance.janedoe.com" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-stone-550 block mb-1">Project visual theme / accent gradient</label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { theme: "from-amber-400 to-yellow-500", label: "Sunset Theme" },
                        { theme: "from-yellow-400 to-orange-500", label: "Warm Gold" },
                        { theme: "from-indigo-400 to-amber-300", label: "Creative Violet" },
                        { theme: "from-[#F4B400] to-emerald-500", label: "Yellow Emerald" },
                        { theme: "from-teal-400 to-[#F4B400]", label: "Golden Teal" }
                      ].map((thPreset, idx) => (
                        <button
                          id={`proj-theme-preset-btn-${idx}`}
                          key={idx}
                          onClick={() => setProjTheme(thPreset.theme)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold border-2 rounded-lg ${
                            projTheme === thPreset.theme ? "border-stone-900 bg-stone-100" : "border-stone-200 bg-white"
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${thPreset.theme}`}></span>
                          <span>{thPreset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-stone-550 block mb-1">Brief Description / Outcomes</label>
                    <textarea rows={3} value={projDesc} onChange={(e) => setProjDesc(e.target.value)} placeholder="Explain the dynamic problems you solved and the overall impact of your build." className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
                  </div>
                </div>
                <button onClick={addProject} className="bg-stone-900 text-white font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-1 hover:bg-stone-850">
                  <Plus className="w-3.5 h-3.5" /> Append Project Box
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-center text-xs text-stone-500 font-medium font-mono">
              🚫 Masterpieces & Projects Section Skipped
            </div>
          )}

          {/* Certifications and credentials list */}
          {!data.hasNoCertificates ? (
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <label className="text-xs font-bold font-mono text-stone-500 uppercase block">Existing Credentials / Certs</label>
              {data.certificates.length === 0 ? (
                <p className="text-xs text-[#5F6368] font-medium text-center py-4 border border-dashed border-stone-200 bg-stone-50 rounded-2xl">No certs loaded below. Register one in the panel.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.certificates.map((cert) => (
                    <div key={cert.id} className="bg-white border border-stone-200 rounded-2xl p-4 flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-stone-900 text-sm truncate">{cert.title}</h4>
                        <p className="text-xs text-stone-500 font-medium">{cert.issuer} • {cert.date}</p>
                      </div>
                      <button id={`delete-cert-btn-${cert.id}`} onClick={() => deleteCertificate(cert.id)} className="p-1 px-2 text-red-500 bg-stone-50 rounded-lg ml-3">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Cert additions form */}
              <div className="bg-[#FFFDF7] border border-stone-200 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-xs font-mono text-stone-600 uppercase flex items-center gap-1.5"><Award className="w-4 h-4 text-stone-600" /> Enter New Cert Card</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <label className="text-stone-550 block mb-1">Certification Title</label>
                    <input type="text" value={certTitle} onChange={(e) => setCertTitle(e.target.value)} placeholder="AWS Certified Solutions Architect" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
                  </div>
                  <div>
                    <label className="text-stone-550 block mb-1">Issuer Authority</label>
                    <input type="text" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} placeholder="Amazon Web Services" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
                  </div>
                  <div>
                    <label className="text-stone-550 block mb-1">Acquired Date (Year or Month)</label>
                    <input type="text" value={certDate} onChange={(e) => setCertDate(e.target.value)} placeholder="December 2024" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
                  </div>
                  <div>
                    <label className="text-stone-550 block mb-1">Credential URL Verification link (optional)</label>
                    <input type="text" value={certUrl} onChange={(e) => setCertUrl(e.target.value)} placeholder="credly.com/verify/aws" className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-medium outline-none focus:border-[#F4B400]" />
                  </div>
                </div>
                <button onClick={addCertificate} className="bg-stone-900 text-white font-extrabold text-[#FFFDF7] text-xs py-2 px-4 rounded-xl flex items-center gap-1 hover:bg-stone-850">
                  <Plus className="w-3.5 h-3.5" /> Append Credentials
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-center text-xs text-stone-500 font-medium font-mono mt-4">
              🚫 Credentials & Certs Section Skipped
            </div>
          )}
        </div>
      )}

      {/* --- STEP 6: SOCIAL LINKS --- */}
      {currentStep === 6 && (
        <div className="space-y-4">
          <p className="text-xs font-bold text-stone-600 block mb-2 font-mono">Connect your digital touchpoints to facilitate instant recruitment.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-1">
              <label className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5"><Linkedin className="w-4 h-4 text-[#0077B5]" /> LinkedIn Link</label>
              <input
                id="input-social-linkedin"
                type="text"
                value={data.socialLinks.linkedin || ""}
                onChange={(e) => updateData({ socialLinks: { ...data.socialLinks, linkedin: e.target.value } })}
                placeholder="linkedin.com/in/janedoe"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm focus:border-[#F4B400] outline-none transition-colors font-medium text-stone-800"
              />
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-1">
              <label className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5"><Github className="w-4 h-4 text-stone-900" /> GitHub Repo Link</label>
              <input
                id="input-social-github"
                type="text"
                value={data.socialLinks.github || ""}
                onChange={(e) => updateData({ socialLinks: { ...data.socialLinks, github: e.target.value } })}
                placeholder="github.com/janedoe"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm focus:border-[#F4B400] outline-none transition-colors font-medium text-stone-800"
              />
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-1">
              <label className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5"><Instagram className="w-4 h-4 text-[#E1306C]" /> Instagram Handle</label>
              <input
                id="input-social-instagram"
                type="text"
                value={data.socialLinks.instagram || ""}
                onChange={(e) => updateData({ socialLinks: { ...data.socialLinks, instagram: e.target.value } })}
                placeholder="instagram.com/janedoe"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm focus:border-[#F4B400] outline-none transition-colors font-medium text-stone-800"
              />
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-1">
              <label className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5"><Globe className="w-4 h-4 text-stone-700" /> Personal Website</label>
              <input
                id="input-social-website"
                type="text"
                value={data.socialLinks.website || ""}
                onChange={(e) => updateData({ socialLinks: { ...data.socialLinks, website: e.target.value } })}
                placeholder="janedoe.me"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm focus:border-[#F4B400] outline-none transition-colors font-medium text-stone-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- STEP 7: TEMPLATE SELECTION --- */}
      {currentStep === 7 && (
        <div className="space-y-6">
          {/* AI theme creator box */}
          <div className="bg-[#FFFDF7] border-2 border-[#F4B400]/30 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#F4B400] text-stone-950 rounded-lg">
                <Sparkles className="w-4 h-4 fill-stone-950" />
              </span>
              <div>
                <h4 className="font-extrabold text-stone-900 text-sm">AI Dream Theme Generator</h4>
                <p className="text-[11px] text-[#5F6368] font-semibold mb-0 leading-tight">Describe any color vibe, layout vibe, or styling theme, and Gemini will build it for you!</p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                id="ai-template-prompt-input"
                type="text"
                value={tmplPrompt}
                onChange={(e) => setTmplPrompt(e.target.value)}
                placeholder="e.g., Cyberpunk purple glow, Earthy Forest green, Sunset crimson Warm, Cotton Candy cute pink..."
                className="flex-1 bg-white border border-stone-200 rounded-xl p-3 text-xs focus:border-[#F4B400] outline-none transition-colors font-medium text-stone-800"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tmplPrompt && onGenerateTemplate) {
                    onGenerateTemplate(tmplPrompt);
                  }
                }}
              />
              <button
                id="btn-generate-custom-theme"
                type="button"
                disabled={isGeneratingTemplate || !tmplPrompt}
                onClick={() => onGenerateTemplate && onGenerateTemplate(tmplPrompt)}
                className="bg-stone-900 text-white font-extrabold text-xs px-4 rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
              >
                {isGeneratingTemplate ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 fill-white" />
                    Generate Theme
                  </>
                )}
              </button>
            </div>

            {/* Suggested prompts tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                "Glass Neon Cyberpunk",
                "Forest Green Scholar",
                "Sunset Crimson Warm",
                "Cute Pastel Pink",
                "Brutalist Green Code Matrix",
                "Minimal Lavender"
              ].map((tag, i) => (
                <button
                  key={i}
                  id={`suggested-theme-tag-${i}`}
                  type="button"
                  onClick={() => setTmplPrompt(tag)}
                  className="text-[9px] font-mono font-bold bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-400 text-stone-600 px-2.5 py-1 rounded-md transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Section header */}
          <div className="space-y-1">
            <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">Select Theme Palette ({data.aiTemplateConfig ? "9" : "8"} available)</h4>
            <p className="text-xs text-stone-500 font-semibold font-mono">Choose a visual preset or stick with your custom-generated AI styling below.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-sans">
            {/* If AI custom theme exists, render it as option 1! */}
            {data.aiTemplateConfig && (
              <button
                id="template-card-selector-custom-ai"
                type="button"
                onClick={() => updateData({ template: "custom-ai" })}
                className={`col-span-1 sm:col-span-2 md:col-span-3 flex items-center justify-between text-left p-4 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                  data.template === "custom-ai" ? "border-amber-500 bg-amber-50/20 ring-4 ring-amber-400/25" : "border-stone-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="p-3 bg-amber-500/15 text-amber-600 border border-amber-500/20 rounded-xl">
                    <Sparkles className="w-5 h-5 fill-amber-500 animate-pulse" />
                  </span>
                  <div>
                    <div className="text-[10px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded border inline-block bg-amber-500/10 text-amber-800 border-amber-300">
                      ✨ {data.aiTemplateConfig.themeName || "Custom AI Theme"}
                    </div>
                    <p className="text-xs text-[#5F6368] font-semibold mt-1">
                      Active Style: {data.aiTemplateConfig.fontFamily} Font • {data.aiTemplateConfig.layoutStyle} Layout • Hex {data.aiTemplateConfig.accentColor}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-stone-850 flex items-center gap-1 shrink-0">
                  {data.template === "custom-ai" ? "✓ SELECTED CUSTOM" : "SELECT CUSTOM"}
                </span>
              </button>
            )}

            {[
              { id: "minimal", title: "Minimal", desc: "Ultra clean, airy layout focusing on elegant space, layout grids, and fine fonts.", color: "bg-stone-100 text-stone-900 border-stone-300" },
              { id: "modern-yellow", title: "Modern Yellow", desc: "Tech SaaS aesthetic with crisp typography, bright gold nodes, and card grids.", color: "bg-[#F4B400]/10 text-stone-950 border-[#F4B400]" },
              { id: "dark-elegant", title: "Dark Elegant", desc: "Premium obsidian black palette with glowing golden accents and sleek glass boxes.", color: "bg-zinc-900 text-zinc-100 border-zinc-700" },
              { id: "creative-student", title: "Creative Student", desc: "Playful student layout, grid offsets, colorful gradients and comic shadows.", color: "bg-yellow-50 text-stone-900 border-amber-300 shadow-[2px_2px_0px_rgba(0,0,0,1)]" },
              { id: "teacher-professional", title: "Teacher Pro", desc: "Scholarly, split timeline resume focusing on certifications, academies, and logs.", color: "bg-[#FFFDF7] text-stone-950 border-stone-800" },
              { id: "glassmorphism-elite", title: "Glass Elite", desc: "👑 Ultra Premium: Frosted glass on creamy backdrops. Apple-inspired frosted transparency & glowing nodes.", color: "bg-cyan-50/50 text-cyan-950 border-cyan-400" },
              { id: "bento-grid-creator", title: "Bento Creator", desc: "👑 Ultra Premium: Multi-dimensional grid layout, trendy Gen Z style badges, interactive bento pods.", color: "bg-sky-50 text-sky-950 border-sky-400" },
              { id: "luxury-dark-gold", title: "Luxury Dark Gold", desc: "👑 Ultra Premium: Rich cinematic black theme detailed with fine gold highlights and sleek slots.", color: "bg-stone-950 text-[#F4B400] border-amber-500 font-serif" },
              { id: "ghibli-cozy", title: "Studio Ghibli Cozy", desc: "🍁 Nostalgic masterpiece setting: Wooden desk, warm lamp mode, hot steaming tea, and golden hour windows.", color: "bg-[#FCF8F2] text-[#8C6239] border-amber-600 font-serif" },
            ].map((tmpl) => (
              <button
                id={`template-card-selector-${tmpl.id}`}
                key={tmpl.id}
                type="button"
                onClick={() => updateData({ template: tmpl.id as any })}
                className={`flex flex-col justify-between text-left p-4 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-md h-44 ${
                  data.template === tmpl.id ? "border-[#F4B400] bg-[#FFFDF7] ring-4 ring-[#F4B400]/20" : "border-stone-200 bg-white"
                }`}
              >
                <div>
                  <div className={`text-[10px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded border inline-block ${tmpl.color}`}>
                    {tmpl.title}
                  </div>
                  <p className="text-xs text-[#5F6368] font-medium mt-3 leading-relaxed">
                    {tmpl.desc}
                  </p>
                </div>
                
                <span className="text-[11px] font-bold text-stone-850 mt-auto flex items-center gap-1">
                  {data.template === tmpl.id ? "✓ SELECTED" : "SELECT TEMPLATE"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- STEP 8: PUBLISH & SHARE --- */}
      {currentStep === 8 && (
        <div className="space-y-6">
          <div className="bg-[#FFFDF7] border-2 border-[#F4B400]/30 rounded-3xl p-6 text-center space-y-4">
            <span className="w-14 h-14 bg-[#F4B400]/10 rounded-full flex items-center justify-center mx-auto text-stone-950 border-2 border-[#F4B400]">
              <Sparkles className="w-7 h-7 text-[#F4B400] fill-[#F4B400]" />
            </span>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-stone-900 font-display">Your Portfolio is Compiled!</h3>
              <p className="text-xs text-[#5F6368] font-medium max-w-md mx-auto leading-relaxed">
                Your professional digital CV is now fully formatted and ready. Grab the share link containing your data payload, or compile a direct offline PDF paper copy.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Share link card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] bg-[#F4B400]/10 text-stone-950 border border-[#F4B400]/30 font-mono font-bold px-2.5 py-0.5 rounded inline-block uppercase tracking-wider">
                  Live URL
                </span>
                <h4 className="font-extrabold text-stone-900 text-sm leading-snug">Public Share Link</h4>
                <p className="text-[11px] text-[#5F6368] leading-relaxed font-semibold">
                  This serverless, privacy-friendly URL links directly to your dynamic CV profile so anyone, including recruiters, can view it beautifully. No registration or database record required!
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <input
                  id="publish-share-input"
                  type="text"
                  readOnly
                  value={`${window.location.origin}/#view=${btoa(unescape(encodeURIComponent(JSON.stringify(data))))}`}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-[10px] font-mono text-stone-500 outline-none select-all"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                
                <p className="text-[10px] text-emerald-600 font-medium">
                  💡 Tip: This link encapsulates your entire design configuration and data payload securely within the link itself. It works anywhere instantly!
                </p>

                <button
                  id="btn-publish-share"
                  onClick={onShareLink}
                  disabled={isSharing}
                  className="w-full relative group overflow-hidden bg-stone-900 hover:bg-stone-950 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_#F4B400] border-2 border-stone-900 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#F4B400] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#F4B400] disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Globe className="w-4 h-4 text-[#F4B400] group-hover:rotate-12 transition-transform duration-300" />
                  <span className="tracking-wide uppercase font-mono font-bold">
                    {isSharing 
                      ? "Copying..." 
                      : "🔗 Copy Link"
                    }
                  </span>
                </button>
              </div>
            </div>

            {/* Direct PDF export card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] bg-stone-100 text-[#5F6368] border border-stone-300 font-mono font-bold px-2.5 py-0.5 rounded inline-block uppercase tracking-wider">
                  Offline Paper / PDF
                </span>
                <h4 className="font-extrabold text-stone-900 text-sm leading-snug">PDF Document Download</h4>
                <p className="text-[11px] text-[#5F6368] leading-relaxed font-semibold">
                  Generates an offline downloadable PDF copy of your active theme matching strict format grids. High quality vector graphics wrapper.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  id="btn-publish-pdf"
                  onClick={onDownloadPDF}
                  disabled={isExportingPDF}
                  className="w-full relative group overflow-hidden bg-gradient-to-r from-[#F4B400] to-yellow-400 hover:from-yellow-450 hover:to-amber-500 text-stone-950 font-black py-4 px-4 rounded-2xl text-xs flex items-center justify-center gap-2.5 transition-all shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] border-2 border-[#18181B] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] disabled:opacity-50 disabled:pointer-events-none"
                >
                  <FileText className="w-4 h-4 text-stone-950 stroke-[2.5] group-hover:scale-110 transition-transform duration-300" />
                  <span className="tracking-wide uppercase font-mono font-bold">{isExportingPDF ? "Downloading..." : "⚡ Download PDF"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- STEP NAVIGATION CONTROLS --- */}
      <div className="flex justify-between items-center pt-6 border-t border-stone-200 mt-8">
        <motion.button
          id="btn-nav-prev"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          disabled={currentStep === 1}
          className="flex items-center gap-1 px-4 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-700 hover:text-stone-950 rounded-xl text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </motion.button>

        {currentStep < 8 ? (
          <motion.button
            id="btn-nav-next"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="flex items-center gap-1 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-[#FFFDF7] rounded-xl text-xs font-extrabold shadow-sm hover:shadow cursor-pointer"
          >
            Save & Continue <ArrowRight className="w-4 h-4" />
          </motion.button>
        ) : null}
      </div>

      {/* --- PHOTO CROPPER, ALIGNMENT & TILT MODAL --- */}
      {isCropperOpen && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-stone-900 max-w-md w-full p-6 sm:p-8 shadow-[8px_8px_0px_rgba(24,24,27,1)] space-y-6 animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-stone-900 text-lg leading-snug">Adjust Portrait Placement</h3>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">Zoom, shift, and tilt to frame beautifully</p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsCropperOpen(false)} 
                className="p-1.5 bg-stone-50 hover:bg-stone-100 rounded-full border border-stone-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-stone-600" />
              </button>
            </div>

            {/* Live Round Crop Mask Frame Indicator */}
            <div className="flex justify-center items-center py-4 bg-stone-50 rounded-2xl border border-stone-150 relative">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-[#F4B400] bg-stone-200 flex items-center justify-center shadow-inner">
                <img
                  src={tempImageUrl}
                  alt="cropper preview"
                  className="max-w-none origin-center pointer-events-none select-none transition-transform duration-75"
                  onLoad={(e) => {
                    const target = e.currentTarget;
                    setImgIsLandscape(target.naturalWidth > target.naturalHeight);
                  }}
                  style={{
                    width: imgIsLandscape ? "auto" : "100%",
                    height: imgIsLandscape ? "100%" : "auto",
                    transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: "center center"
                  }}
                />
                
                {/* Visual crop lines center indicator overlay */}
                <div className="absolute inset-0 border border-dashed border-white/20 rounded-full pointer-events-none"></div>
                <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-white/15 pointer-events-none -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-white/15 pointer-events-none -translate-y-1/2"></div>
              </div>
            </div>

            {/* Sliders panel */}
            <div className="space-y-4">
              {/* Zoom slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold font-mono uppercase text-stone-500">
                  <span className="flex items-center gap-1.5"><SlidersHorizontal className="w-3.5 h-3.5" /> Photo Zoom / Size</span>
                  <span className="text-stone-900 bg-stone-100 px-2 py-0.5 rounded text-[10px]">{zoom.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-[#F4B400] h-1.5 bg-stone-150 rounded-lg cursor-pointer"
                />
              </div>

              {/* Translation Sliders: Horizontal X & Vertical Y */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold font-mono uppercase text-stone-500">
                    <span className="flex items-center gap-1.5"><Move className="w-3.5 h-3.5" /> Shift Left/Right</span>
                    <span className="text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded text-[9px]">{offsetX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={offsetX}
                    onChange={(e) => setOffsetX(parseInt(e.target.value))}
                    className="w-full accent-stone-700 h-1.5 bg-stone-150 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold font-mono uppercase text-stone-500">
                    <span className="flex items-center gap-1.5"><Move className="w-3.5 h-3.5" /> Shift Up/Down</span>
                    <span className="text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded text-[9px]">{offsetY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={offsetY}
                    onChange={(e) => setOffsetY(parseInt(e.target.value))}
                    className="w-full accent-stone-700 h-1.5 bg-stone-150 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Rotation / Tilt slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold font-mono uppercase text-stone-500">
                  <span className="flex items-center gap-1.5"><RotateCw className="w-3.5 h-3.5" /> Rotation / Tilt</span>
                  <span className="text-stone-900 bg-stone-100 px-2 py-0.5 rounded text-[10px]">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-[#F4B400] h-1.5 bg-stone-150 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Controls actions footer */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setZoom(1.0);
                  setRotation(0);
                  setOffsetX(0);
                  setOffsetY(0);
                }}
                className="w-1/3 py-2.5 bg-stone-100 hover:bg-stone-200/80 border border-stone-250 text-stone-700 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1 font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
              <button
                type="button"
                onClick={cropImage}
                className="flex-1 py-2.5 bg-[#F4B400] hover:bg-yellow-500 text-stone-950 font-black rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md align-middle"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Apply & Crop Photo
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
