import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PortfolioData, StepInfo, TemplateType } from "./types";
import { SidebarSteps } from "./components/SidebarSteps";
import { StepForm } from "./components/StepForm";
import { PortfolioTemplates } from "./components/PortfolioTemplates";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { 
  Sparkles, Award, ArrowUpRight, Share2, Eye, Laptop, Smartphone, Monitor,
  Copy, FileText, ChevronRight, CheckCircle2, ChevronLeft, RefreshCw, Layers, Check, Globe, Star, LogOut,
  Trash2, AlertTriangle
} from "lucide-react";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { AuthScreen } from "./components/AuthScreen";
import { AdminDashboard } from "./components/AdminDashboard";
import { FeedbackModal } from "./components/FeedbackModal";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { SecurityModal } from "./components/SecurityModal";
import { LoadingScreen } from "./components/LoadingScreen";
import { AboutPage } from "./components/AboutPage";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp 
} from "firebase/firestore";


// Pre-populated high quality mock state for premium feel out-of-the-box
const INITIAL_PORTFOLIO: PortfolioData = {
  basicDetails: {
    fullName: "Alex Mercer",
    tagline: "Full-Stack Engineer & Interaction Designer",
    email: "alex.mercer@dev.io",
    phone: "+1 (415) 345-6712",
    location: "San Francisco, CA",
    aboutMe: "Hi, I am Alex! I build high-performance web tools and aesthetic interfaces. Currently studying Computer Science at Stanford and collaborating with innovative product studios.\n\nMy masterworks focus on bridging user-centric design with highly scalable backend code. I love tutoring first-year coding student clubs and hacking with Raspberry Pis. Let's build!",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    languages: "English, Tamil, Spanish",
    summary: "Passionate computer science student and interface designer focused on building scalable, user-centric web platforms."
  },
  educations: [
    {
      id: "edu-1",
      institution: "Stanford University",
      degree: "Bachelor of Science",
      department: "Computer Science (HCI)",
      startDate: "2022",
      endDate: "2026",
      grade: "3.9 GPA"
    }
  ],
  skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "Figma", "UI/UX Design", "Git & GitHub", "SQL"],
  experiences: [
    {
      id: "exp-1",
      company: "Linear Inc",
      role: "Front-end Developer Intern",
      startDate: "June 2024",
      endDate: "Present",
      isCurrent: true,
      location: "Remote",
      description: "Pioneered desktop atomic style integration.\nOptimized client-side loading speeds by 30% using lazy routes."
    },
    {
      id: "exp-2",
      company: "CS Academy",
      role: "Algorithms Section Tutor",
      startDate: "Sept 2023",
      endDate: "May 2024",
      isCurrent: false,
      location: "On-campus",
      description: "Mentored 40+ freshman student coders in core Python paradigms, discrete mathematics, and recursive structures."
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Fintech CashFlow Tracker",
      description: "Sleek dark analytics aggregator with bento dashboards and dynamic micro-charts.",
      tags: ["React", "Tailwind CSS", "Recharts"],
      githubUrl: "github.com/alexmercer/fintech",
      liveUrl: "fintech.alexmercer.io",
      imageTheme: "from-amber-400 to-yellow-500"
    },
    {
      id: "proj-2",
      title: "Canvas Physics Draw",
      description: "Interactive browser physics canvas featuring organic geometric shapes with spring physics.",
      tags: ["TypeScript", "HTML5 Canvas"],
      githubUrl: "github.com/alexmercer/canvas",
      liveUrl: "canvas.alexmercer.io",
      imageTheme: "from-indigo-400 to-amber-300"
    }
  ],
  certificates: [
    {
      id: "cert-1",
      title: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "Oct 2024",
      credentialUrl: "credly.com/verify/aws"
    }
  ],
  socialLinks: {
    github: "github.com/alexmercer",
    linkedin: "linkedin.com/in/alexmercer",
    website: "alexmercer.dev"
  },
  template: "modern-yellow"
};

const EMPTY_PORTFOLIO: PortfolioData = {
  basicDetails: {
    fullName: "",
    tagline: "",
    email: "",
    phone: "",
    location: "",
    aboutMe: "",
    avatarUrl: "",
    languages: "",
    summary: ""
  },
  educations: [],
  skills: [],
  experiences: [],
  projects: [],
  certificates: [],
  socialLinks: {
    github: "",
    linkedin: "",
    website: ""
  },
  template: "modern-yellow"
};

interface AppFeedback {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  date: string;
}

const DEFAULT_FEEDBACKS: AppFeedback[] = [
  { 
    id: "fb-1", 
    name: "Kamal", 
    role: "Software Engineer Intern", 
    text: "As a beginner developer, formatting custom web styles took me forever. FolioCraft took less than 4 minutes, and I managed to export a clean PDF instantly for my resume requirements. Highly recommended!", 
    rating: 5, 
    date: "02/05/2026" 
  },
  { 
    id: "fb-2", 
    name: "Dr. Eleanor Vance", 
    role: "Adjunct Professor", 
    text: "The Teacher/Scholar template is amazing! It perfectly bridges the gap between academic research papers and general outreach. Easy, styled, and incredibly fast.", 
    rating: 5, 
    date: "24/04/2026" 
  },
  { 
    id: "fb-3", 
    name: "Samantha Ross", 
    role: "UI/UX Designer", 
    text: "The Bento-grid structure and glassmorphism templates look extremely premium and polished. My recruiters asked where I coded my online CV. Keep up the amazing work!", 
    rating: 5, 
    date: "12/05/2026" 
  }
];

const animContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const animItem = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

const WIZARD_STEPS: StepInfo[] = [
  { id: 1, name: "Bio Details", title: "Basic Details", description: "Let recruiters know who you are and where to reach you." },
  { id: 2, name: "Education", title: "Scholastic Studies", description: "Log your colleges, schools, or formal degrees." },
  { id: 3, name: "Skills", title: "Competencies", description: "Mention tools, technologies, or subjects you teach." },
  { id: 4, name: "Experiences", title: "Experiences timeline", description: "List past internships, full-time appointments, or tutoring roles." },
  { id: 5, name: "Artifacts", title: "Projects & Certificates", description: "Display your real-world outcomes and credentials." },
  { id: 6, name: "Socials", title: "Contact Links", description: "Provide LinkedIn, GitHub, or Instagram links." },
  { id: 7, name: "Templates", title: "Layout Selection", description: "Choose a visual style to package your profile." },
  { id: 8, name: "Publish", title: "Final Preview & PDF", description: "Examine your live site, export PDFs, and grab custom anchors." },
];

const topRowTemplates = [
  { id: "minimal", label: "Minimal White", design: "font-serif" },
  { id: "modern-yellow", label: "Modern Yellow Saas", design: "font-sans border-[#F4B400]" },
  { id: "dark-elegant", label: "Dark Elegant Gold", design: "bg-zinc-900 text-amber-400/90" },
  { id: "creative-student", label: "Creative Student Grid", design: "shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-amber-100/10" },
];

const bottomRowTemplates = [
  { id: "teacher-professional", label: "Teacher / Scholar CV", design: "border-stone-800" },
  { id: "glassmorphism-elite", label: "Glassmorphism Elite", design: "border-cyan-500/20 bg-cyan-950/20 text-cyan-200" },
  { id: "bento-grid-creator", label: "Bento Grid Creator", design: "border-sky-500/20 bg-sky-950/20 text-sky-200" },
  { id: "luxury-dark-gold", label: "Luxury Dark Gold", design: "border-amber-500/40 bg-stone-950 text-[#F4B400] font-serif" },
  { id: "ghibli-cozy", label: "Studio Ghibli Cozy", design: "border-amber-600 bg-[#FCF8F2] text-[#8C6239] font-serif" }
];

const getTagAnimationVariants = (row: "top" | "bottom", tmplId: string) => {
  const tmplCoords: Record<string, [number, number]> = {
    "minimal": [0, 0],
    "modern-yellow": [0, 1],
    "dark-elegant": [0, 2],
    "creative-student": [0, 3],
    "teacher-professional": [1, 0],
    "glassmorphism-elite": [1, 1],
    "bento-grid-creator": [1, 2],
    "luxury-dark-gold": [1, 3],
    "ghibli-cozy": [1, 4]
  };

  const targetCoord = tmplCoords[tmplId] || [0, 1];
  const centerCoord = [0, 1]; // "Modern Yellow Saas" center active button coordinates
  const distance = Math.abs(targetCoord[0] - centerCoord[0]) + Math.abs(targetCoord[1] - centerCoord[1]);
  const delay = 0.15 * distance;

  return {
    hidden: {
      opacity: 0,
      y: row === "top" ? -21 : 21
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.5,
        ease: [0.25, 1, 0.5, 1],
        delay: delay
      }
    }
  };
};

