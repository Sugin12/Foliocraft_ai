export interface Education {
  id: string;
  institution: string;
  degree: string;
  department: string;
  startDate: string;
  endDate: string;
  grade?: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string; // "Present" or date
  isCurrent: boolean;
  location?: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[]; // e.g. ["React", "TypeScript"]
  githubUrl?: string;
  liveUrl?: string;
  imageTheme: string; // Tailwind gradient preset, e.g., "from-yellow-400 to-orange-500"
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  instagram?: string;
  website?: string;
}

export interface BasicDetails {
  fullName: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  aboutMe: string;
  avatarUrl: string; // Base64 or standard preset
  languages?: string;
  summary?: string;
}

export interface AITemplateConfig {
  backgroundColor: string; // outer background, e.g., "bg-[#090D1A]" or hex code
  textColor: string;       // general descriptive text, e.g., "text-gray-300"
  headingColor: string;    // important titles, e.g., "text-white"
  taglineColor: string;    // taglines or secondary text, e.g., "text-teal-400"
  accentColor: string;     // accent headings highlight, e.g., "#00FFCC"
  accentBg: string;        // tag background fill, e.g., "bg-[#00FFCC]/10"
  accentBorder: string;    // tag border outline, e.g., "border-[#00FFCC]/20"
  cardBg: string;          // card container fill, e.g., "bg-[#111827]/60" or plain color
  cardBorder: string;      // card container boundary, e.g., "border-gray-800"
  fontFamily: 'sans' | 'serif' | 'mono' | 'space'; // font choice
  badgeBg: string;         // pill bg, e.g., "bg-gray-800/40"
  layoutStyle: 'stack' | 'grid' | 'sidebar' | 'bento';
  themeName: string;       // nice descriptive name given by user or AI, e.g., "Deep Cyberpunk"
  floatingGlows?: string[]; // 2 colors matching gradient glowing blur bubbles, e.g. ["#FF0055", "#00FFCC"]
  heroPreset?: string;     // nice high-contrast label/caps text, e.g., "SPACE RECRUIT CHIP"
}

export type TemplateType = 'minimal' | 'modern-yellow' | 'dark-elegant' | 'creative-student' | 'teacher-professional' | 'glassmorphism-elite' | 'bento-grid-creator' | 'luxury-dark-gold' | 'custom-ai' | 'ghibli-cozy';

export interface PortfolioData {
  basicDetails: BasicDetails;
  educations: Education[];
  skills: string[];
  experiences: Experience[];
  projects: Project[];
  certificates: Certificate[];
  socialLinks: SocialLinks;
  template: TemplateType;
  customUrlSlug?: string;
  aiTemplateConfig?: AITemplateConfig;
  isFresher?: boolean;
  hasNoProjects?: boolean;
  hasNoCertificates?: boolean;
}

export interface StepInfo {
  id: number;
  name: string;
  title: string;
  description: string;
}