export default function App() {
  const [viewMode, setViewMode] = useState<"landing" | "about" | "builder" | "view-only" | "auth" | "admin">("landing");
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && !currentUser.emailVerified) {
        // Bypass email verification check for Google Sign-In users
        const isGoogleUser = currentUser.providerData?.some(
          (p) => p.providerId === "google.com"
        );
        if (isGoogleUser) {
          setUser(currentUser);
        } else {
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(currentUser);
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  enum OperationType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LIST = 'list',
    GET = 'get',
    WRITE = 'write',
  }

  interface FirestoreErrorInfo {
    error: string;
    operationType: OperationType;
    path: string | null;
    authInfo: {
      userId?: string | null;
      email?: string | null;
      emailVerified?: boolean | null;
      isAnonymous?: boolean | null;
      tenantId?: string | null;
      providerInfo?: {
        providerId?: string | null;
        email?: string | null;
      }[];
    }
  }

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  const savePortfolioToCloud = async (portfolioToSave: PortfolioData) => {
    if (!auth.currentUser) return null;
    const uid = auth.currentUser.uid;
    const email = auth.currentUser.email || "";
    const portfolioId = `${uid}_${Date.now()}`;
    const path = `portfolios/${portfolioId}`;
    try {
      const payload = {
        basicDetails: portfolioToSave.basicDetails,
        educations: portfolioToSave.educations || [],
        skills: portfolioToSave.skills || [],
        experiences: portfolioToSave.experiences || [],
        projects: portfolioToSave.projects || [],
        certificates: portfolioToSave.certificates || [],
        socialLinks: portfolioToSave.socialLinks || {},
        template: portfolioToSave.template || "minimal",
        aiTemplateConfig: portfolioToSave.aiTemplateConfig || {},
        ownerId: uid,
        ownerEmail: email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(doc(db, "portfolios", portfolioId), payload);
      return portfolioId;
    } catch (err) {
      console.error("Failed to save portfolio to cloud:", err);
      handleFirestoreError(err, OperationType.CREATE, path);
      return null;
    }
  };

  const fetchPortfolioHistory = async () => {
    if (!auth.currentUser) return;
    setLoadingHistory(true);
    const path = "portfolios";
    try {
      const q = query(
        collection(db, path),
        where("ownerId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((docSnap) => {
        const item = docSnap.data();
        list.push({
          docId: docSnap.id,
          ...item,
          createdAt: item.createdAt?.toDate ? item.createdAt.toDate().toISOString() : item.createdAt,
          updatedAt: item.updatedAt?.toDate ? item.updatedAt.toDate().toISOString() : item.updatedAt,
        });
      });
      list.sort((a, b) => {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA;
      });
      setPortfolioHistory(list);
    } catch (err) {
      console.error("Failed to fetch cloud portfolio list:", err);
      handleFirestoreError(err, OperationType.LIST, path);
    } finally {
      setLoadingHistory(false);
    }
  };

  const deletePortfolioFromCloud = async (docId: string) => {
    const path = `portfolios/${docId}`;
    try {
      await deleteDoc(doc(db, "portfolios", docId));
      showToast("✓ Deleted from cloud history successfully!");
      fetchPortfolioHistory();
    } catch (err) {
      console.error("Failed to delete portfolio:", err);
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const handleLoadPortfolioFromHistory = (historyItem: any) => {
    const loadedData: PortfolioData = {
      basicDetails: historyItem.basicDetails,
      educations: historyItem.educations || [],
      skills: historyItem.skills || [],
      experiences: historyItem.experiences || [],
      projects: historyItem.projects || [],
      certificates: historyItem.certificates || [],
      socialLinks: historyItem.socialLinks || {},
      template: historyItem.template || "minimal",
      aiTemplateConfig: historyItem.aiTemplateConfig || undefined,
    };
    setPortfolio(loadedData);
    setSharedOwnerEmail(historyItem.ownerEmail || "");
    setViewMode("builder");
    setHistoryModalOpen(false);
    showToast("✨ Portfolio loaded successfully from cloud!");
  };

  const handleHistoryButtonClick = () => {
    if (auth.currentUser) {
      setHistoryModalOpen(true);
      fetchPortfolioHistory();
    } else {
      setAuthPendingAction("view-history");
      setViewMode("auth");
      showToast("🔑 Please authenticate to view your cloud saved portfolios!");
    }
  };

  const handleEnterBuilder = () => {
    if (sharedOwnerEmail && user?.email && sharedOwnerEmail.toLowerCase() !== user.email.toLowerCase()) {
      showToast("⚠️ You don't have permission to edit this portfolio. Starting a fresh custom workspace!");
      setPortfolio(INITIAL_PORTFOLIO);
      setSharedOwnerEmail("");
    }

    if (auth.currentUser && auth.currentUser.emailVerified) {
      setViewMode("builder");
    } else {
      setViewMode("auth");
    }
  };

  const handleCreateOwnPortfolio = () => {
    // Reset to initial beautiful mock details to start fresh
    setPortfolio(INITIAL_PORTFOLIO);
    setSharedOwnerEmail("");
    try {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } catch (e) {
      window.location.hash = "";
    }
    handleEnterBuilder();
    showToast("✨ Started fresh workspace. Design and secure your own digital portfolio!");
  };
  
  // Read localized cache representation or custom payload - Always start clean on refresh for fresh user sessions
  const [portfolio, setPortfolio] = useState<PortfolioData>(EMPTY_PORTFOLIO);
  const [sharedOwnerEmail, setSharedOwnerEmail] = useState<string>("");

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "mobile">("desktop");
  const [activeLandingTmpl, setActiveLandingTmpl] = useState<TemplateType>("modern-yellow");
  
  // Interactive UI statuses
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [resetConfirmModalOpen, setResetConfirmModalOpen] = useState(false);
  const [deleteConfirmDocId, setDeleteConfirmDocId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState<string>("");
  const [printHelperModalOpen, setPrintHelperModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [validationErrorAlert, setValidationErrorAlert] = useState<string | null>(null);

  // Firestore Saved History State
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [portfolioHistory, setPortfolioHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [authPendingAction, setAuthPendingAction] = useState<string | null>(null);

  // Bottom Webpage Feedbacks State and Form Inputs
  const [feedbacks, setFeedbacks] = useState<AppFeedback[]>(() => {
    try {
      const cached = localStorage.getItem("foliocraft_user_feedbacks");
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error("Failed to restore user feedbacks:", e);
    }
    return DEFAULT_FEEDBACKS;
  });
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackRole, setFeedbackRole] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const submitUserFeedback = () => {
    const trimmedName = feedbackName.trim();
    const trimmedRole = feedbackRole.trim();
    const trimmedText = feedbackText.trim();

    if (!trimmedName || !trimmedRole || !trimmedText) {
      showToast("⚠️ Please fill out all fields before submitting!");
      return;
    }

    const newFb: AppFeedback = {
      id: "fb_" + Date.now(),
      name: trimmedName,
      role: trimmedRole,
      text: trimmedText,
      rating: feedbackRating,
      date: new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      })
    };

    const updated = [newFb, ...feedbacks];
    setFeedbacks(updated);
    try {
      localStorage.setItem("foliocraft_user_feedbacks", JSON.stringify(updated));
    } catch (e) {
      console.error("Local storage error:", e);
    }

    // Reset fields
    setFeedbackName("");
    setFeedbackRole("");
    setFeedbackRating(5);
    setFeedbackText("");
    showToast("✓ Thank you! Your feedback has been submitted.");
  };


  // Auto-persist changes offline locally for open-source workspace durability
  useEffect(() => {
    try {
      localStorage.setItem("foliocraft_portfolio", JSON.stringify(portfolio));
    } catch (e: any) {
      // Gracefully capture quota exceeded or browser restriction issues
      const isQuotaExceeded = e.name === "QuotaExceededError" || 
                              e.code === 22 || 
                              e.name === "NS_ERROR_DOM_QUOTA_REACHED" || 
                              e.message?.toLowerCase().includes("quota");
                              
      if (isQuotaExceeded) {
        console.warn("Storage quota limit detected on shared environment. Sweeping local assets to maximize space...");
        try {
          // Clean other older or external draft keys to liberate origin sandbox space
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && !key.startsWith("foliocraft_")) {
              localStorage.removeItem(key);
            }
          }
          // Compress or reduce portfolio size defensively if still too large (e.g. user base64 profile pictures)
          const compact = { ...portfolio };
          if (compact.basicDetails && compact.basicDetails.avatarUrl && compact.basicDetails.avatarUrl.length > 100000) {
            compact.basicDetails.avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200";
          }
          localStorage.setItem("foliocraft_portfolio", JSON.stringify(compact));
        } catch (innerErr) {
          console.warn("Foliocraft local persistence deferred to browser memory layout:", innerErr);
        }
      } else {
        console.warn("Failed storing local portfolio snapshot safely in background:", e);
      }
    }
  }, [portfolio]);

  // Parse shareable URLs on startup supporting offline payload
  useEffect(() => {
    const handleUrlHashLoad = async (isInitialMount?: boolean) => {
      const hash = window.location.hash;
      if (hash.startsWith("#view=")) {
        const payload = hash.slice(6);
        try {
          if (payload.startsWith("id_")) {
            showToast("⚠️ Cloud-saved profiles are retired. Sharing is now local-first!");
            return;
          }
          const decodedData = JSON.parse(decodeURIComponent(escape(atob(payload))));
          if (decodedData && decodedData.basicDetails) {
            setPortfolio(decodedData);
            setSharedOwnerEmail(decodedData.ownerEmail || "");
            setViewMode("view-only");
          }
        } catch (err) {
          console.error("Failed to decode share state from url hash:", err);
        }
      } else if (hash === "#build" || hash === "#builder") {
        if (isInitialMount) {
          // Force landing page on initial load as requested by user
          setViewMode("landing");
          // Safely clear the builder hash on initial load to avoid routing loop
          try {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
          } catch (e) {
            window.location.hash = "";
          }
        } else {
          handleEnterBuilder();
        }
      } else if (hash === "#admin" || window.location.pathname.endsWith("/admin")) {
        const currentEmail = auth.currentUser?.email;
        if (!auth.currentUser) {
          setAuthPendingAction("admin");
          setViewMode("auth");
          showToast("🔑 Please authenticate to access the admin moderation center.");
        } else if (currentEmail !== "suginjoshuva@gmail.com") {
          showToast("❌ Access Denied: Administrator role required.");
          setViewMode("landing");
          try {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
          } catch (e) {
            window.location.hash = "";
          }
        } else {
          setViewMode("admin");
        }
      } else if (hash === "#about" || window.location.pathname.endsWith("/about")) {
        setViewMode("about");
      } else {
        setViewMode("landing");
      }
    };

    handleUrlHashLoad(true);
    const hashChangeListener = () => handleUrlHashLoad(false);
    window.addEventListener("hashchange", hashChangeListener);
    return () => window.removeEventListener("hashchange", hashChangeListener);
  }, []);

  const getStepValidation = (stepId: number, data: PortfolioData): { valid: boolean; reason: string } => {
    switch (stepId) {
      case 1: {
        const { fullName, tagline, email, phone, location, aboutMe, avatarUrl } = data.basicDetails || {};
        const isAnyFilled = !!(
          (fullName && fullName.trim()) || 
          (tagline && tagline.trim()) || 
          (email && email.trim()) || 
          (phone && phone.trim()) || 
          (location && location.trim()) || 
          (aboutMe && aboutMe.trim()) || 
          (avatarUrl && avatarUrl.trim())
        );
        return { 
          valid: isAnyFilled, 
          reason: "Please fill in at least one field in Step 1 to continue (e.g. Full Name, Tagline, or Email)." 
        };
      }
      case 2:
        return {
          valid: !!(data.educations && data.educations.length > 0),
          reason: "Please add at least one academic/education history entry in Step 2 to continue."
        };
      case 3:
        return {
          valid: !!(data.skills && data.skills.length > 0),
          reason: "Please list at least one professional skill in Step 3 to continue."
        };
      case 4:
        return {
          valid: !!(data.isFresher || (data.experiences && data.experiences.length > 0)),
          reason: "Please add at least one work experience or internship in Step 4, or select the 'I am a Fresher' checkbox to continue."
        };
      case 5: {
        const hasProj = !!(data.hasNoProjects || (data.projects && data.projects.length > 0));
        const hasCert = !!(data.hasNoCertificates || (data.certificates && data.certificates.length > 0));
        if (!hasProj) {
          return {
            valid: false,
            reason: "Please add at least one portfolio project in Step 5, or check the 'I have no projects yet' box to continue."
          };
        }
        if (!hasCert) {
          return {
            valid: false,
            reason: "Please register at least one certificate or publication in Step 5, or check the 'I have no certificates yet' box to continue."
          };
        }
        return { valid: true, reason: "" };
      }
      case 6: {
        const { github, linkedin, website, instagram } = data.socialLinks || {};
        const isAnyFilled = !!(
          (github && github.trim()) || 
          (linkedin && linkedin.trim()) || 
          (website && website.trim()) ||
          (instagram && instagram.trim())
        );
        return {
          valid: isAnyFilled,
          reason: "Please enter at least one social connection link in Step 6 to continue (LinkedIn, GitHub, Website, or Instagram)." 
        };
      }
      default:
        return { valid: true, reason: "" };
    }
  };

  // Step transition helper to set current editing step from the timeline progress track
  const handleSetStep = (stepId: number) => {
    // Going backward is always permitted
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
      return;
    }

    // Loop and validate intermediate steps
    for (let s = currentStep; s < stepId; s++) {
      const check = getStepValidation(s, portfolio);
      if (!check.valid) {
        showToast(check.reason);
        setCurrentStep(s);
        setCompletedSteps(prev => prev.filter(x => x !== s));
        return;
      } else {
        setCompletedSteps(prev => prev.includes(s) ? prev : [...prev, s]);
      }
    }

    setCurrentStep(stepId);
  };

  const updatePortfolio = (updates: Partial<PortfolioData>) => {
    setPortfolio((prev) => ({ ...prev, ...updates }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const nextStep = () => {
    const check = getStepValidation(currentStep, portfolio);
    if (!check.valid) {
      setValidationErrorAlert(check.reason);
      setCompletedSteps(prev => prev.filter(s => s !== currentStep));
      return;
    }

    setCompletedSteps(prev => prev.includes(currentStep) ? prev : [...prev, currentStep]);
    if (currentStep < 8) setCurrentStep(currentStep + 1);
  };

  const backStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // AI Bio API Caller
  const handleAIBioGeneration = async (additionalContext: string) => {
    setIsGeneratingBio(true);
    try {
      const res = await fetch("/api/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: portfolio.basicDetails.fullName,
          tagline: portfolio.basicDetails.tagline,
          location: portfolio.basicDetails.location,
          skills: portfolio.skills,
          additionalContext: additionalContext
        })
      });
      const resData = await res.json();
      if (resData.bio) {
        updatePortfolio({
          basicDetails: {
            ...portfolio.basicDetails,
            aboutMe: resData.bio
          }
        });
        showToast(resData.message ? "✓ AI Bio generated draft fallback." : "✓ AI Custom Bio loaded successfully!");
      }
    } catch (err: any) {
      console.error(err);
      showToast("❌ Could not generate AI bio: " + err.message);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  // AI Skill Auto Suggestions API Caller
  const handleAISkillsGeneration = async () => {
    setIsGeneratingSkills(true);
    try {
      const res = await fetch("/api/suggest-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagline: portfolio.basicDetails.tagline,
          industry: "Technology & Software Engineering"
        })
      });
      const resData = await res.json();
      if (Array.isArray(resData.skills)) {
        // Merge without duplicates
        const combined = Array.from(new Set([...portfolio.skills, ...resData.skills]));
        updatePortfolio({ skills: combined });
        showToast("✓ Recommended skills loaded successfully!");
      }
    } catch (err: any) {
      console.error(err);
      showToast("❌ Skill suggestion failed.");
    } finally {
      setIsGeneratingSkills(false);
    }
  };

  // AI Theme Layout Generator
  const handleAITemplateGeneration = async (promptText: string) => {
    setIsGeneratingTemplate(true);
    try {
      const res = await fetch("/api/generate-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText })
      });
      const resData = await res.json();
      if (resData.config) {
        updatePortfolio({
          template: "custom-ai",
          aiTemplateConfig: resData.config
        });
        showToast(resData.message ? "✓ Loaded fallback AI Theme!" : `✓ Generated Custom Template: ${resData.config.themeName || "Custom Theme"}`);
      } else {
        throw new Error("Missing template config in response.");
      }
    } catch (err: any) {
      console.error(err);
      showToast("❌ Custom template creation failed.");
    } finally {
      setIsGeneratingTemplate(false);
    }
  };

  // Helper to fallback to older document.execCommand strategy if navigator.clipboard is blocked
  const fallbackCopyText = (text: string): boolean => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // Prevent scrolling page on focus/add
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.warn("Fallback copy strategy failed:", err);
      return false;
    }
  };

  // Comprehensive, failsafe clipboard writing utility that handles iframe-sandboxed environments gracefully
  const copyToClipboard = async (text: string): Promise<boolean> => {
    let success = false;
    
    // 1. Try native navigator.clipboard.writeText
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (err) {
        console.warn("navigator.clipboard.writeText failed or blocked by sandbox permissions, trying fallback.", err);
      }
    }
    
    // 2. Try classic document.execCommand fallback
    if (!success) {
      success = fallbackCopyText(text);
    }
    
    return success;
  };

  // Dynamic Base64 share link generation with Standard Share API fallback and custom selection modal
  const handleShareLink = async () => {
    setIsSharing(true);
    setCopiedSuccess(false);

    // Save to Firestore cloud history if user is registered/logged in
    if (auth.currentUser) {
      try {
        await savePortfolioToCloud(portfolio);
      } catch (saveErr) {
        console.warn("Auto-saving to cloud history portfolio list failed:", saveErr);
      }
    }
    
    // Generate serialized link
    let generatedUrl = "";
    try {
      const sharePayload = {
        ...portfolio,
        ownerEmail: auth.currentUser?.email || ""
      };
      const serialized = btoa(unescape(encodeURIComponent(JSON.stringify(sharePayload))));
      generatedUrl = `${window.location.origin}/#view=${serialized}`;
      setShareUrl(generatedUrl);
    } catch (err) {
      console.error("Payload serialization failed:", err);
      showToast("❌ Failed to serialize portfolio data.");
      setIsSharing(false);
      return;
    }

    let sharedSuccessfully = false;
    
    // Try native navigator.share first
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FolioCraft Portfolio — ${portfolio.basicDetails.fullName}`,
          text: `Take a look at my personal digital portfolio web workspace. Custom compiled via FolioCraft!`,
          url: generatedUrl
        });
        sharedSuccessfully = true;
        showToast("✓ Shared successfully!");
        setIsSharing(false);
        setIsFeedbackModalOpen(true);
        return;
      } catch (shareErr: any) {
        if (shareErr.name === 'AbortError') {
          setIsSharing(false);
          return;
        }
        console.warn("Navigator.share restricted or failed. Trying direct copy.", shareErr);
      }
    }

    // Try failsafe copying strategy
    const success = await copyToClipboard(generatedUrl);
    if (success) {
      setCopiedSuccess(true);
      showToast("✓ Portfolio link copied to clipboard!");
      setIsFeedbackModalOpen(true);
    } else {
      showToast("⚠️ Standard clipboard block. Copy manually from the modal.");
    }

    // Always open share modal as a safe visual fallback where they can view/test/manually copy
    setShareModalOpen(true);
    setIsSharing(false);
  };

  // Direct PDF high density exporter logic
  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    showToast("⚙ Generating vector PDF... Downloading file shortly.");

    // Helper to convert inner color to standard rgb/rgba dynamically
    const convertInnerColor = (innerText: string, isLch: boolean): string => {
      try {
        let cleanText = innerText.trim();
        if (cleanText.includes('var(')) {
          // Dynamic CSS variables may not be parsed easily, return a generic dark/light standard neutral safe fallback
          return "rgba(120,120,120,0.9)";
        }

        const parts = cleanText.split('/');
        const valuesPart = parts[0].trim();
        const alphaPart = parts[1] ? parts[1].trim() : "1";

        const comps = valuesPart.split(/[\s,]+/).filter(Boolean);
        if (comps.length < 3) return "rgba(0,0,0,0)";

        const parseVal = (str: string, divisorIfPercent: number) => {
          const clean = str.trim();
          if (clean.endsWith('%')) {
            return parseFloat(clean) / divisorIfPercent;
          }
          return parseFloat(clean);
        };

        const l = parseVal(comps[0], 100);
        let a = 0;
        let b = 0;

        if (isLch) {
          const c = parseVal(comps[1], 100);
          const h = parseVal(comps[2], 360);
          const rad = (h * Math.PI) / 180;
          a = c * Math.cos(rad);
          b = c * Math.sin(rad);
        } else {
          a = parseVal(comps[1], 100 / 0.4);
          b = parseVal(comps[2], 100 / 0.4);
        }

        let alpha = 1;
        if (alphaPart.endsWith('%')) {
          alpha = parseFloat(alphaPart) / 100;
        } else if (alphaPart.startsWith('var(')) {
          alpha = 1;
        } else {
          alpha = parseFloat(alphaPart);
          if (isNaN(alpha)) alpha = 1;
        }

        if (isNaN(l) || isNaN(a) || isNaN(b)) {
          return "rgba(0,0,0,0)";
        }

        const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
        const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
        const s_ = l - 0.0894841775 * a - 1.291485548 * b;

        const l3 = Math.pow(Math.max(0, l_), 3);
        const m3 = Math.pow(Math.max(0, m_), 3);
        const s3 = Math.pow(Math.max(0, s_), 3);

        const r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
        const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
        const b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

        const toSRGB = (colorVal: number) => {
          const abs = Math.abs(colorVal);
          const val = abs > 0.0031308 ? 1.055 * Math.pow(abs, 1 / 2.4) - 0.055 : 12.92 * abs;
          return Math.max(0, Math.min(255, Math.round(Math.sign(colorVal) * val * 255)));
        };

        const red = toSRGB(r);
        const green = toSRGB(g);
        const blue = toSRGB(b_);

        return `rgba(${red},${green},${blue},${alpha})`;
      } catch (err) {
        console.error("Failed to parse internal color:", innerText, err);
        return "rgba(100,100,100,1)";
      }
    };

    // Helper to parse and replace oklch and oklab color values using balanced parenthesis matching
    const parseOklchAndReplace = (cssText: string): string => {
      let index = 0;
      const lower = cssText.toLowerCase();
      let result = "";
      let lastAppended = 0;

      while (true) {
        const oklchPos = lower.indexOf("oklch(", index);
        const oklabPos = lower.indexOf("oklab(", index);
        
        let foundPos = -1;
        let isLch = true;
        
        if (oklchPos !== -1 && oklabPos !== -1) {
          if (oklchPos < oklabPos) {
            foundPos = oklchPos;
            isLch = true;
          } else {
            foundPos = oklabPos;
            isLch = false;
          }
        } else if (oklchPos !== -1) {
          foundPos = oklchPos;
          isLch = true;
        } else if (oklabPos !== -1) {
          foundPos = oklabPos;
          isLch = false;
        }
        
        if (foundPos === -1) {
          break;
        }

        // Append anything from the last processed position to the start of this match
        result += cssText.substring(lastAppended, foundPos);
        
        // Find matching closing parenthesis (handling nested parentheses properly)
        let depth = 1;
        let scanIndex = foundPos + 6; // index after 'oklch(' or 'oklab('
        while (scanIndex < cssText.length && depth > 0) {
          const char = cssText[scanIndex];
          if (char === '(') {
            depth++;
          } else if (char === ')') {
            depth--;
          }
          scanIndex++;
        }
        
        const innerText = cssText.substring(foundPos + 6, scanIndex - 1);
        const converted = convertInnerColor(innerText, isLch);
        result += converted;
        
        lastAppended = scanIndex;
        index = scanIndex;
      }
      
      result += cssText.substring(lastAppended);
      return result;
    };

    const cleanAllStylesheetsForCapture = async () => {
      const originalDocs: Array<{ element: HTMLElement; text?: string; originalDisabled?: boolean }> = [];
      const tempStyles: HTMLStyleElement[] = [];

      // 1. Process all inline <style> tags in the main document
      const styleTags = Array.from(document.querySelectorAll("style"));
      for (const styleTag of styleTags) {
        if (styleTag.textContent) {
          const originalText = styleTag.textContent;
          const cleanedText = parseOklchAndReplace(originalText);
          if (originalText !== cleanedText) {
            originalDocs.push({ element: styleTag, text: originalText });
            styleTag.textContent = cleanedText;
          }
        }
      }

      // 2. Process all <link rel="stylesheet"> tags in the main document Same-Origin
      const linkTags = Array.from(document.querySelectorAll("link[rel='stylesheet']")) as HTMLLinkElement[];
      for (const linkTag of linkTags) {
        try {
          const href = linkTag.href;
          if (href && (href.startsWith(window.location.origin) || !href.startsWith("http"))) {
            const response = await fetch(href);
            if (response.ok) {
              const originalText = await response.text();
              const cleanedText = parseOklchAndReplace(originalText);
              
              // Create a temporary inline style with the cleaned css
              const tempStyle = document.createElement("style");
              tempStyle.textContent = cleanedText;
              tempStyle.setAttribute("data-temp-clean-style", "true");
              document.head.appendChild(tempStyle);
              tempStyles.push(tempStyle);

              // Disable original link
              linkTag.disabled = true;
              originalDocs.push({ element: linkTag, originalDisabled: false });
            }
          }
        } catch (e) {
          console.error("Failed to fetch or clean link tag stylesheet:", linkTag.href, e);
        }
      }

      // Return restoration function
      return () => {
        // Restore styles text
        for (const item of originalDocs) {
          if (item.element instanceof HTMLStyleElement && item.text !== undefined) {
            item.element.textContent = item.text;
          } else if (item.element instanceof HTMLLinkElement) {
            item.element.disabled = false;
          }
        }
        // Remove temp styles
        for (const tempStyle of tempStyles) {
          tempStyle.remove();
        }
      };
    };

    const originalGetComputedStyle = window.getComputedStyle;

    const cleanValue = (val: any): any => {
      if (typeof val === 'string') {
        const lower = val.toLowerCase();
        if (lower.includes('oklch(') || lower.includes('oklab(')) {
          return parseOklchAndReplace(val);
        }
      }
      return val;
    };

    const makeStyleProxy = (style: CSSStyleDeclaration) => {
      try {
        return new Proxy(style, {
          get(target, prop) {
            if (prop === 'getPropertyValue') {
              return function(propertyName: string) {
                const val = target.getPropertyValue(propertyName);
                return cleanValue(val);
              };
            }
            const val = Reflect.get(target, prop);
            if (typeof val === 'function') {
              return val.bind(target);
            }
            if (typeof prop === 'string') {
              return cleanValue(val);
            }
            return val;
          }
        });
      } catch (e) {
        return style;
      }
    };

    let restoreStyles: (() => void) | null = null;
    try {
      const element = document.getElementById("portfolio-capture-root");
      if (!element) {
        showToast("❌ Could not capture portfolio DOM template root.");
        setIsExportingPDF(false);
        return;
      }

      // Pre-clean live styles to eliminate modern color spaces oklch / oklab entirely before canvas generation
      restoreStyles = await cleanAllStylesheetsForCapture();

      // Intercept computed styles on the main window during canvas generation
      window.getComputedStyle = function(el: Element, pseudoElt?: string | null) {
        const style = originalGetComputedStyle.call(window, el, pseudoElt);
        return makeStyleProxy(style);
      };

      // Convert layout cleanly to high-res canvas (2.2 scale for absolute crispness)
      const canvas = await html2canvas(element, {
        scale: 2.2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FFFDF7", // Maintain high fidelity base off-white backdrop
        logging: false,
        onclone: (clonedDoc) => {
          // Intercept computed styles on the cloned iframe document window
          if (clonedDoc.defaultView) {
            const originalClonedGetComputedStyle = clonedDoc.defaultView.getComputedStyle;
            clonedDoc.defaultView.getComputedStyle = function(el: Element, pseudoElt?: string | null) {
              const style = originalClonedGetComputedStyle.call(clonedDoc.defaultView, el, pseudoElt);
              return makeStyleProxy(style);
            };
          }

          // Clean dynamic <style> blocks injected by build or Vite
          const styleTags = clonedDoc.querySelectorAll("style");
          styleTags.forEach((styleTag) => {
            if (styleTag.textContent) {
              styleTag.textContent = parseOklchAndReplace(styleTag.textContent);
            }
          });

          // Clean up inline styles
          const elementsWithStyles = clonedDoc.querySelectorAll("[style]");
          elementsWithStyles.forEach((el) => {
            const styleAttr = el.getAttribute("style");
            if (styleAttr) {
              el.setAttribute("style", parseOklchAndReplace(styleAttr));
            }
          });
        }
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      
      const pdfWidth = 210; // Standard A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Height is dynamically proportioned to capture the exact layout height!

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight], // Dynamic format to precisely fit the entire content on exactly ONE perfect seamless page!
      });

      // Render the image containing the whole layout in one perfect, seamless, single-page PDF with no page splits or text cut in half!
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

      const filename = `${portfolio.basicDetails.fullName.trim().replace(/\s+/g, "_")}_Portfolio.pdf`;
      pdf.save(filename);
      showToast("✓ PDF direct download completed successfully!");
      setIsFeedbackModalOpen(true);
    } catch (err: any) {
      console.error("PDF download tool failure:", err);
      showToast("❌ Export failed: use system print setup fallback as alternative.");
    } finally {
      window.getComputedStyle = originalGetComputedStyle;
      if (restoreStyles) {
        restoreStyles();
      }
      setIsExportingPDF(false);
    }
  };

  const triggerNativePrint = () => {
    try {
      if (window.self !== window.top) {
        // If we are inside the AI Studio sandboxed iframe, native browser print gets blocked.
        // Show a helpful guidance modal to open the app in a new tab.
        setPrintHelperModalOpen(true);
      } else {
        window.print();
      }
    } catch (err: any) {
      console.error("Native browser printing failed inside this runtime context:", err);
      setPrintHelperModalOpen(true);
    }
  };

  // --- RENDERING 0. PREMIUM INITIAL LOADING SCREEN ---
  if (authChecking || initialLoading) {
    return <LoadingScreen />;
  }

  // --- RENDERING 1. SHARE DEDICATED VIEW ---
  if (viewMode === "view-only") {
    const isOwner = !!((user?.email && sharedOwnerEmail && user.email.toLowerCase() === sharedOwnerEmail.toLowerCase()) ||
                    (user?.email && portfolio.basicDetails.email && user.email.toLowerCase() === portfolio.basicDetails.email.toLowerCase()));

    return (
      <div className="min-h-screen bg-stone-50 selection-yellow font-sans">
        {/* Floating return-to-editor ribbon for builder users */}
        <div className="bg-stone-900 text-white text-xs px-4 py-3 sticky top-0 z-50 flex flex-col md:flex-row gap-3 justify-between items-center print:hidden border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full inline-block animate-pulse ${isOwner ? "bg-emerald-500" : "bg-amber-500"}`}></span>
            <span className="font-bold">
              {isOwner 
                ? `You are viewing your own portfolio (Live Link Active)`
                : `You are viewing ${portfolio.basicDetails.fullName || "a personal"}'s live digital portfolio (Read-Only)`
              }
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {isOwner ? (
              <button 
                id="btn-edit-my-portfolio"
                onClick={() => {
                  window.location.hash = "#build";
                  handleEnterBuilder();
                }} 
                className="bg-[#F4B400] text-stone-950 font-extrabold px-4 py-2.5 rounded-xl hover:bg-yellow-500 transition-colors cursor-pointer text-xs font-mono shadow-sm"
              >
                Edit My Portfolio
              </button>
            ) : (
              <button 
                id="btn-create-your-own"
                onClick={handleCreateOwnPortfolio} 
                className="bg-[#F4B400] text-stone-950 font-black px-4.5 py-2.5 rounded-xl hover:bg-yellow-500 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-xs font-mono shadow-sm flex items-center justify-center gap-1.5"
              >
                Create Your Own Portfolio
              </button>
            )}
            <button
              onClick={triggerNativePrint}
              className="bg-stone-800 text-stone-300 font-bold px-4 py-2.5 rounded-xl hover:bg-stone-700 transition-colors cursor-pointer text-xs"
            >
              Download PDF / Print
            </button>
          </div>
        </div>

        {/* Ported full screen portfolio layout */}
        <main className="max-w-5xl mx-auto py-1 shadow-sm rounded-lg glass-effect mt-4 print:mt-0 print:shadow-none bg-white mb-6">
          <PortfolioTemplates data={portfolio} isViewOnly={true} />
        </main>

        {/* Generated Portfolio Credit */}
        <div className="text-center pb-12 pt-2 opacity-35 hover:opacity-75 transition-opacity duration-300 print:hidden text-stone-500 text-[11px] font-mono select-none uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
          <span>Created using</span>
          <span className="font-extrabold text-[#F4B400]">FolioCraft AI Builder</span>
        </div>
      </div>
    );
  }

  // --- RENDERING 1.45 ADMIN DASHBOARD GATEWAY ---
  if (viewMode === "admin") {
    if (!user || user.email !== "suginjoshuva@gmail.com") {
      setViewMode("landing");
      return null;
    }
    return (
      <AdminDashboard 
        onBackToLanding={() => {
          try {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
          } catch (e) {
            window.location.hash = "";
          }
          setViewMode("landing");
        }}
        showToast={showToast}
      />
    );
  }

  // --- RENDERING 1.5 AUTHENTICATION GATEWAY ---
  if (viewMode === "auth" || (viewMode === "builder" && !user)) {
    if (authChecking) {
      return (
        <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F4B400] mb-4" />
          <span className="text-xs font-mono text-stone-500">Checking credentials...</span>
        </div>
      );
    }
    return (
      <AuthScreen 
        onAuthSuccess={() => {
          if (authPendingAction === "admin") {
            setAuthPendingAction(null);
            if (auth.currentUser?.email === "suginjoshuva@gmail.com") {
              setViewMode("admin");
            } else {
              setViewMode("landing");
              showToast("❌ Admin access denied: Invalid login role.");
            }
          } else if (authPendingAction === "view-history") {
            setAuthPendingAction(null);
            setViewMode("landing");
            setHistoryModalOpen(true);
            fetchPortfolioHistory();
          } else {
            setViewMode("builder");
          }
          showToast("✓ Authenticated successfully!");
        }} 
        onBackToLanding={() => {
          setViewMode("landing");
        }}
      />
    );
  }

  // --- RENDERING 2.5 ABOUT PAGE ---
  if (viewMode === "about") {
    return (
      <AboutPage 
        onBack={() => {
          try {
            window.history.pushState(null, "", "/");
          } catch (e) {
            window.location.hash = "";
          }
          setViewMode("landing");
        }}
        onEnterBuilder={() => {
          window.location.hash = "#build";
          handleEnterBuilder();
        }}
      />
    );
  }

  // --- RENDERING 2. LANDING PAGE ---
  if (viewMode === "landing") {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 selection-yellow relative overflow-x-hidden p-0 m-0">
        
        {/* Abstract shape design decorators */}
        <div className="absolute top-[5%] left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 to-yellow-600/12 rounded-full filter blur-[140px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-1/3 right-[5%] w-[600px] h-[600px] bg-gradient-to-br from-[#F4B400]/8 to-amber-600/8 rounded-full filter blur-[160px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-[60%] left-[5%] w-[550px] h-[550px] bg-gradient-to-tr from-amber-500/12 via-[#F4B400]/8 to-transparent rounded-full filter blur-[150px] pointer-events-none mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[5%] right-1/4 w-[650px] h-[650px] bg-gradient-to-br from-yellow-500/10 to-amber-700/12 rounded-full filter blur-[170px] pointer-events-none mix-blend-screen" />

        {/* Header toolbar styled as a beautiful neobrutalist yellow box */}
        <motion.header
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-3 sm:mx-auto mt-2 sm:mt-4 px-3 sm:px-6 py-2.5 sm:py-4 flex justify-between items-center bg-[#F4B400] text-stone-950 border-2 border-stone-950 shadow-[4px_4px_0px_rgba(24,24,27,1)] rounded-2xl sticky top-2 sm:top-4 z-40"
        >
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <motion.span 
              whileHover={{ rotate: 12, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 sm:p-2.5 bg-stone-950 rounded-xl text-white cursor-pointer inline-block border border-stone-800"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
            </motion.span>
            <div className="flex flex-col justify-center">
              <span 
                className="text-sm sm:text-lg font-black tracking-tight text-white font-display block leading-tight"
                style={{
                  textShadow: "1px 1px 0px #1c1917, -1px -1px 0px #1c1917, 1px -1px 0px #1c1917, -1px 1px 0px #1c1917, 1.5px 1.5px 0px rgba(28,25,23,0.85)"
                }}
              >
                FolioCraft
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-stone-950 hidden xs:block tracking-widest uppercase -mt-0.5">BUILD ENGINE</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <span className="text-xs text-stone-900 font-extrabold font-mono hidden md:inline mr-1">v2.1 Stable</span>
            
            {user?.email === "suginjoshuva@gmail.com" && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.location.hash = "#admin";
                  setViewMode("admin");
                }}
                className="bg-stone-900 hover:bg-stone-850 text-[#F4B400] font-black text-[10px] sm:text-xs px-2.5 py-2 sm:px-4 sm:py-3 rounded-xl border-2 border-stone-950 flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0px_rgba(28,25,23,1)] select-none shrink-0"
              >
                <span>Admin<span className="hidden sm:inline"> Moderation</span></span>
              </motion.button>
            )}
            {/* Create Portfolio button removed from header as per user request */}
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            variants={animContainer}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 space-y-8 text-center lg:text-left"
          >
            <motion.div 
              variants={animItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4B400]/10 border border-[#F4B400]/30 rounded-full"
            >
              <span className="w-2 h-2 bg-[#F4B400] rounded-full animate-pulse"></span>
              <span className="text-[10px] font-mono font-bold text-stone-300 tracking-wider uppercase">INTEGRATED WITH GEMINI 3.5</span>
            </motion.div>
            
            <motion.h1 
              variants={{
                hidden: { opacity: 0, scale: 0.5 },
                show: { 
                  opacity: 1, 
                  scale: 1, 
                  transition: { 
                    type: "spring", 
                    stiffness: 35, 
                    damping: 15,
                    mass: 1.2
                  } 
                }
              }}
              className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none font-display"
            >
              Build Your <span className="underline decoration-4 decoration-[#F4B400] text-stone-100">Professional Portfolio</span> in Minutes.
            </motion.h1>
            
            <motion.p 
              variants={animItem}
              className="text-md md:text-lg text-stone-400 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Tailored for <span className="text-white font-bold">college students, teachers, freelancers, and beginner developers</span>. Enter parameters step-by-step and automatically compile gorgeous standalone websites.
            </motion.p>

            <motion.div 
              variants={animItem}
              className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start items-center w-full"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.location.hash = "#build";
                  handleEnterBuilder();
                }}
                className="w-full sm:w-auto bg-[#F4B400] text-stone-950 font-black text-sm px-8 py-4.5 rounded-2xl border-2 border-stone-900 shadow-[5px_5px_0px_rgba(24,24,27,1)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Create Portfolio</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </motion.button>
              
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#templates-showcase"
                className="w-full sm:w-auto bg-stone-900 text-stone-200 hover:bg-stone-850 font-bold text-sm px-6 py-4.5 rounded-2xl border-2 border-stone-800 transition-all flex items-center justify-center gap-1 text-center"
              >
                Explore templates
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHistoryButtonClick}
                id="btn-view-portfolio-history"
                className="w-full sm:w-auto bg-stone-900 border-2 border-[#F4B400]/25 text-[#F4B400] font-extrabold text-xs px-6 py-4.5 rounded-2xl hover:bg-stone-850 hover:border-[#F4B400] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md text-center"
              >
                <Layers className="w-4 h-4 text-[#F4B400]" />
                <span>My Saved Portfolios History</span>
              </motion.button>
            </motion.div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-800 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <dt className="text-2xl font-black text-white font-mono">15+</dt>
                <sub className="text-[10px] uppercase font-mono font-bold text-stone-400">Expert Sections</sub>
              </div>
              <div>
                <dt className="text-2xl font-black text-white font-mono">8</dt>
                <sub className="text-[10px] uppercase font-mono font-bold text-stone-400">Premium Themes</sub>
              </div>
              <div>
                <dt className="text-2xl font-black text-white font-mono">100%</dt>
                <sub className="text-[10px] uppercase font-mono font-bold text-stone-400">Local Privacy</sub>
              </div>
            </div>
          </motion.div>

          {/* Interactive Mockup Panel on Right */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative group"
          >
            {/* Interactive Browser mockup border */}
            <div className="bg-stone-900 rounded-3xl p-3 shadow-2xl relative border-2 border-stone-800 transition-transform duration-300 hover:scale-[1.02]">
              {/* Browser control bar */}
              <div className="flex items-center gap-1.5 pb-2 border-b border-stone-850 mb-3 px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="bg-stone-850 text-[9px] text-stone-400 font-mono px-3 py-0.5 rounded ml-3">alexmercer.dev/portfolio</span>
                <span className="ml-auto w-1.5 h-5 bg-stone-700/50 rounded-sm"></span>
              </div>

              {/* Scaled-down visual of Modern Yellow mockup with mock state */}
              <div className="max-h-[380px] overflow-y-auto overflow-x-hidden bg-[#FFFDF7] rounded-xl text-stone-800 relative selection-yellow" style={{ fontSize: "11px" }}>
                {/* Banner */}
                <div className="h-2 bg-[#F4B400] w-full"></div>
                <div className="p-4 space-y-4">
                  {/* Top intro */}
                  <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
                    <img src={INITIAL_PORTFOLIO.basicDetails.avatarUrl} alt="avatar" className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#F4B400]" />
                    <div>
                      <h3 className="font-extrabold text-sm text-stone-900 leading-tight">Alex Mercer</h3>
                      <p className="text-[#5F6368] font-bold text-[10px]">Full-Stack Engineer @ Stanford</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-mono font-bold uppercase text-stone-400 tracking-widest border-b border-stone-100 pb-1 mb-2">About</h4>
                    <p className="text-stone-600 leading-relaxed font-medium">Pursuing Computer Science and building aesthetic interfaces. Tutoring freshman student clubs and experimenting with responsive models.</p>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-mono font-bold uppercase text-stone-400 tracking-widest border-b border-stone-100 pb-1 mb-2">Key Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {["React", "TypeScript", "Figma", "Node.js"].map((sk, idx) => (
                        <span key={idx} className="bg-[#F4B400]/10 text-stone-800 font-bold px-1.5 py-0.5 rounded text-[9px]">{sk}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium overlay indicator */}
              <div className="absolute inset-x-4 bottom-4 bg-stone-950/80 backdrop-blur-md rounded-2xl p-4 border border-stone-800 text-center flex justify-between items-center text-white font-mono text-[10px]">
                <span>🛠️ Live Mockup Rendered</span>
                <span className="text-[#F4B400] font-bold">100% RESPONSIVE</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Feature showcase Section */}
        <section className="bg-stone-900/40 border-y border-stone-900 py-20 px-6">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-xs font-mono font-black text-[#F4B400] uppercase tracking-widest">PRODUCT FEATURES</span>
              <h2 className="text-3xl font-black text-white tracking-tight font-display">Everything Needed to Stand Out</h2>
              <p className="text-sm text-stone-400 font-medium leading-relaxed">Avoid the complications of complex web hosting, coding, or visual template setup.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature card 1 - Left Side Entry */}
              <motion.div 
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03, y: -6, boxShadow: "0 15px 30px rgba(0,0,0,0.45)", transition: { duration: 0.2 } }}
                className="bg-stone-900 border border-stone-800 p-6 space-y-4 shadow-xl rounded-2xl"
              >
                <span className="p-3 bg-amber-500/10 text-amber-500 rounded-xl inline-block">
                  <Sparkles className="w-5 h-5 fill-amber-500" />
                </span>
                <h3 className="font-extrabold text-lg text-white leading-snug">AI Biography Writer</h3>
                <p className="text-xs text-stone-400 leading-relaxed font-semibold">
                  Synthesize an engaging biography in seconds with the integration of Gemini. Perfectly framed, whether academic, professional, or startup-focused.
                </p>
              </motion.div>

              {/* Feature card 2 - Right Side Entry */}
              <motion.div 
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03, y: -6, boxShadow: "0 15px 30px rgba(0,0,0,0.45)", transition: { duration: 0.2 } }}
                className="bg-stone-900 border border-stone-800 p-6 space-y-4 shadow-xl rounded-2xl"
              >
                <span className="p-3 bg-indigo-500/10 text-indigo-450 rounded-xl inline-block">
                  <Layers className="w-5 h-5" />
                </span>
                <h3 className="font-extrabold text-lg text-white leading-snug">8 Tailored Templates</h3>
                <p className="text-xs text-stone-400 leading-relaxed font-semibold">
                  Packaged styles tailored for creative freelancers, tech scholars, school teachers, or academic students. Toggle layouts instantly without losing information.
                </p>
              </motion.div>

              {/* Feature card 3 - Left Side Entry */}
              <motion.div 
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03, y: -6, boxShadow: "0 15px 30px rgba(0,0,0,0.45)", transition: { duration: 0.2 } }}
                className="bg-stone-900 border border-stone-800 p-6 space-y-4 shadow-xl rounded-2xl"
              >
                <span className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl inline-block">
                  <FileText className="w-5 h-5" />
                </span>
                <h3 className="font-extrabold text-lg text-white leading-snug font-display">One-Click PDF Export</h3>
                <p className="text-xs text-stone-400 leading-relaxed font-semibold">
                  Instantly triggers professional styled printing setups. Generate formatted resume PDFs with optimal font scaling, margin layouts, and spacing hierarchies.
                </p>
              </motion.div>

              {/* Feature card 4 - Right Side Entry */}
              <motion.div 
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03, y: -6, boxShadow: "0 15px 30px rgba(0,0,0,0.45)", transition: { duration: 0.2 } }}
                className="bg-stone-900 border border-stone-800 p-6 space-y-4 shadow-xl rounded-2xl"
              >
                <span className="p-3 bg-sky-500/10 text-sky-400 rounded-xl inline-block">
                  <Globe className="w-5 h-5" />
                </span>
                <h3 className="font-extrabold text-lg text-white leading-snug">Instant SEO Hosting</h3>
                <p className="text-xs text-stone-400 leading-relaxed font-semibold">
                  Deploy your portfolio instantly with search-engine optimized, clean web routing. Ensure fast page load speeds, automatic responsiveness, and robust readability.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Templates Showcase Carousel/Selector */}
        <section id="templates-showcase" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
          {/* Typographic Reveal Header with Split words */}
          <div className="text-center max-w-lg mx-auto space-y-4">
            <span className="text-xs font-mono font-black text-[#F4B400] uppercase tracking-widest">VISUAL PRESETS</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-display flex flex-wrap justify-center gap-x-2.5 leading-none">
              {["Choose", "From", "Ready-Made", "Templates"].map((word, index) => (
                <span key={index} className="inline-block overflow-hidden py-1">
                  <motion.span
                    initial={{ y: 40, letterSpacing: "0.15em", opacity: 0 }}
                    whileInView={{ y: 0, letterSpacing: "-0.02em", opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.9,
                      delay: index * 0.15,
                      ease: [0.25, 1, 0.5, 1]
                    }}
                    className="inline-block origin-bottom"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h2>
            <p className="text-sm text-stone-400 font-medium">Select whichever template fits your exact professional demeanor.</p>
          </div>

          {/* Preset Buttons - Floating Tag Cascade */}
          <div className="flex flex-col gap-4 items-center">
            {/* Top Row Tags */}
            <div className="flex flex-wrap justify-center gap-3">
              {topRowTemplates.map((tmpl) => {
                const variants = getTagAnimationVariants("top", tmpl.id);
                const isActive = activeLandingTmpl === tmpl.id;
                return (
                  <motion.button
                    id={`landing-tmpl-btn-${tmpl.id}`}
                    key={tmpl.id}
                    variants={variants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    whileHover={!isActive ? {
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      boxShadow: "0 0 15px rgba(244, 180, 0, 0.25)",
                      borderColor: "rgba(244, 180, 0, 0.6)",
                      y: -1,
                      transition: { duration: 0.2 }
                    } : { scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveLandingTmpl(tmpl.id as any)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-extrabold border-2 transition-all cursor-pointer relative group flex items-center justify-center ${
                      isActive 
                        ? "border-amber-500 bg-stone-900 text-white scale-105" 
                        : "border-stone-850 bg-stone-900/60 text-stone-300 hover:text-white"
                    }`}
                  >
                    <span className={`inline-block transition-transform duration-200 ${!isActive ? "group-hover:-translate-y-[1px]" : ""}`}>
                      {tmpl.label}
                    </span>

                    {/* Active State Border Circuit Trace with Glowing Laser Effect */}
                    {isActive && (
                      <div className="absolute -inset-[2px] pointer-events-none rounded-xl overflow-visible">
                        <svg className="absolute inset-0 w-full h-full overflow-visible">
                          <motion.rect
                            x="1"
                            y="1"
                            width="98%"
                            height="98%"
                            rx="10"
                            ry="10"
                            fill="none"
                            stroke="#F4B400"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ 
                              duration: 1.5, 
                              ease: [0.25, 1, 0.5, 1],
                              delay: 0.45
                            }}
                            style={{
                              filter: "drop-shadow(0 0 4px #F4B400) drop-shadow(0 0 1px #F4B400)",
                            }}
                          />
                        </svg>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Bottom Row Tags */}
            <div className="flex flex-wrap justify-center gap-3">
              {bottomRowTemplates.map((tmpl) => {
                const variants = getTagAnimationVariants("bottom", tmpl.id);
                const isActive = activeLandingTmpl === tmpl.id;
                return (
                  <motion.button
                    id={`landing-tmpl-btn-${tmpl.id}`}
                    key={tmpl.id}
                    variants={variants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    whileHover={!isActive ? {
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      boxShadow: "0 0 15px rgba(244, 180, 0, 0.25)",
                      borderColor: "rgba(244, 180, 0, 0.6)",
                      y: -1,
                      transition: { duration: 0.2 }
                    } : { scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveLandingTmpl(tmpl.id as any)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-extrabold border-2 transition-all cursor-pointer relative group flex items-center justify-center ${
                      isActive 
                        ? "border-amber-500 bg-stone-900 text-white scale-105" 
                        : "border-stone-850 bg-stone-900/60 text-stone-300 hover:text-white"
                    }`}
                  >
                    <span className={`inline-block transition-transform duration-200 ${!isActive ? "group-hover:-translate-y-[1px]" : ""}`}>
                      {tmpl.label}
                    </span>

                    {/* Active State Border Circuit Trace with Glowing Laser Effect */}
                    {isActive && (
                      <div className="absolute -inset-[2px] pointer-events-none rounded-xl overflow-visible">
                        <svg className="absolute inset-0 w-full h-full overflow-visible">
                          <motion.rect
                            x="1"
                            y="1"
                            width="98%"
                            height="98%"
                            rx="10"
                            ry="10"
                            fill="none"
                            stroke="#F4B400"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ 
                              duration: 1.5, 
                              ease: [0.25, 1, 0.5, 1],
                              delay: 0.45
                            }}
                            style={{
                              filter: "drop-shadow(0 0 4px #F4B400) drop-shadow(0 0 1px #F4B400)",
                            }}
                          />
                        </svg>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Interactive Template Viewer */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-2 shadow-2xl max-w-4xl mx-auto overflow-hidden relative">
            <div className="h-6 bg-stone-950 border-b border-stone-850 rounded-t-2xl flex items-center px-4 gap-1">
              <span className="w-2 h-2 rounded-full bg-stone-750"></span>
              <span className="w-2 h-2 rounded-full bg-stone-750"></span>
              <span className="w-2 h-2 rounded-full bg-stone-750"></span>
            </div>
            <div className="p-3 max-h-[500px] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLandingTmpl}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Direct Render template inside mockup state */}
                  <PortfolioTemplates data={{...INITIAL_PORTFOLIO, template: activeLandingTmpl}} isViewOnly={true} />
                </motion.div>
               </AnimatePresence>
            </div>
          </div>
        </section>

                {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 pt-16 pb-12 border-t border-stone-850 font-sans text-stone-400 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 items-start">
            
            {/* Logo, Description & Creator */}
            <div className="md:col-span-6 space-y-5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="p-1.5 bg-[#F4B400] text-stone-950 rounded-lg">
                  <Sparkles className="w-4 h-4 fill-stone-950" />
                </div>
                <span className="font-black text-white text-lg tracking-tight font-display">
                  FolioCraft
                </span>
                <span className="text-[9px] font-mono font-bold bg-[#F4B400]/10 text-[#F4B400] px-2 py-0.5 rounded-md border border-[#F4B400]/25">
                  v2.1 Stable
                </span>
              </div>
              
              <p className="text-xs text-stone-400 max-w-sm mx-auto md:mx-0 font-medium leading-relaxed">
                The ultimate neo-brutalist web portfolio builder. Creating, validating, and sharing professional portfolios for students, developers, and creators.
              </p>

              {/* Creator badge */}
              <div className="flex justify-center md:justify-start">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="inline-flex items-center gap-2 bg-stone-900/60 border border-stone-800/85 hover:border-yellow-500/50 px-3.5 py-2 rounded-2xl transition-all duration-300"
                >
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                  <span className="text-[11px] font-mono text-stone-400">
                    Handcrafted with passion by{" "}
                    <a 
                      href="mailto:suginjoshuva@gmail.com"
                      className="text-white font-extrabold hover:text-[#F4B400] transition-colors"
                    >
                      Sugin Joshuva
                    </a>
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Quick Links Grid */}
            <div className="md:col-span-6 grid grid-cols-2 gap-8 text-center md:text-left">
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-100">
                  Platform Route
                </h4>
                <ul className="space-y-2.5 text-xs font-semibold">
                  <li>
                    <button
                      onClick={() => {
                        try {
                          window.history.pushState(null, "", "/about");
                        } catch (e) {
                          window.location.hash = "#about";
                        }
                        setViewMode("about");
                      }}
                      className="hover:text-[#F4B400] text-stone-400 transition-colors cursor-pointer block w-full text-center md:text-left focus:outline-none"
                    >
                      About the Engine
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setIsSecurityModalOpen(true)}
                      className="hover:text-[#F4B400] text-stone-400 transition-colors cursor-pointer block w-full text-center md:text-left focus:outline-none"
                    >
                      Security & Moderation
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-100">
                  Resources & Support
                </h4>
                <ul className="space-y-2.5 text-xs font-semibold">
                  <li>
                    <button
                      onClick={() => {
                        showToast("🛠️ Opening Developer Manual. Check standard offline records.");
                        window.open("https://github.com/suginj9/Foliocraft-Web-Builder", "_blank");
                      }}
                      className="hover:text-[#F4B400] text-stone-400 transition-colors cursor-pointer block w-full text-center md:text-left focus:outline-none"
                    >
                      Developer Manual
                    </button>
                  </li>
                  <li>
                    <a 
                      href="mailto:suginjoshuva@gmail.com"
                      className="hover:text-[#F4B400] text-stone-400 transition-colors block w-full text-center md:text-left"
                    >
                      Contact Developer
                    </a>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* Sub bottom Copyright line */}
          <div className="border-t border-stone-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-stone-500">
            <div>
              © 2026 FolioCraft. All rights reserved.
            </div>
            <div className="flex gap-4">
              <span>Licensed under MIT</span>
              <span>•</span>
              <span className="text-stone-400">Build 2.1 Final</span>
            </div>
          </div>
        </footer>

        {/* Global Feedback Modal */}
        <FeedbackModal 
          isOpen={isFeedbackModalOpen} 
          onClose={() => setIsFeedbackModalOpen(false)} 
          showToast={showToast} 
        />

        {/* Security & Data Protection Modal */}
        <SecurityModal 
          isOpen={isSecurityModalOpen} 
          onClose={() => setIsSecurityModalOpen(false)} 
        />

        {/* Saved Portfolio History Modal */}
        {historyModalOpen && (
          <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            {/* Cloud Portfolio History Item Delete Confirmation Overlay (on top of history dropdown) */}
            {deleteConfirmDocId && (
              <div className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl border-2 border-stone-900 max-w-md w-full p-6 sm:p-8 shadow-[8px_8px_0px_rgba(24,24,27,1)] space-y-6 relative text-left text-stone-900 animate-in zoom-in-95 duration-200">
                  <div className="flex items-start gap-4 text-stone-900">
                    <span className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-2xl inline-block">
                      <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-stone-900 text-lg leading-snug">Delete Saved Portfolio?</h3>
                      <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider font-mono">Warning: Irreversible action</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-stone-700 text-xs leading-relaxed font-semibold">
                    <p>
                      Are you sure you want to delete <span className="text-stone-950 font-black">"{deleteConfirmName}"</span> from your cloud-saved records?
                    </p>
                    <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 text-red-800 font-semibold leading-relaxed">
                      This will permanently delete this portfolio record from your account history and cloud storage. Once deleted, you cannot recover or restore this document.
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setDeleteConfirmDocId(null);
                        setDeleteConfirmName("");
                      }}
                      className="w-1/2 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-850 font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer text-center"
                    >
                      No, Keep It
                    </button>
                    <button
                      onClick={() => {
                        if (deleteConfirmDocId) {
                          deletePortfolioFromCloud(deleteConfirmDocId);
                        }
                        setDeleteConfirmDocId(null);
                        setDeleteConfirmName("");
                      }}
                      className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer text-center shadow-xs"
                    >
                      Yes, Delete permanently
                    </button>
                  </div>
                </div>
              </div>
            )}

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-stone-900 border-2 border-stone-800 rounded-3xl p-6 md:p-8 shadow-2xl relative text-left text-white max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#F4B400]/10 text-[#F4B400] rounded-xl border border-[#F4B400]/20">
                    <Layers className="w-5 h-5 text-[#F4B400]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-white font-display">My Saved Portfolios History</h3>
                    <p className="text-xs text-stone-400 font-mono">Authenticated as {user?.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setHistoryModalOpen(false)}
                  className="p-1.5 hover:bg-stone-850 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* List Body */}
              <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1 min-h-[250px]">
                {loadingHistory ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F4B400] mb-3" />
                    <span className="text-xs font-mono text-stone-500">Retrieving Cloud Portfolios...</span>
                  </div>
                ) : portfolioHistory.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-stone-800 rounded-2xl px-4">
                    <Globe className="w-10 h-10 text-stone-600 mx-auto mb-3 animate-pulse" />
                    <p className="text-sm font-bold text-stone-300">No cloud-saved portfolios found</p>
                    <p className="text-xs text-stone-550 mt-1.5 max-w-md mx-auto leading-relaxed">
                      Start making a new portfolio, complete step-by-step editing, and click the standard "Publish / Share Link" button in Step 8 to save records automatically to your secure account cloud list!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {portfolioHistory.map((item) => {
                      const fullName = item.basicDetails?.fullName || "Unnamed Profile";
                      const tagline = item.basicDetails?.tagline || "No subtitle";
                      const tmpl = item.template || "minimal";
                      
                      // Recompile share url
                      let itemUrl = "";
                      try {
                        const serialPayload = btoa(unescape(encodeURIComponent(JSON.stringify(item))));
                        itemUrl = `${window.location.origin}/#view=${serialPayload}`;
                      } catch (e) {
                        itemUrl = "";
                      }

                      return (
                        <div 
                          key={item.docId}
                          className="bg-stone-950/60 hover:bg-stone-950 border border-stone-800/80 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-200"
                        >
                          <div className="space-y-1 my-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-stone-100 text-sm truncate">{fullName}</span>
                              <span className="text-[10px] uppercase font-mono font-bold tracking-wider bg-[#F4B400]/15 text-[#F4B400] px-2 py-0.5 rounded border border-[#F4B400]/25">
                                {tmpl}
                              </span>
                            </div>
                            <p className="text-xs text-stone-400 font-medium truncate">{tagline}</p>
                            <p className="text-[10px] text-stone-500 font-mono">
                              Saved: {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Recently"}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 w-full md:w-auto">
                            {/* Copy Link Button */}
                            <button
                              onClick={async () => {
                                const success = await copyToClipboard(itemUrl);
                                if (success) {
                                  showToast("✓ Shared URL copied to clipboard!");
                                }
                              }}
                              className="bg-stone-850 hover:bg-stone-800 text-stone-300 font-bold px-3 py-1.5 rounded-xl text-[11px] transition-colors cursor-pointer border border-stone-800 flex-1 md:flex-initial text-center flex items-center justify-center gap-1.5"
                              title="Copy Live Link"
                            >
                              <Copy className="w-3.5 h-3.5 text-stone-400" />
                              <span>Copy Link</span>
                            </button>

                            {/* Edit Portfolio Button */}
                            <button
                              onClick={() => handleLoadPortfolioFromHistory(item)}
                              className="bg-[#F4B400] text-stone-950 font-black px-3.5 py-1.5 rounded-xl text-[11px] hover:bg-yellow-500 transition-all cursor-pointer flex-1 md:flex-initial text-center"
                            >
                              Load & Edit
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => {
                                setDeleteConfirmDocId(item.docId);
                                setDeleteConfirmName(fullName);
                              }}
                              className="p-2 hover:bg-red-500/10 text-stone-500 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/20 cursor-pointer"
                              title="Delete permanently"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // --- RENDERING 3. STUDIO BUILDER MODE ---
  const activeStepObj = WIZARD_STEPS.find(s => s.id === currentStep) || WIZARD_STEPS[0];

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-stone-850 selection-yellow flex flex-col m-0 p-0 overflow-x-hidden overflow-y-auto w-full max-w-full">
      {/* Reset Confirmation Overlay */}
      {resetConfirmModalOpen && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-stone-900 max-w-md w-full p-6 sm:p-8 shadow-[8px_8px_0px_rgba(24,24,27,1)] space-y-6 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <span className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-2xl inline-block">
                <RefreshCw className="w-6 h-6 text-red-500 animate-spin-reverse" style={{ animationDuration: '3s' }} />
              </span>
              <div className="space-y-1">
                <h3 className="font-extrabold text-stone-900 text-lg leading-snug">Reset Workspace Data?</h3>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">Warning: Irreversible action</p>
              </div>
            </div>

            <div className="space-y-3 text-stone-700 text-xs leading-relaxed font-semibold">
              <p>
                Are you sure you want to reset your portfolio workspace? 
              </p>
              <p className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-500 font-normal leading-relaxed">
                This will permanently discard all your edits, projects, skills, template configurations, and custom progress states, reverting the template back to the original default clean dataset.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setResetConfirmModalOpen(false)}
                className="w-1/2 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-850 font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer text-center"
              >
                No, Keep My Data
              </button>
              <button
                onClick={() => {
                  setPortfolio(EMPTY_PORTFOLIO);
                  setCompletedSteps([]);
                  setCurrentStep(1);
                  setResetConfirmModalOpen(false);
                  showToast("⚙ Portfolio cleared to a blank canvas.");
                }}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer text-center shadow-xs"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step Validation Error Warning Alert Modal overlay */}
      {validationErrorAlert && (
        <div className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-stone-900 max-w-md w-full p-6 sm:p-8 shadow-[8px_8px_0px_rgba(24,24,27,1)] space-y-6 relative animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-start gap-4 text-stone-900">
              <span className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-2xl inline-block font-bold">
                <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
              </span>
              <div className="space-y-1">
                <h3 className="font-extrabold text-stone-900 text-lg leading-snug">Hold on a second!</h3>
                <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider font-mono">Step required details missing</p>
              </div>
            </div>

            <div className="space-y-3 text-stone-700 text-xs leading-relaxed font-semibold">
              <p>
                You must complete some information in this section before you can advance to the next step.
              </p>
              <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 text-red-800 font-semibold leading-relaxed">
                {validationErrorAlert}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setValidationErrorAlert(null)}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs transition-all cursor-pointer text-center"
              >
                Got It, fill it up!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Sandbox Helper Modal */}
      {printHelperModalOpen && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-stone-900 max-w-md w-full p-6 sm:p-8 shadow-[8px_8px_0px_rgba(24,24,27,1)] space-y-6 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <span className="p-3 bg-amber-50 text-stone-950 border border-amber-200 rounded-2xl inline-block">
                <Globe className="w-6 h-6 text-[#F4B400] animate-pulse" />
              </span>
              <div className="space-y-1">
                <h3 className="font-extrabold text-stone-900 text-lg leading-snug">Print Sandbox Helper</h3>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">Restricted Preview Frame Detected</p>
              </div>
            </div>

            <div className="space-y-3 text-stone-700 text-xs leading-relaxed font-semibold">
              <p>
                We noticed your browser block coordinates prevent standard window printing inside this frame.
              </p>
              <p className="bg-amber-50/50 border border-amber-200 text-amber-900 rounded-xl p-3 font-medium">
                💡 **Why this happens:** This application runs inside a secure, sandboxed preview iframe of Google AI Studio. Security rules block native print dialog configurations inside sandbox frames.
              </p>
              <div className="space-y-2 pt-1">
                <p className="font-bold text-stone-900 font-mono text-[11px] uppercase tracking-wider">How to print or save successfully:</p>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 font-semibold text-stone-600">
                  <li>Click the <strong className="text-stone-900 font-extrabold">"Open in New Tab"</strong> icon at the top right of this preview panel.</li>
                  <li>Once the custom tab loads, navigate back to Step 8 and trigger the <strong className="text-stone-900 font-extrabold">"Print Dialog"</strong> button.</li>
                  <li>Select "Save as PDF" to save or print your formatted portfolio!</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setPrintHelperModalOpen(false)}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer text-center"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Portfolio Link Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-stone-900 max-w-lg w-full p-6 sm:p-8 shadow-[8px_8px_0px_rgba(24,24,27,1)] space-y-6 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <span className="p-3 bg-amber-50 text-stone-950 border border-amber-200 rounded-2xl inline-block">
                <Share2 className="w-6 h-6 text-[#F4B400]" />
              </span>
              <div className="space-y-1 flex-1">
                <h3 className="font-extrabold text-stone-900 text-lg leading-snug">Share Your Portfolio</h3>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">
                  {copiedSuccess ? "✓ Copied to clipboard successfully" : "⚠️ Sandbox environment copy fallback"}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-stone-750 text-xs leading-relaxed font-semibold">
              {copiedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-4 flex gap-2 items-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="font-medium text-xs">
                    The share link was successfully copied to your clipboard! You can paste it directly to clients and recruiter desks.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50/50 border border-amber-200 text-amber-900 rounded-2xl p-4 space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <span>💡 Clipboard Security Restricted</span>
                  </p>
                  <p className="font-medium text-[11px] text-stone-600 leading-normal">
                    This platform runs inside a secure, sandboxed preview template iframe. Some browsers block automatic clipboard writing here. You can manually copy the highlighted link from the box below!
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-stone-500">
                  Your Portfolio Link:
                </label>
                <div className="flex gap-2">
                  <input
                    id="share-modal-url-input"
                    type="text"
                    readOnly
                    value={shareUrl}
                    onClick={async (e) => {
                      (e.target as HTMLInputElement).select();
                      const success = await copyToClipboard(shareUrl);
                      if (success) {
                        setCopiedSuccess(true);
                        showToast("✓ Link copied to clipboard!");
                        setIsFeedbackModalOpen(true);
                      } else {
                        showToast("✓ Link Selected!");
                      }
                    }}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-3 text-[10px] font-mono text-stone-600 outline-none select-all focus:border-stone-400 focus:bg-stone-50/50"
                  />
                  <button
                    onClick={async () => {
                      const success = await copyToClipboard(shareUrl);
                      if (success) {
                        setCopiedSuccess(true);
                        showToast("✓ Link copied to clipboard!");
                        setIsFeedbackModalOpen(true);
                      } else {
                        showToast("⚠️ Standard clipboard permission is blocked. Copy manually.");
                      }
                    }}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-stone-850 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
                    title="Click to copy to clipboard"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                </div>
                <p className="text-[10px] text-stone-400 font-medium">
                  ✨ Tip: Click the input box to instantly select and highlight the entire URL!
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-1/2 bg-[#F4B400] hover:bg-[#F4B400]/90 text-stone-950 font-extrabold py-3 px-4 rounded-xl text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] border border-stone-950"
              >
                Open in new tab <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => setShareModalOpen(false)}
                className="w-full sm:w-1/2 bg-stone-900 hover:bg-stone-800 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer text-center"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Dynamic Toast System */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white font-mono text-xs px-5 py-3.5 rounded-2xl border border-stone-850 shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300">
          <span className="w-2 h-2 bg-[#F4B400] rounded-full inline-block animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editor Header Navigation bar */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode("landing")} 
            className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors"
            title="Return to Landing"
          >
            <ChevronLeft className="w-5 h-5 text-stone-850" />
          </button>
          <span className="font-black text-md text-stone-900 font-display font-bold">FolioCraft Studio</span>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <button
              id="btn-logout"
              onClick={async () => {
                await signOut(auth);
                setViewMode("auth");
                showToast("✓ Signed out successfully!");
              }}
              className="flex items-center gap-1.5 text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 active:scale-95 border border-stone-200 py-1.5 px-3 rounded-xl font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              title="Sign Out of FolioCraft"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-500" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </header>

      {/* Landscape Timeline Steps Track */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-6">
        <SidebarSteps
          steps={WIZARD_STEPS}
          currentStep={currentStep}
          setCurrentStep={handleSetStep}
          completedSteps={completedSteps}
        />
      </div>

      {/* Base Grid containing Side-by-Side Builder & Preview Panels */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 max-w-7xl mx-auto w-full pt-1">
        
        {/* LEFT COLUMN: Step Form Content (45% width) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          {/* Current editing card container */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex-1">
            <StepForm
              data={portfolio}
              updateData={updatePortfolio}
              currentStep={currentStep}
              onNext={nextStep}
              onBack={backStep}
              onGenerateBio={handleAIBioGeneration}
              isGeneratingBio={isGeneratingBio}
              onGenerateSkills={handleAISkillsGeneration}
              isGeneratingSkills={isGeneratingSkills}
              onShareLink={handleShareLink}
              onDownloadPDF={handleDownloadPDF}
              isExportingPDF={isExportingPDF}
              isSharing={isSharing}
              onTriggerPrint={triggerNativePrint}
              onGenerateTemplate={handleAITemplateGeneration}
              isGeneratingTemplate={isGeneratingTemplate}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Studio live template preview viewport representation (55% width) */}
        <div className="lg:col-span-7 flex flex-col space-y-4 print:hidden">
          {/* Preview control headers */}
          <div className="bg-white border border-stone-200 rounded-2xl p-3 flex justify-between items-center shadow-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-extrabold text-xs text-stone-900 font-mono">LIVE PREVIEW ENGINE</span>
              <span className="text-[10px] text-stone-400">• changes sync instantly</span>
            </div>

            {/* Viewport resizing triggers */}
            <div className="flex items-center gap-1 border border-stone-150 rounded-lg p-0.5 bg-stone-50">
              <button
                id="btn-viewport-desktop"
                onClick={() => setPreviewViewport("desktop")}
                className={`p-1.5 rounded-md ${previewViewport === "desktop" ? "bg-white text-stone-900 shadow-xs" : "text-stone-450 hover:bg-stone-100"}`}
                title="Desktop Layout"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-viewport-mobile"
                onClick={() => setPreviewViewport("mobile")}
                className={`p-1.5 rounded-md ${previewViewport === "mobile" ? "bg-white text-stone-900 shadow-xs" : "text-stone-450 hover:bg-stone-100"}`}
                title="Mobile Viewport"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive device frame container */}
          <div className="flex-1 bg-stone-100 border border-stone-200 rounded-3xl p-4 flex justify-center items-start min-h-[500px] overflow-hidden shadow-inner">
            <div 
              className={`bg-[#FFFDF7] h-full overflow-y-auto shadow-xl transition-all duration-300 rounded-2xl border border-stone-200 flex flex-col ${
                previewViewport === "mobile" ? "w-[360px] max-w-full" : "w-full"
              }`}
            >
              {/* Simulating active browser coordinates */}
              <div className="h-6 bg-stone-50 border-b border-stone-150 rounded-t-2xl flex items-center px-4 gap-1.5 sticky top-0 z-30">
                <span className="w-2 h-2 rounded-full bg-stone-250"></span>
                <span className="w-2 h-2 rounded-full bg-stone-250"></span>
                <span className="w-2 h-2 rounded-full bg-stone-250"></span>
                <span className="text-[9px] text-[#A1A1AA] font-mono truncate ml-4 max-w-[200px]">
                  foliocraft.site/preview/{portfolio.basicDetails.fullName.replaceAll(" ", "").toLowerCase()}
                </span>
                
                {/* Visual reset badge */}
                <button 
                  id="btn-reset-preview"
                  onClick={() => setResetConfirmModalOpen(true)} 
                  className="ml-auto flex items-center gap-1 text-[9px] font-bold text-stone-500 hover:text-stone-900 font-mono"
                  title="Restore default mock dataset"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> Reset Data
                </button>
              </div>

              {/* RENDER ACTIVE TEMPLATE CANVAS */}
              <div id="portfolio-capture-root" className="flex-1 overflow-x-hidden selection-yellow p-1 bg-white">
                <PortfolioTemplates data={portfolio} isViewOnly={false} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Styled Printable Setup block for print commands */}
      <div className="only-print bg-white text-black text-sm absolute inset-0 z-[9999] overflow-visible">
        <style>
          {`
            @media screen {
              .only-print {
                display: none !important;
              }
            }
            @media print {
              body, html {
                background: white !important;
                color: black !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                height: auto !important;
                overflow: visible !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              header, nav, footer, button, .print\\:hidden, #btn-reset-preview, .max-w-7xl, main {
                display: none !important;
              }
              .only-print {
                display: block !important;
                position: relative !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: auto !important;
                z-index: 99999 !important;
                background: white !important;
                padding: 0 !important;
                margin: 0 !important;
                overflow: visible !important;
              }
              /* Prevent boxes, blocks, text elements, lists, or timeline nodes from being sliced across page breaks */
              section, blockquote, .card, [class*="card"], [class*="item"], .grid > div, h1, h2, h3, h4, h5, h6, ul, ol, li, p {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }
              /* Compress excessive margins or paddings to prevent redundant pagination gaps */
              .py-12, .py-16, .py-20, .py-24 {
                padding-top: 1.5rem !important;
                padding-bottom: 1.5rem !important;
              }
              .my-12, .my-16, .my-20 {
                margin-top: 1.5rem !important;
                margin-bottom: 1.5rem !important;
              }
              .gap-8, .gap-10, .gap-12 {
                gap: 1rem !important;
              }
              .space-y-8 > :not([hidden]) ~ :not([hidden]) {
                margin-top: 1rem !important;
              }
              .space-y-12 > :not([hidden]) ~ :not([hidden]) {
                margin-top: 1.5rem !important;
              }
            }
          `}
        </style>
        <PortfolioTemplates data={portfolio} isViewOnly={true} />
      </div>
    </div>
  );
}
