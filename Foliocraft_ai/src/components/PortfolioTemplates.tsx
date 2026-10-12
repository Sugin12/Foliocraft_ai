import React from "react";
import { PortfolioData } from "../types";
import { 
  Mail, Phone, MapPin, ExternalLink, Calendar, 
  Award, Briefcase, GraduationCap, Github, Linkedin, Instagram, Globe, FileText, Sparkles,
  Coffee, BookOpen, Sun, Moon, Compass
} from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  isViewOnly?: boolean;
}

export const PortfolioTemplates: React.FC<TemplateProps> = ({ data, isViewOnly = false }) => {
  const { basicDetails, educations, skills, experiences, projects, certificates, socialLinks, template, aiTemplateConfig, isFresher, hasNoProjects, hasNoCertificates } = data;
  const [isNightMode, setIsNightMode] = React.useState(false);

  const parsedLanguages = basicDetails.languages
    ? basicDetails.languages.split(",").map(lang => lang.trim()).filter(lang => lang.length > 0)
    : [];

  const renderSocials = (iconClass: string) => {
    return (
      <div className="flex flex-wrap gap-4 mt-6">
        {socialLinks.github && (
          <a href={socialLinks.github.startsWith('http') ? socialLinks.github : `https://${socialLinks.github}`} target="_blank" rel="noopener noreferrer" className={iconClass} title="GitHub">
            <Github className="w-5 h-5" />
          </a>
        )}
        {socialLinks.linkedin && (
          <a href={socialLinks.linkedin.startsWith('http') ? socialLinks.linkedin : `https://${socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className={iconClass} title="LinkedIn">
            <Linkedin className="w-5 h-5" />
          </a>
        )}
        {socialLinks.instagram && (
          <a href={socialLinks.instagram.startsWith('http') ? socialLinks.instagram : `https://${socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className={iconClass} title="Instagram">
            <Instagram className="w-5 h-5" />
          </a>
        )}
        {socialLinks.website && (
          <a href={socialLinks.website.startsWith('http') ? socialLinks.website : `https://${socialLinks.website}`} target="_blank" rel="noopener noreferrer" className={iconClass} title="Website">
            <Globe className="w-5 h-5" />
          </a>
        )}
      </div>
    );
  };

  // --- AI CUSTOM DYNAMIC TEMPLATE RENDERER ---
  if (template === "custom-ai" && aiTemplateConfig) {
    const cfg = aiTemplateConfig;
    let fontClass = "font-sans";
    if (cfg.fontFamily === "serif") fontClass = "font-serif";
    else if (cfg.fontFamily === "mono") fontClass = "font-mono";
    else if (cfg.fontFamily === "space") fontClass = "font-space";

    const glowColor0 = cfg.floatingGlows?.[0] || "rgba(244,180,0,0.1)";
    const glowColor1 = cfg.floatingGlows?.[1] || "rgba(0,252,252,0.1)";

    // Custom social icon link
    const renderAISocialIcon = () => {
      const iconClass = `p-2 rounded-xl transition-all duration-200 border ${cfg.cardBorder} hover:scale-115 shrink-0 flex items-center justify-center`;
      return (
        <div className="flex flex-wrap gap-2.5 mt-4">
          {socialLinks.github && (
            <a href={socialLinks.github.startsWith('http') ? socialLinks.github : `https://${socialLinks.github}`} target="_blank" rel="noopener noreferrer" className={iconClass} style={{ borderColor: cfg.accentColor + "25", backgroundColor: cfg.accentColor + "08" }}>
              <Github className="w-4 h-4" style={{ color: cfg.accentColor }} />
            </a>
          )}
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin.startsWith('http') ? socialLinks.linkedin : `https://${socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className={iconClass} style={{ borderColor: cfg.accentColor + "25", backgroundColor: cfg.accentColor + "08" }}>
              <Linkedin className="w-4 h-4" style={{ color: cfg.accentColor }} />
            </a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram.startsWith('http') ? socialLinks.instagram : `https://${socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className={iconClass} style={{ borderColor: cfg.accentColor + "25", backgroundColor: cfg.accentColor + "08" }}>
              <Instagram className="w-4 h-4" style={{ color: cfg.accentColor }} />
            </a>
          )}
          {socialLinks.website && (
            <a href={socialLinks.website.startsWith('http') ? socialLinks.website : `https://${socialLinks.website}`} target="_blank" rel="noopener noreferrer" className={iconClass} style={{ borderColor: cfg.accentColor + "25", backgroundColor: cfg.accentColor + "08" }}>
              <Globe className="w-4 h-4" style={{ color: cfg.accentColor }} />
            </a>
          )}
        </div>
      );
    };

    return (
      <div className={`${cfg.backgroundColor} ${cfg.textColor} ${fontClass} min-h-screen relative overflow-hidden antialiased p-5 sm:p-8 md:p-12 transition-all duration-300`}>
        {/* Soft glowing ambient circles in background */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundColor: glowColor0 }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundColor: glowColor1 }}></div>

        {/* Global sticky bar with design credits */}
        {!isViewOnly && (
          <div className="max-w-5xl mx-auto mb-8 font-mono flex items-center justify-between text-[10px] bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-sm">
            <span className="flex items-center gap-1 opacity-70">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: cfg.accentColor }}></span>
              AI INSTANCE // {cfg.themeName || "CUSTOM DYNAMIC"}
            </span>
            <span className="opacity-50">
              LAYOUT: {cfg.layoutStyle.toUpperCase()}
            </span>
          </div>
        )}

        {/* Container wrapping layouts */}
        <div className="max-w-5xl mx-auto relative z-10 space-y-8">
          
          {/* HEADER HERO MODULE */}
          <header className={`p-6 sm:p-10 rounded-3xl border border-dashed text-left ${cfg.cardBg} ${cfg.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden`}>
            {/* Fine decoration lines in background */}
            <div className="absolute -right-20 -bottom-20 w-44 h-44 rounded-full border-4 border-white/5 pointer-events-none"></div>
            
            <div className="space-y-4 max-w-2xl">
              {cfg.heroPreset && (
                <div className="text-[10px] sm:text-[11px] font-mono tracking-widest font-black uppercase px-2.5 py-1 rounded border inline-block select-none" style={{ backgroundColor: cfg.accentBg, color: cfg.accentColor, borderColor: cfg.accentBorder }}>
                  ⚡ {cfg.heroPreset}
                </div>
              )}
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none ${cfg.headingColor}`}>
                {basicDetails.fullName || "Your Dynamic Identity"}
              </h1>
              <p className="text-sm sm:text-base font-medium opacity-85 leading-relaxed">
                {basicDetails.tagline || "Describe your professional craft..."}
              </p>
              {basicDetails.summary && (
                <p className="text-xs sm:text-sm font-medium italic opacity-75 leading-relaxed pl-3 border-l-2 my-1" style={{ borderColor: cfg.accentColor }}>
                  "{basicDetails.summary}"
                </p>
              )}
              
              <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs font-mono opacity-80 pt-1">
                {basicDetails.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" style={{ color: cfg.accentColor }} />
                    <span>{basicDetails.location}</span>
                  </div>
                )}
                {basicDetails.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" style={{ color: cfg.accentColor }} />
                    <span>{basicDetails.email}</span>
                  </div>
                )}
                {basicDetails.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" style={{ color: cfg.accentColor }} />
                    <span>{basicDetails.phone}</span>
                  </div>
                )}
                {basicDetails.languages && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" style={{ color: cfg.accentColor }} />
                    <span>Speaks: {basicDetails.languages}</span>
                  </div>
                )}
              </div>

              {renderAISocialIcon()}
            </div>

            {/* Avatar block if specified */}
            {basicDetails.avatarUrl && (
              <div className="relative shrink-0 w-28 h-28 sm:w-36 sm:h-36 mx-auto md:mx-0">
                <div className="absolute inset-0 rounded-3xl rotate-6 border-2 border-dashed transition-transform duration-300 pointer-events-none" style={{ borderColor: cfg.accentColor }}></div>
                <img
                  src={basicDetails.avatarUrl}
                  alt={basicDetails.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-3xl shadow-lg border border-white/10 relative z-10"
                />
              </div>
            )}
          </header>

          {/* DYNAMIC LAYOUT PRESSETS */}
          
          {/* LAYOUT PRESET: SIDEBAR */}
          {cfg.layoutStyle === "sidebar" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left pane: About & skills */}
              <div className="lg:col-span-4 space-y-6">
                {basicDetails.aboutMe && (
                  <section className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder}`}>
                    <h2 className={`text-xs uppercase tracking-widest font-mono font-black mb-4 ${cfg.taglineColor}`}>Biography</h2>
                    <p className="text-xs sm:text-sm opacity-85 leading-relaxed whitespace-pre-line text-justify">{basicDetails.aboutMe}</p>
                  </section>
                )}

                {skills.length > 0 && (
                  <section className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder}`}>
                    <h2 className={`text-xs uppercase tracking-widest font-mono font-black mb-4 ${cfg.taglineColor}`}>Capabilities</h2>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill, idx) => (
                        <span key={idx} className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border ${cfg.badgeBg}`} style={{ borderColor: cfg.accentColor + "15" }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Right pane: Education, experiences, projects */}
              <div className="lg:col-span-8 space-y-6">
                {/* Experiences */}
                {experiences.length > 0 && (
                  <section className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder} space-y-6`}>
                    <h2 className={`text-xs uppercase tracking-widest font-mono font-black border-b pb-2 ${cfg.taglineColor}`} style={{ borderColor: cfg.accentColor + "15" }}>Appointments & History</h2>
                    <div className="space-y-6">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="space-y-1.5 relative pl-4 border-l-2" style={{ borderColor: cfg.accentColor + "30" }}>
                          <span className="text-[10px] font-mono opacity-60 bg-black/10 px-2 py-0.5 rounded">{exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}</span>
                          <h3 className={`font-bold text-sm sm:text-base ${cfg.headingColor}`}>{exp.role}</h3>
                          <p className="text-xs opacity-75 font-semibold">{exp.company} {exp.location ? `| ${exp.location}` : ""}</p>
                          <p className="text-xs opacity-70 whitespace-pre-line leading-relaxed pb-2 text-justify">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                  <section className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder} space-y-6`}>
                    <h2 className={`text-xs uppercase tracking-widest font-mono font-black border-b pb-2 ${cfg.taglineColor}`} style={{ borderColor: cfg.accentColor + "15" }}>Craft Works</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projects.map((proj) => (
                        <div key={proj.id} className="p-4 rounded-2xl bg-black/5 border border-white/5 space-y-2 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className={`font-bold text-sm ${cfg.headingColor}`}>{proj.title}</h3>
                              {proj.liveUrl && (
                                <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                            <p className="text-[11px] opacity-75 mt-1 leading-snug">{proj.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {proj.tags.map((t, idx) => (
                              <span key={idx} className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${cfg.badgeBg}`}>{t}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education & Academic credentials */}
                {educations.length > 0 && (
                  <section className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder} space-y-6`}>
                    <h2 className={`text-xs uppercase tracking-widest font-mono font-black border-b pb-2 ${cfg.taglineColor}`} style={{ borderColor: cfg.accentColor + "15" }}>Academics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {educations.map((edu) => (
                        <div key={edu.id} className="p-4 rounded-2xl bg-black/5 border border-white/5 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-mono opacity-50 block">{edu.startDate} – {edu.endDate}</span>
                            <h4 className={`font-bold text-sm ${cfg.headingColor}`}>{edu.degree}</h4>
                            <p className="text-[11px] opacity-70">{edu.institution}</p>
                          </div>
                          {edu.grade && <span className="text-[10px] font-semibold mt-2 inline-block max-w-max px-2 py-0.5 rounded" style={{ backgroundColor: cfg.accentColor + "12", color: cfg.accentColor }}>{edu.grade}</span>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          )}

          {/* LAYOUT PRESET: STACK */}
          {cfg.layoutStyle === "stack" && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* About description in stack */}
              {basicDetails.aboutMe && (
                <section className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder}`}>
                  <h2 className={`text-xs uppercase tracking-widest font-mono font-black mb-4 ${cfg.taglineColor}`}>Core Objective</h2>
                  <p className="text-xs sm:text-sm opacity-85 leading-relaxed whitespace-pre-line text-justify">{basicDetails.aboutMe}</p>
                </section>
              )}

              {/* Hard Core Capabilities Pill Cloud */}
              {skills.length > 0 && (
                <section className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder}`}>
                  <h2 className={`text-xs uppercase tracking-widest font-mono font-black mb-4 ${cfg.taglineColor}`}>Skills & Ecosystem</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span key={idx} className={`text-xs font-mono font-black px-3 py-1.5 rounded-xl border ${cfg.badgeBg}`} style={{ borderColor: cfg.accentColor + "20" }}>
                        ⚡ {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience appointments timeline */}
              {experiences.length > 0 && (
                <section className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder} space-y-6`}>
                  <h2 className={`text-xs uppercase tracking-widest font-mono font-black mb-4 ${cfg.taglineColor}`}>Professional Appointments</h2>
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border-l-2 pl-4 py-1" style={{ borderColor: cfg.accentColor }}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                          <div>
                            <h3 className={`font-black text-sm sm:text-base ${cfg.headingColor}`}>{exp.role}</h3>
                            <p className="text-xs opacity-80">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                          </div>
                          <span className="text-[10px] font-mono opacity-60 sm:text-right shrink-0">{exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}</span>
                        </div>
                        <p className="text-xs opacity-70 mt-2 leading-relaxed text-justify">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects List on stack */}
              {projects.length > 0 && (
                <section className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder} space-y-6`}>
                  <h2 className={`text-xs uppercase tracking-widest font-mono font-black border-b pb-2 ${cfg.taglineColor}`} style={{ borderColor: cfg.accentColor + "15" }}>Case Studies & Deliverables</h2>
                  <div className="space-y-6">
                    {projects.map((proj) => (
                      <div key={proj.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 p-4 rounded-2xl bg-black/5 hover:bg-black/10 border border-white/5 transition-colors">
                        <div className="space-y-1">
                          <h3 className={`font-bold text-sm sm:text-base ${cfg.headingColor}`}>{proj.title}</h3>
                          <p className="text-xs opacity-75">{proj.description}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {proj.tags.map((tg, i) => (
                              <span key={i} className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded ${cfg.badgeBg}`}>{tg}</span>
                            ))}
                          </div>
                        </div>
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 flex items-center gap-1 shrink-0 text-xs font-mono font-bold" style={{ color: cfg.accentColor }}>
                            Lauch Project <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* LAYOUT PRESET: GRID */}
          {cfg.layoutStyle === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: About Me & Skills */}
              <div className="space-y-6 md:col-span-2">
                {basicDetails.aboutMe && (
                  <section className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder}`}>
                    <h2 className={`text-xs uppercase tracking-widest font-mono font-black mb-3 ${cfg.taglineColor}`}>Professional Profile</h2>
                    <p className="text-xs sm:text-sm opacity-85 leading-relaxed whitespace-pre-line text-justify">{basicDetails.aboutMe}</p>
                  </section>
                )}
              </div>

              {/* Skills and credentials */}
              <section className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder} space-y-4`}>
                <h2 className={`text-xs uppercase tracking-widest font-mono font-black ${cfg.taglineColor}`}>Ecosystem Coverage</h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <span key={idx} className={`text-[10px] font-mono font-semibold px-2 py-1 rounded-md border ${cfg.badgeBg}`} style={{ borderColor: cfg.accentColor + "15" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Education block on grid */}
              <section className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder} space-y-4`}>
                <h2 className={`text-xs uppercase tracking-widest font-mono font-black ${cfg.taglineColor}`}>Academics & Formation</h2>
                <div className="space-y-4">
                  {educations.map((edu) => (
                    <div key={edu.id} className="border-l-2 pl-3 py-0.5" style={{ borderColor: cfg.accentColor }}>
                      <span className="text-[9px] font-mono opacity-50 block">{edu.startDate} – {edu.endDate}</span>
                      <h4 className={`font-bold text-xs ${cfg.headingColor}`}>{edu.degree}</h4>
                      <p className="text-[10px] opacity-75">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Experiences block on grid */}
              <section className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder} md:col-span-2 space-y-6`}>
                <h2 className={`text-xs uppercase tracking-widest font-mono font-black ${cfg.taglineColor}`}>Industry Background</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-black/5 border border-white/5 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-mono opacity-50 block">{exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}</span>
                        <h3 className={`font-bold text-sm ${cfg.headingColor}`}>{exp.role}</h3>
                        <p className="text-xs opacity-75">{exp.company}</p>
                        <p className="text-[11px] opacity-70 leading-snug">{exp.description ? exp.description.substring(0, 100) + '...' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Projects slot on grid */}
              {projects.length > 0 && (
                <section className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder} md:col-span-2 space-y-6`}>
                  <h2 className={`text-xs uppercase tracking-widest font-mono font-black ${cfg.taglineColor}`}>Portfolio Contributions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {projects.map((proj) => (
                      <div key={proj.id} className="p-4 rounded-2xl bg-black/5 border border-white/5 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h4 className={`font-black text-xs sm:text-sm ${cfg.headingColor}`}>{proj.title}</h4>
                            {proj.liveUrl && (
                              <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 shrink-0">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                          <p className="text-[11px] opacity-75 mt-1">{proj.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {proj.tags.map((tg, i) => (
                            <span key={i} className={`text-[8px] font-mono font-bold px-1 py-0.5 rounded ${cfg.badgeBg}`}>{tg}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* LAYOUT PRESET: BENTO */}
          {cfg.layoutStyle === "bento" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* About Box - Bento Tile large */}
              <section className={`md:col-span-8 p-6 rounded-3xl border flex flex-col justify-between ${cfg.cardBg} ${cfg.cardBorder}`}>
                <div>
                  <h2 className={`text-xs uppercase tracking-widest font-mono font-black mb-3 ${cfg.taglineColor}`}>MISSION STATEMENT</h2>
                  <p className="text-xs sm:text-sm opacity-85 leading-relaxed whitespace-pre-line text-justify">{basicDetails.aboutMe || "Driven professional pushing boundaries of digital craftsmanship."}</p>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4 border-t pt-4" style={{ borderColor: cfg.accentColor + "15" }}>
                    {skills.slice(0, 7).map((skill, i) => (
                      <span key={i} className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${cfg.badgeBg}`}>{skill}</span>
                    ))}
                  </div>
                )}
              </section>

              {/* Stats / Status Box - Bento Tile medium */}
              <section className={`md:col-span-4 p-6 rounded-3xl border flex flex-col justify-between relative overflow-hidden ${cfg.cardBg} ${cfg.cardBorder}`}>
                <div className="absolute right-3 top-3 opacity-15">
                  <Sparkles className="w-16 h-16" style={{ color: cfg.accentColor }} />
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#5F6368] font-bold uppercase block">LIVE ENGINE STATUS</span>
                  <div className="text-2xl font-black mt-2 leading-none" style={{ color: cfg.accentColor }}>ACTIVE</div>
                  <p className="text-[11px] opacity-75 mt-2">Custom portfolio layout calculated dynamically via intelligence models.</p>
                </div>
                
                <div className="text-[10px] font-mono opacity-60">
                  REF_ID: #{Math.floor(Math.random() * 900000 + 100000)}
                </div>
              </section>

              {/* Projects Bento Columns */}
              {projects.length > 0 && (
                <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {projects.map((proj, i) => (
                    <section key={proj.id} className={`p-5 rounded-3xl border flex flex-col justify-between ${cfg.cardBg} ${cfg.cardBorder} hover:scale-102 transition-transform duration-200`}>
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] font-mono opacity-50 uppercase">CASE0{i+1}</span>
                          {proj.liveUrl && (
                            <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100">
                              <ExternalLink className="w-3.5 h-3.5" style={{ color: cfg.accentColor }} />
                            </a>
                          )}
                        </div>
                        <h3 className={`font-black text-sm sm:text-base mt-2 ${cfg.headingColor}`}>{proj.title}</h3>
                        <p className="text-[11px] opacity-75 mt-1 leading-snug">{proj.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-4">
                        {proj.tags.map((t, idx) => (
                          <span key={idx} className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${cfg.badgeBg}`}>{t}</span>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}

              {/* Academics & History - Wide Bento */}
              {experiences.length > 0 && (
                <section className={`md:col-span-7 p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder} space-y-4`}>
                  <h2 className={`text-xs uppercase tracking-widest font-mono font-black border-b pb-2 ${cfg.taglineColor}`} style={{ borderColor: cfg.accentColor + "15" }}>PROFESSIONAL CHRONOLOGY</h2>
                  <div className="space-y-4">
                    {experiences.slice(0, 3).map((exp) => (
                      <div key={exp.id} className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className={`font-bold text-xs ${cfg.headingColor}`}>{exp.role}</h4>
                          <p className="text-[10px] opacity-75 font-semibold">{exp.company}</p>
                        </div>
                        <span className="text-[9px] font-mono opacity-50 whitespace-nowrap">{exp.startDate} – {exp.isCurrent ? "Pres" : exp.endDate}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education Bento */}
              {educations.length > 0 && (
                <section className={`md:col-span-5 p-6 rounded-3xl border flex flex-col justify-between ${cfg.cardBg} ${cfg.cardBorder}`}>
                  <h2 className={`text-xs uppercase tracking-widest font-mono font-black border-b pb-2 ${cfg.taglineColor}`} style={{ borderColor: cfg.accentColor + "15" }}>ACADEMICS</h2>
                  <div className="space-y-3 mt-2">
                    {educations.slice(0, 2).map((edu) => (
                      <div key={edu.id}>
                        <h4 className={`font-bold text-xs ${cfg.headingColor}`}>{edu.degree}</h4>
                        <p className="text-[10px] opacity-75">{edu.institution} ({edu.endDate})</p>
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono opacity-50 mt-4 block">Official Degrees Registered</span>
                </section>
              )}

            </div>
          )}

          {/* ALL-ROUND COMPONENT: CERTIFICATES EXTRA PANEL */}
          {certificates.length > 0 && (cfg.layoutStyle === "bento" || cfg.layoutStyle === "sidebar" || cfg.layoutStyle === "grid") && (
            <footer className={`p-6 rounded-3xl border ${cfg.cardBg} ${cfg.cardBorder}`}>
              <h2 className={`text-xs uppercase tracking-widest font-mono font-black mb-4 ${cfg.taglineColor}`}>Credentials & Verification Badge Log</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-3 bg-black/5 rounded-2xl border border-white/5 space-y-1">
                    <h4 className={`text-xs font-bold leading-tight ${cfg.headingColor}`}>{cert.title}</h4>
                    <p className="text-[9px] opacity-60 leading-tight">{cert.issuer} • {cert.date}</p>
                  </div>
                ))}
              </div>
            </footer>
          )}

        </div>
      </div>
    );
  }

  // --- 1. MINIMAL TEMPLATE ---
  if (template === "minimal") {
    return (
      <div className="bg-white text-stone-900 min-h-screen font-sans antialiased p-8 md:p-16 max-w-4xl mx-auto selection:bg-stone-200">
        {/* Header */}
        <header className="border-b border-stone-100 pb-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <div>
              {basicDetails.avatarUrl && (
                <img 
                  src={basicDetails.avatarUrl} 
                  alt={basicDetails.fullName} 
                  className="w-20 h-20 rounded-full object-cover border border-stone-200 mb-4 bg-stone-50"
                  referrerPolicy="no-referrer"
                />
              )}
              <h1 className="text-3xl md:text-4xl font-light tracking-tight text-stone-950 font-serif">
                {basicDetails.fullName || "Your Full Name"}
              </h1>
              <p className="text-stone-500 font-mono text-sm uppercase mt-1 tracking-wider">
                {basicDetails.tagline || "Your professional tagline"}
              </p>
              {basicDetails.summary && (
                <p className="text-stone-650 italic text-xs max-w-lg mt-2.5 pl-3 border-l border-stone-300">
                  "{basicDetails.summary}"
                </p>
              )}
            </div>
            
            <div className="text-stone-500 text-sm font-light space-y-1 md:text-right font-mono">
              {basicDetails.email && (
                <div className="flex items-center md:justify-end gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>{basicDetails.email}</span>
                </div>
              )}
              {basicDetails.phone && (
                <div className="flex items-center md:justify-end gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{basicDetails.phone}</span>
                </div>
              )}
              {basicDetails.location && (
                <div className="flex items-center md:justify-end gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{basicDetails.location}</span>
                </div>
              )}
              {basicDetails.languages && (
                <div className="flex items-center md:justify-end gap-2">
                  <Globe className="w-3.5 h-3.5 text-stone-400" />
                  <span>Speaks: {basicDetails.languages}</span>
                </div>
              )}
            </div>
          </div>
          {renderSocials("text-stone-400 hover:text-stone-900 transition-colors duration-200")}
        </header>

        {/* About Section */}
        {basicDetails.aboutMe && (
          <section className="py-12 border-b border-stone-100">
            <h2 className="text-xs text-stone-400 font-mono uppercase tracking-widest mb-6">About</h2>
            <div className="text-stone-700 leading-relaxed max-w-2xl text-base whitespace-pre-line font-light">
              {basicDetails.aboutMe}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <section className="py-12 border-b border-stone-100">
            <h2 className="text-xs text-stone-400 font-mono uppercase tracking-widest mb-6">Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-stone-50 text-stone-700 rounded-full text-xs font-mono border border-stone-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experiences.length > 0 && (
          <section className="py-12 border-b border-stone-100">
            <h2 className="text-xs text-stone-400 font-mono uppercase tracking-widest mb-6">Experience</h2>
            <div className="space-y-10">
              {experiences.map((exp) => (
                <div key={exp.id} className="group">
                  <div className="flex justify-between items-baseline flex-wrap gap-2 mb-1">
                    <h3 className="font-serif text-lg text-stone-900">{exp.role}</h3>
                    <span className="text-xs font-mono text-stone-400">
                      {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-stone-600 mb-2">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                  <p className="text-sm text-stone-500 leading-relaxed whitespace-pre-line font-light">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <section className="py-12 border-b border-stone-100">
            <h2 className="text-xs text-stone-400 font-mono uppercase tracking-widest mb-6">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((proj) => (
                <div key={proj.id} className="border border-stone-100 rounded-lg p-6 hover:border-stone-200 transition-all duration-200 bg-stone-50/50">
                  <h3 className="font-serif text-base text-stone-900 font-medium mb-2 flex items-center justify-between">
                    {proj.title}
                    {(proj.githubUrl || proj.liveUrl) && (
                      <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                    )}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed mb-4 line-clamp-3 font-light">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.tags.map((tg, i) => (
                      <span key={i} className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                        {tg}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-xs font-mono">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`} target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-950 underline">
                        Code
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl.startsWith('http') ? proj.liveUrl : `https://${proj.liveUrl}`} target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-950 underline">
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {educations.length > 0 && (
          <section className="py-12 border-b border-stone-100">
            <h2 className="text-xs text-stone-400 font-mono uppercase tracking-widest mb-6">Education</h2>
            <div className="space-y-6">
              {educations.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline flex-wrap gap-2">
                    <h3 className="font-medium text-sm text-stone-900 font-serif text-base">{edu.degree} in {edu.department}</h3>
                    <span className="text-xs font-mono text-stone-400">{edu.startDate} – {edu.endDate}</span>
                  </div>
                  <p className="text-xs font-mono text-stone-500 mt-1">{edu.institution} {edu.grade ? `• GPA: ${edu.grade}` : ""}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <section className="py-12">
            <h2 className="text-xs text-stone-400 font-mono uppercase tracking-widest mb-6">Certificates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="text-xs font-light py-2 border-b border-stone-50">
                  <div className="font-medium text-stone-900 flex items-center justify-between">
                    <span>{cert.title}</span>
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-950">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-stone-500 mt-0.5">{cert.issuer} • {cert.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // --- 2. MODERN YELLOW TEMPLATE (SaaS style, Warm yellow #F4B400 accents) ---
  if (template === "modern-yellow") {
    return (
      <div className="bg-[#FFFDF7] text-stone-800 min-h-screen font-sans selection:bg-[#F4B400]/20 pb-20">
        {/* Banner with Warm Yellow Accent */}
        <div className="h-4 bg-[#F4B400] w-full"></div>
        
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Main profile row */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-stone-200/65 pb-12">
            {basicDetails.avatarUrl ? (
              <img 
                src={basicDetails.avatarUrl} 
                alt={basicDetails.fullName} 
                className="w-32 h-32 rounded-2xl object-cover ring-4 ring-[#F4B400] shadow-md bg-stone-50"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-32 h-32 bg-[#F4B400]/10 text-[#F4B400] rounded-2xl flex items-center justify-center font-bold text-4xl border border-[#F4B400]/20">
                {(basicDetails.fullName || "Y")[0].toUpperCase()}
              </div>
            )}
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-stone-900">
                {basicDetails.fullName || "Your Name"}
              </h1>
              <p className="text-lg md:text-md text-[#5F6368] font-semibold mt-2 flex items-center justify-center md:justify-start gap-2">
                <span className="w-2.5 h-2.5 bg-[#F4B400] rounded-full inline-block animate-pulse"></span>
                {basicDetails.tagline || "Creative Innovator & Developer"}
              </p>
              {basicDetails.summary && (
                <p className="text-[#5F6368] italic text-xs max-w-lg mt-3 pl-3 border-l-2 border-[#F4B400] font-medium text-left">
                  "{basicDetails.summary}"
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 mt-4 text-stone-600 text-sm">
                {basicDetails.email && (
                  <div className="flex items-center gap-1.5 hover:text-stone-900 transition-colors duration-150">
                    <Mail className="w-4 h-4 text-[#F4B400]" />
                    <span>{basicDetails.email}</span>
                  </div>
                )}
                {basicDetails.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#F4B400]" />
                    <span>{basicDetails.phone}</span>
                  </div>
                )}
                {basicDetails.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#F4B400]" />
                    <span>{basicDetails.location}</span>
                  </div>
                )}
                {basicDetails.languages && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#F4B400]" />
                    <span>Speaks: {basicDetails.languages}</span>
                  </div>
                )}
              </div>

              {renderSocials("bg-stone-100 hover:bg-[#F4B400]/10 text-stone-700 hover:text-[#F4B400] p-2.5 rounded-xl transition-all duration-200 border border-stone-200 inline-block")}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
            {/* Left side columns: About & Skills */}
            <div className="lg:col-span-1 space-y-10">
              {/* About card */}
              {basicDetails.aboutMe && (
                <div className="bg-white p-6 rounded-2xl border border-stone-200/70 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#F4B400]/5 rounded-bl-full -mr-4 -mt-4"></div>
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5F6368] border-b border-stone-100 pb-3 mb-4">
                    About Me
                  </h2>
                  <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line font-medium">
                    {basicDetails.aboutMe}
                  </p>
                </div>
              )}

              {/* Skills card */}
              {skills.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-stone-200/70 shadow-sm">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5F6368] border-b border-stone-100 pb-3 mb-4">
                    Core Strengths
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 bg-[#F4B400]/10 border border-[#F4B400]/25 text-stone-800 text-xs font-bold rounded-lg hover:scale-105 transition-transform duration-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education Block */}
              {educations.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-stone-200/70 shadow-sm">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5F6368] border-b border-stone-100 pb-3 mb-4">
                    Education
                  </h2>
                  <div className="space-y-6">
                    {educations.map((edu) => (
                      <div key={edu.id} className="border-l-2 border-[#F4B400] pl-4 space-y-1">
                        <h4 className="text-xs text-stone-500 font-bold font-mono">{edu.startDate} – {edu.endDate}</h4>
                        <h3 className="font-bold text-sm text-stone-900">{edu.degree} in {edu.department}</h3>
                        <p className="text-xs text-[#5F6368] font-medium">{edu.institution}</p>
                        {edu.grade && (
                          <span className="inline-block mt-1 bg-stone-100 px-2 py-0.5 text-[10px] rounded font-mono text-stone-600 font-bold">
                            GPA: {edu.grade}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right side columns: Experience, Projects & Certifications */}
            <div className="lg:col-span-2 space-y-10">
              {/* Experience timeline */}
              {experiences.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-stone-200/70 shadow-sm">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5F6368] border-b border-stone-100 pb-3 mb-6">
                    Professional Timeline
                  </h2>
                  <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-100">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="relative pl-8 group">
                        {/* Timeline dot */}
                        <div className="absolute left-1.5 top-1.5 w-4.5 h-4.5 rounded-full border-4 border-white bg-[#F4B400] group-hover:bg-stone-900 transition-colors duration-200 shadow-sm"></div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap justify-between items-center gap-2">
                            <h3 className="font-extrabold text-stone-900 text-lg group-hover:text-[#F4B400] transition-colors duration-150">
                              {exp.role}
                            </h3>
                            <span className="px-2.5 py-1 bg-stone-100 border border-stone-200/50 rounded-full text-xs font-mono font-medium text-stone-600">
                              {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-stone-500">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                          <p className="text-sm text-stone-600 whitespace-pre-line leading-relaxed pt-2 font-medium">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Grid */}
              {projects.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-[#F4B400] rounded-full inline-block"></span>
                    Featured Projects
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((proj) => (
                      <div key={proj.id} className="bg-white border border-stone-200/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                        {/* Elegant gradient top banner */}
                        <div className={`h-28 bg-gradient-to-br ${proj.imageTheme || 'from-[#F4B400] to-amber-500'} p-4 flex flex-col justify-end text-white relative`}>
                          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold font-mono">
                            PROJ
                          </div>
                          <h4 className="font-bold text-lg drop-shadow-sm">{proj.title}</h4>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed mb-4 font-medium">
                              {proj.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mb-5">
                              {proj.tags.map((tg, idx) => (
                                <span key={idx} className="bg-stone-100 hover:bg-stone-200/60 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                                  {tg}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs font-bold border-t border-stone-100 pt-3">
                            {proj.githubUrl && (
                              <a href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`} target="_blank" rel="noopener noreferrer" className="text-stone-700 hover:text-[#F4B400] flex items-center gap-1 transition-colors duration-150">
                                <Github className="w-4 h-4" />
                                <span>Repository</span>
                              </a>
                            )}
                            {proj.liveUrl && (
                              <a href={proj.liveUrl.startsWith('http') ? proj.liveUrl : `https://${proj.liveUrl}`} target="_blank" rel="noopener noreferrer" className="text-stone-700 hover:text-[#F4B400] flex items-center gap-1 transition-colors duration-150 ml-auto">
                                <ExternalLink className="w-4 h-4" />
                                <span>Live Demo</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications Row */}
              {certificates.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-stone-200/70 shadow-sm">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5F6368] border-b border-stone-100 pb-3 mb-4">
                    Honors & Certifications
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="p-3 bg-stone-50 border border-stone-100 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-[#F4B400]/10 rounded-lg text-[#F4B400]">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <h4 className="text-sm font-bold text-stone-900 break-words leading-snug">{cert.title}</h4>
                          <p className="text-xs text-stone-500 font-medium">{cert.issuer} • {cert.date}</p>
                          {cert.credentialUrl && (
                            <a href={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#F4B400] font-bold flex items-center gap-1 hover:underline mt-1">
                              Verify Credential <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. DARK ELEGANT TEMPLATE (Deep Charcoal #18181B / Warm Gold #F4B400) ---
  if (template === "dark-elegant") {
    return (
      <div className="bg-[#18181B] text-[#E4E4E7] min-h-screen font-sans selection:bg-[#F4B400]/30 selection:text-white pb-24">
        {/* Glow effect headers */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4B400]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 py-16 relative">
          <header className="border-b border-zinc-800 pb-12 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            {basicDetails.avatarUrl ? (
              <img 
                src={basicDetails.avatarUrl} 
                alt={basicDetails.fullName} 
                className="w-28 h-28 rounded-full object-cover border-2 border-[#F4B400] shadow-lg bg-zinc-900 shadow-[#F4B400]/10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-zinc-800 border border-[#F4B400]/40 flex items-center justify-center font-bold text-3xl text-[#F4B400]">
                {(basicDetails.fullName || "G")[0].toUpperCase()}
              </div>
            )}

            <div className="flex-1">
              <span className="text-[10px] font-mono tracking-widest text-[#F4B400] uppercase font-bold border border-[#F4B400]/30 px-3 py-1 rounded-full bg-[#F4B400]/10">
                AVAILABLE FOR COLLABORATION
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-4 font-serif">
                {basicDetails.fullName || "Sophisticated Practitioner"}
              </h1>
              <p className="text-[#A1A1AA] text-lg font-medium mt-1 uppercase font-mono tracking-wider text-xs">
                {basicDetails.tagline || "Artisan Crafting Digital Solutions"}
              </p>
              {basicDetails.summary && (
                <p className="text-[#A1A1AA] italic text-xs max-w-lg mt-3 pl-3 border-l-2 border-[#F4B400] font-medium text-left">
                  "{basicDetails.summary}"
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-[#A1A1AA] text-sm">
                {basicDetails.email && <span className="hover:text-white">{basicDetails.email}</span>}
                {basicDetails.email && basicDetails.phone && <span className="text-zinc-700">•</span>}
                {basicDetails.phone && <span>{basicDetails.phone}</span>}
                {basicDetails.phone && basicDetails.location && <span className="text-zinc-700">•</span>}
                {basicDetails.location && <span className="text-zinc-500 font-mono text-xs">{basicDetails.location}</span>}
                {basicDetails.location && basicDetails.languages && <span className="text-zinc-700">•</span>}
                {basicDetails.languages && <span className="text-zinc-500 font-mono text-xs">Speaks: {basicDetails.languages}</span>}
              </div>

              {renderSocials("bg-[#27272A] hover:bg-[#F4B400]/20 text-[#A1A1AA] hover:text-[#F4B400] p-2 rounded-lg transition-transform hover:-translate-y-0.5 duration-150 border border-zinc-800 inline-block")}
            </div>
          </header>

          {/* About section using Glassmorphism */}
          {basicDetails.aboutMe && (
            <section className="py-12 border-b border-zinc-800">
              <h2 className="text-xs text-[#F4B400] font-mono uppercase tracking-widest mb-6 font-bold">Biography</h2>
              <div className="bg-[#27272A]/40 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/80 leading-relaxed text-[#D4D4D8] text-sm md:text-base whitespace-pre-line font-light">
                {basicDetails.aboutMe}
              </div>
            </section>
          )}

          {/* Core Strengths */}
          {skills.length > 0 && (
            <section className="py-12 border-b border-zinc-800">
              <h2 className="text-xs text-[#F4B400] font-mono uppercase tracking-widest mb-6 font-bold">Skill Core</h2>
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-[#E4E4E7] text-xs font-mono rounded hover:border-[#F4B400]/50 transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Experience Timeline */}
          {experiences.length > 0 && (
            <section className="py-12 border-b border-zinc-800">
              <h2 className="text-xs text-[#F4B400] font-mono uppercase tracking-widest mb-8 font-bold">Work Log</h2>
              <div className="space-y-12">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l border-zinc-800">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#F4B400] shadow-[0_0_8px_rgba(244,180,0,0.5)]"></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white font-serif">{exp.role}</h3>
                      <span className="text-xs font-mono text-[#F4B400]/90">
                        {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#A1A1AA] mb-4">{exp.company} {exp.location ? `| ${exp.location}` : ""}</p>
                    <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-line font-light">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects (Glassy card aesthetic) */}
          {projects.length > 0 && (
            <section className="py-12 border-b border-zinc-800">
              <h2 className="text-xs text-[#F4B400] font-mono uppercase tracking-widest mb-8 font-bold">Selected Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-zinc-900/50 backdrop-blur-md rounded-xl border border-zinc-850 p-6 flex flex-col justify-between group hover:border-[#F4B400]/40 transition-all duration-300">
                    <div>
                      <h3 className="text-base text-white font-bold mb-2 group-hover:text-[#F4B400] transition-colors duration-150">{proj.title}</h3>
                      <p className="text-xs text-[#A1A1AA] leading-relaxed mb-4 line-clamp-3 font-light">{proj.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {proj.tags.map((tg, idx) => (
                          <span key={idx} className="bg-zinc-800 text-[#D4D4D8] text-[9px] font-mono px-2 py-0.5 rounded">
                            {tg}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4 border-t border-zinc-800 pt-3 text-xs font-mono">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`} target="_blank" rel="noopener noreferrer" className="text-[#A1A1AA] hover:text-[#F4B400] underline">
                          Repository
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl.startsWith('http') ? proj.liveUrl : `https://${proj.liveUrl}`} target="_blank" rel="noopener noreferrer" className="text-[#A1A1AA] hover:text-[#F4B400] underline ml-auto">
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education & Certs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-12">
            {educations.length > 0 && (
              <section>
                <h2 className="text-xs text-[#F4B400] font-mono uppercase tracking-widest mb-6 font-bold">Scholastic Records</h2>
                <div className="space-y-6">
                  {educations.map((edu) => (
                    <div key={edu.id} className="border-l border-zinc-800 pl-4 py-1">
                      <h3 className="font-bold text-sm text-white font-serif">{edu.degree}</h3>
                      <p className="text-[#A1A1AA] text-xs mt-0.5">{edu.department}</p>
                      <p className="text-xs text-zinc-500 font-mono mt-1">{edu.institution} ({edu.startDate} – {edu.endDate})</p>
                      {edu.grade && <span className="text-[10px] text-[#F4B400] font-mono mt-0.5 block">GPA: {edu.grade}</span>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {certificates.length > 0 && (
              <section>
                <h2 className="text-xs text-[#F4B400] font-mono uppercase tracking-widest mb-6 font-bold">Certifications & Honors</h2>
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="bg-zinc-900/30 border border-zinc-850 p-3 rounded-lg flex items-center justify-between">
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white break-words leading-snug">{cert.title}</h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{cert.issuer} • {cert.date}</p>
                      </div>
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`} target="_blank" rel="noopener noreferrer" className="p-1 px-2 border border-zinc-800 rounded hover:border-[#F4B400] text-[#F4B400] text-[10px] font-mono">
                          Verify
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- 4. CREATIVE STUDENT TEMPLATE (Playful, drop-shadow offset boxes, nice yellow/white contrasts) ---
  if (template === "creative-student") {
    return (
      <div className="bg-[#FAF9F5] text-stone-800 min-h-screen font-sans pb-24 overflow-hidden relative">
        {/* Colorful floating shape accents in background */}
        <div className="absolute top-10 -left-10 w-44 h-44 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-bounce pointer-events-none"></div>
        <div className="absolute bottom-20 -right-10 w-52 h-52 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 py-12 relative">
          {/* Bento-style Intro header */}
          <div className="bg-white border-2 border-stone-900 p-6 md:p-8 rounded-3xl shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {basicDetails.avatarUrl ? (
              <img 
                src={basicDetails.avatarUrl} 
                alt={basicDetails.fullName} 
                className="w-28 h-28 rounded-full border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] object-cover bg-amber-50"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-yellow-100 border-2 border-stone-900 flex items-center justify-center font-black text-4xl text-stone-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]">
                🚀
              </div>
            )}

            <div className="flex-1 text-center md:text-left space-y-2">
              <span className="bg-amber-300 text-stone-900 text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase border border-stone-900">
                Hi, I'm {basicDetails.fullName ? basicDetails.fullName.split(" ")[0] : "a Student"}!
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-stone-900">
                {basicDetails.fullName || "Creative College Dev"}
              </h1>
              <p className="text-amber-600 font-bold font-mono text-sm uppercase">
                ⚡ {basicDetails.tagline || "Learning & building amazing things"}
              </p>
              {basicDetails.summary && (
                <p className="text-stone-600 italic text-xs max-w-lg pl-3 border-l-2 border-amber-400 font-medium text-left">
                  "{basicDetails.summary}"
                </p>
              )}
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-stone-500 pt-1">
                {basicDetails.email && <span>📧 {basicDetails.email}</span>}
                {basicDetails.phone && <span>📞 {basicDetails.phone}</span>}
                {basicDetails.location && <span>📍 {basicDetails.location}</span>}
                {basicDetails.languages && <span>🌐 Speaks: {basicDetails.languages}</span>}
              </div>

              {renderSocials("bg-white hover:bg-amber-300 text-stone-850 p-2 border-2 border-stone-900 rounded-xl shadow-[2px_2px_0px_rgba(24,24,27,1)] transition-transform hover:-translate-y-0.5 inline-block")}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
            {/* Main Details Panel */}
            <div className="md:col-span-8 space-y-10">
              {/* About card with bold border */}
              {basicDetails.aboutMe && (
                <div className="bg-white border-2 border-stone-900 p-6 rounded-2xl shadow-[4px_4px_0px_rgba(24,24,27,1)]">
                  <h3 className="text-md font-bold font-mono text-stone-900 tracking-wider uppercase mb-3 text-amber-600 border-b border-stone-100 pb-2">
                    My Story
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line font-medium">
                    {basicDetails.aboutMe}
                  </p>
                </div>
              )}

              {/* Projects Grid with Creative offset boxes */}
              {projects.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-stone-900 uppercase font-mono tracking-wider">
                    🛠️ Cool Projects I Built
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {projects.map((proj) => (
                      <div key={proj.id} className="bg-white border-2 border-stone-900 rounded-xl overflow-hidden shadow-[4px_4px_0px_rgba(24,24,27,1)] hover:shadow-[1px_1px_0px_rgba(24,24,27,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150 flex flex-col justify-between">
                        <div className={`h-20 bg-gradient-to-r ${proj.imageTheme || 'from-indigo-400 to-amber-300'} p-3 border-b-2 border-stone-900 flex items-end`}>
                          <h4 className="font-black text-sm text-white bg-stone-900 px-2 py-0.5 rounded border border-stone-900 break-words leading-snug">
                            {proj.title}
                          </h4>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs text-stone-500 font-medium mb-3 line-clamp-3">
                              {proj.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-4">
                              {proj.tags.map((tg, idx) => (
                                <span key={idx} className="bg-stone-100 text-stone-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-stone-200">
                                  #{tg}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-4 text-xs font-bold pt-2 border-t border-stone-150">
                            {proj.githubUrl && (
                              <a href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`} target="_blank" rel="noopener noreferrer" className="text-indigo-650 hover:underline">
                                code
                              </a>
                            )}
                            {proj.liveUrl && (
                              <a href={proj.liveUrl.startsWith('http') ? proj.liveUrl : `https://${proj.liveUrl}`} target="_blank" rel="noopener noreferrer" className="text-indigo-650 hover:underline ml-auto">
                                live demo
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Work or Hobby Experience */}
              {experiences.length > 0 && (
                <div className="bg-white border-2 border-stone-900 p-6 rounded-2xl shadow-[4px_4px_0px_rgba(24,24,27,1)]">
                  <h3 className="text-md font-bold font-mono text-stone-900 tracking-wider uppercase mb-4 text-amber-600 border-b border-stone-100 pb-2">
                    🎒 Experiences So Far
                  </h3>
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="relative pb-4 last:pb-0 last:border-b-0 border-b border-stone-100">
                        <div className="flex flex-wrap justify-between items-baseline gap-1">
                          <h4 className="font-extrabold text-stone-900 text-md">{exp.role}</h4>
                          <span className="text-[10px] font-bold font-mono text-[#5F6368] bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                            {exp.startDate} – {exp.isCurrent ? "Active" : exp.endDate}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-amber-500 mt-0.5">{exp.company} {exp.location ? `| ${exp.location}` : ""}</p>
                        <p className="text-xs text-stone-500 mt-2 whitespace-pro-line font-medium leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Details Panel */}
            <div className="md:col-span-4 space-y-8">
              {/* Skills Bag */}
              {skills.length > 0 && (
                <div className="bg-amber-100 border-2 border-stone-900 p-5 rounded-2xl shadow-[3px_3px_0px_rgba(24,24,27,1)]">
                  <h4 className="font-extrabold text-stone-900 uppercase font-mono tracking-wider text-xs mb-3">
                    🚀 My Skillbag
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="bg-white border border-stone-900 text-stone-850 px-2.5 py-1 rounded-lg text-xs font-bold font-mono shadow-[1px_1px_0px_rgba(24,24,27,1)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {educations.length > 0 && (
                <div className="bg-white border-2 border-stone-900 p-5 rounded-2xl shadow-[3px_3px_0px_rgba(24,24,27,1)]">
                  <h4 className="font-extrabold text-stone-900 uppercase font-mono tracking-wider text-xs mb-4">
                    🏫 School / College
                  </h4>
                  <div className="space-y-4">
                    {educations.map((edu) => (
                      <div key={edu.id} className="space-y-1">
                        <span className="text-[9px] font-bold font-mono text-[#5F6368] bg-yellow-100 px-1.5 py-0.5 rounded border border-yellow-250">
                          {edu.startDate} – {edu.endDate}
                        </span>
                        <h5 className="font-extrabold text-stone-900 text-xs mt-1">
                          {edu.degree}
                        </h5>
                        <p className="text-[11px] text-stone-500 font-bold">{edu.department}</p>
                        <p className="text-[11px] text-stone-400 font-medium">{edu.institution}</p>
                        {edu.grade && (
                          <div className="text-[10px] text-indigo-500 font-bold">GPA: {edu.grade}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications Badge */}
              {certificates.length > 0 && (
                <div className="bg-white border-2 border-stone-900 p-5 rounded-2xl shadow-[3px_3px_0px_rgba(24,24,27,1)]">
                  <h4 className="font-extrabold text-stone-900 uppercase font-mono tracking-wider text-xs mb-3">
                    🏆 Certs & Medals
                  </h4>
                  <div className="space-y-3">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="text-xs min-w-0 border-b border-stone-100 pb-2 last:border-0 last:pb-0 font-medium">
                        <div className="font-extrabold text-stone-900 flex items-start justify-between gap-1.5 w-full">
                          <span className="break-words leading-snug">{cert.title}</span>
                          {cert.credentialUrl && (
                            <a href={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 mt-0.5">
                              <ExternalLink className="w-2.5 h-2.5 text-stone-400 hover:text-stone-900" />
                            </a>
                          )}
                        </div>
                        <p className="text-[10px] text-stone-400 mt-0.5">{cert.issuer} • {cert.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 4.5. ULTRA PREMIUM TEMPLATES ---

  // --- GLASSMORPHISM ELITE TEMPLATE ---
  if (template === "glassmorphism-elite") {
    return (
      <div className="bg-[#FAF9FB] text-stone-700 min-h-screen font-sans relative overflow-hidden pb-24 selection:bg-cyan-200/30">
        {/* Ambient Glowing Blobs */}
        <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-cyan-200/30 blur-[90px] pointer-events-none"></div>
        <div className="absolute top-64 right-10 w-96 h-96 rounded-full bg-yellow-400/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-purple-200/20 blur-[90px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
          {/* Floating Glass Header/Navbar */}
          <header className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(31,38,135,0.04)] mb-12 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/50 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              {basicDetails.avatarUrl ? (
                <img 
                  src={basicDetails.avatarUrl} 
                  alt={basicDetails.fullName} 
                  className="w-24 h-24 rounded-2xl object-cover border border-white/80 shadow-md bg-white/20 hover:rotate-3 transition-transform"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-400 to-yellow-300 flex items-center justify-center text-white text-3xl font-black shadow-inner">
                  ✨
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold font-mono tracking-widest text-[#F4B400] uppercase bg-stone-900 border border-stone-800 px-3 py-1 rounded-full inline-block mb-2 font-black">
                  Elite Glass Interface
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900 bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent">
                  {basicDetails.fullName || "Jane Elite"}
                </h1>
                <p className="text-stone-500 font-mono text-xs uppercase tracking-wider mt-1 font-bold">
                  ✦ {basicDetails.tagline || "Creative Technologist"}
                </p>
                {basicDetails.summary && (
                  <p className="text-stone-600 italic text-xs max-w-sm mt-2.5 pl-3 border-l-2 border-cyan-450 font-medium text-left">
                    "{basicDetails.summary}"
                  </p>
                )}
              </div>
            </div>

            <div className="text-xs text-[#5F6368] font-bold space-y-2 text-center md:text-right font-mono border-t md:border-t-0 border-stone-200/50 pt-4 md:pt-0 w-full md:w-auto">
              {basicDetails.email && (
                <div className="flex items-center md:justify-end gap-2 text-stone-600 hover:text-stone-900 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{basicDetails.email}</span>
                </div>
              )}
              {basicDetails.phone && (
                <div className="flex items-center md:justify-end gap-2">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{basicDetails.phone}</span>
                </div>
              )}
              {basicDetails.location && (
                <div className="flex items-center md:justify-end gap-2">
                  <MapPin className="w-3.5 h-3.5 text-yellow-500" />
                  <span>{basicDetails.location}</span>
                </div>
              )}
              {basicDetails.languages && (
                <div className="flex items-center md:justify-end gap-2 col-span-1">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Speaks: {basicDetails.languages}</span>
                </div>
              )}
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left side columns */}
            <div className="lg:col-span-5 space-y-8">
              {/* Biography Section */}
              {basicDetails.aboutMe && (
                <div className="bg-white/45 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:bg-white/60 transition-colors">
                  <h3 className="text-xs font-bold font-mono tracking-widest text-[#F4B400] uppercase mb-4 border-b border-stone-200/40 pb-2">
                    Biography
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line font-medium text-justify">
                    {basicDetails.aboutMe}
                  </p>
                </div>
              )}

              {/* Skills Section */}
              {skills.length > 0 && (
                <div className="bg-white/45 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:bg-white/60 transition-colors">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-600 mb-4 border-b border-stone-200/40 pb-2">
                    Skilled Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 bg-white/50 backdrop-blur-sm text-stone-700 rounded-xl text-xs font-semibold border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education section */}
              {educations.length > 0 && (
                <div className="bg-white/45 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.03)] pb-8">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#F4B400] mb-6 border-b border-stone-200/40 pb-2">
                    Education Profile
                  </h3>
                  <div className="space-y-6">
                    {educations.map((edu) => (
                      <div key={edu.id} className="relative pl-6 border-l-2 border-cyan-100">
                        <span className="absolute -left-1.5 top-1 bg-cyan-400 w-2.5 h-2.5 rounded-full border border-white"></span>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold font-mono text-cyan-600 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded">
                            {edu.startDate} – {edu.endDate}
                          </span>
                          <h4 className="font-extrabold text-[#1F2937] text-sm mt-2">{edu.degree}</h4>
                          <p className="text-xs text-stone-500 font-semibold">{edu.department}</p>
                          <p className="text-[11px] text-stone-400 font-mono font-medium">{edu.institution} {edu.grade ? `• GPA: ${edu.grade}` : ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right side columns */}
            <div className="lg:col-span-7 space-y-8">
              {/* Experience timeline */}
              {experiences.length > 0 && (
                <div className="bg-white/45 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:bg-white/60 transition-colors">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#F4B400] mb-6 border-b border-stone-200/40 pb-2">
                    Professional Timeline
                  </h3>
                  <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-stone-200/50">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="relative pl-8 group">
                        {/* Dot */}
                        <div className="absolute left-1 top-1.5 w-4 h-4 rounded-full border-2 border-white bg-cyan-400 group-hover:bg-[#F4B400] transition-colors shadow-sm"></div>
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap justify-between items-center gap-2">
                            <h4 className="font-extrabold text-stone-900 text-base">{exp.role}</h4>
                            <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200/40">
                              {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-cyan-600 font-mono uppercase">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                          <p className="text-sm text-stone-600 whitespace-pre-line leading-relaxed pt-1.5 font-medium">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Glass Grid */}
              {projects.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-600 ml-1">
                    Featured Creations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((proj) => (
                      <div key={proj.id} className="bg-white/45 backdrop-blur-md border border-white/60 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.02)] overflow-hidden hover:scale-[1.02] hover:bg-white/65 hover:border-cyan-300 transition-all duration-300 group flex flex-col justify-between">
                        <div>
                          {/* Floating badge inside top banner */}
                          <div className={`h-24 bg-gradient-to-tr ${proj.imageTheme || 'from-cyan-305 to-yellow-205'} p-4 flex items-end relative overflow-hidden`}>
                            <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[8px] bg-white/20 backdrop-blur-xl border border-white/30 text-white font-mono font-bold uppercase tracking-wider">
                              WORK
                            </div>
                            <h4 className="text-stone-900 font-black text-xs uppercase font-mono tracking-wider bg-white/75 backdrop-blur-md px-3 py-1 rounded-xl shadow-sm border border-white/40 break-words max-w-full leading-snug">
                              {proj.title}
                            </h4>
                          </div>

                          <div className="p-5 space-y-3">
                            <p className="text-xs text-stone-500 leading-relaxed font-semibold line-clamp-3">
                              {proj.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {proj.tags.map((tg, idx) => (
                                <span key={idx} className="bg-cyan-50/70 border border-cyan-100 text-cyan-700 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                                  {tg}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="px-5 pb-4 pt-2 flex items-center justify-between border-t border-stone-200/30 text-xs font-mono font-bold">
                          {proj.githubUrl && (
                            <a href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`} target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-cyan-600 transition-all flex items-center gap-1">
                              <Github className="w-3.5 h-3.5" /> Codebase
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a href={proj.liveUrl.startsWith('http') ? proj.liveUrl : `https://${proj.liveUrl}`} target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-[#F4B400] transition-all flex items-center gap-1 ml-auto">
                              <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonial Widget */}
              <div className="bg-gradient-to-tr from-[#F4B400]/5 to-cyan-500/5 backdrop-blur-md border border-white/70 p-6 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
                <p className="text-xs font-mono font-bold text-cyan-600 tracking-wider mb-2">★ CLIENT TESTIMONIAL</p>
                <blockquote className="text-stone-600 italic font-medium text-xs leading-relaxed">
                  "One of the sturdiest visual layout architectures I have seen. Clear attention to structural beauty, beautiful layout grids, and premium micro-interactions."
                </blockquote>
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  <span className="text-[10px] font-mono text-stone-500 font-bold uppercase">Senior Creative Recruiter, San Francisco</span>
                </div>
              </div>

              {/* Certifications Row */}
              {certificates.length > 0 && (
                <div className="bg-white/45 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#F4B400] mb-4 border-b border-stone-200/40 pb-2">
                    Verified Accreditations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="p-3 bg-white/50 border border-stone-200/30 rounded-2xl flex items-start gap-2.5">
                        <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-600 mt-0.5">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 break-words leading-snug">{cert.title}</h4>
                          <p className="text-[10px] text-stone-400 font-medium">{cert.issuer} • {cert.date}</p>
                          {cert.credentialUrl && (
                            <a href={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`} target="_blank" rel="noopener noreferrer" className="text-[9px] text-[#F4B400] font-black uppercase tracking-wider block mt-1 hover:underline">
                              External Link ↗
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social connections */}
          <div className="flex justify-center gap-3 mt-12 bg-white/30 p-4 rounded-3xl border border-white/40 max-w-xs mx-auto backdrop-blur-md">
            {socialLinks.github && (
              <a href={socialLinks.github.startsWith('http') ? socialLinks.github : `https://${socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-cyan-100 text-stone-700 p-2.5 rounded-xl transition-all border border-stone-200" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin.startsWith('http') ? socialLinks.linkedin : `https://${socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-cyan-100 text-stone-700 p-2.5 rounded-xl transition-all border border-stone-200" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram.startsWith('http') ? socialLinks.instagram : `https://${socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-cyan-100 text-stone-700 p-2.5 rounded-xl transition-all border border-stone-200" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {socialLinks.website && (
              <a href={socialLinks.website.startsWith('http') ? socialLinks.website : `https://${socialLinks.website}`} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-cyan-100 text-stone-700 p-2.5 rounded-xl transition-all border border-stone-200" title="Website">
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- BENTO GRID CREATOR TEMPLATE ---
  if (template === "bento-grid-creator") {
    return (
      <div className="bg-[#F6F5F0] text-stone-850 min-h-screen font-sans p-6 md:p-12 selection:bg-yellow-100 pb-20">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Main Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Intro & Persona (col-span-8) */}
            <div className="md:col-span-8 bg-white border-2 border-stone-900 rounded-[32px] p-6 md:p-8 shadow-[6px_6px_0px_0px_#18181B] flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:-translate-y-0.5 transition-transform">
              {basicDetails.avatarUrl ? (
                <img 
                  src={basicDetails.avatarUrl} 
                  alt={basicDetails.fullName} 
                  className="w-28 h-28 md:w-32 md:h-32 rounded-3xl object-cover border-2 border-stone-900 shadow-[3px_3px_0px_0px_#18181B] bg-sky-50"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-28 h-28 md:w-32 md:h-32 bg-sky-100 rounded-3xl flex items-center justify-center font-bold text-5xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_#18181B]">
                  👋
                </div>
              )}
              <div className="flex-1 text-center sm:text-left space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-[#F4B400] text-stone-950 text-[10px] font-black uppercase font-mono px-3 py-1 rounded-full border-2 border-stone-900">
                  <span className="w-2.5 h-2.5 bg-white rounded-full inline-block animate-pulse"></span>
                  CREATOR HUB
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-stone-900">
                  {basicDetails.fullName || "Jane Creator"}
                </h1>
                <p className="text-[#5F6368] font-semibold text-sm leading-relaxed max-w-lg">
                  ⚡ {basicDetails.tagline || "Digital product artisan crafting high-fidelity design grids and responsive spaces."}
                </p>
                {basicDetails.summary && (
                  <p className="text-stone-600 italic text-xs max-w-lg border-l-2 border-[#F4B400] pl-3">
                    "{basicDetails.summary}"
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono font-extrabold text-stone-500 pt-1">
                  {basicDetails.location && <span className="bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-xl text-sky-850">📍 {basicDetails.location}</span>}
                  {basicDetails.email && <span className="bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-xl">📧 {basicDetails.email}</span>}
                  {basicDetails.languages && <span className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl text-amber-900">🌐 Speaks: {basicDetails.languages}</span>}
                </div>
              </div>
            </div>

            {/* Quick Connect / Social Channels (col-span-4) */}
            <div className="md:col-span-4 bg-[#EBE7DF] border-2 border-stone-900 rounded-[32px] p-6 shadow-[6px_6px_0px_0px_#18181B] flex flex-col justify-between group hover:-translate-y-0.5 transition-transform">
              <div className="space-y-1">
                <span className="text-[9px] font-bold font-mono uppercase tracking-widest text-stone-500 font-extrabold">DIGITAL RESIDENCE</span>
                <h3 className="text-lg font-black text-stone-900">Connect Hub</h3>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">Direct links to my external profiles and feeds.</p>
              </div>
              
              <div className="mt-4 flex gap-2 justify-start flex-wrap">
                {socialLinks.github && (
                  <a href={socialLinks.github.startsWith('http') ? socialLinks.github : `https://${socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-[#F4B400] text-stone-900 p-2.5 rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_0px_#18181B] transition-all inline-block">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin.startsWith('http') ? socialLinks.linkedin : `https://${socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-[#F4B400] text-stone-900 p-2.5 rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_0px_#18181B] transition-all inline-block">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram.startsWith('http') ? socialLinks.instagram : `https://${socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-[#F4B400] text-stone-900 p-2.5 rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_0px_#18181B] transition-all inline-block">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.website && (
                  <a href={socialLinks.website.startsWith('http') ? socialLinks.website : `https://${socialLinks.website}`} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-[#F4B400] text-stone-900 p-2.5 rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_0px_#18181B] transition-all inline-block">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Biography Element (col-span-4) */}
            {basicDetails.aboutMe && (
              <div className="md:col-span-4 bg-white border-2 border-stone-900 rounded-[32px] p-6 shadow-[6px_6px_0px_0px_#18181B] flex flex-col justify-between group hover:-translate-y-0.5 transition-transform">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-[#F4B400] uppercase bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200 inline-block font-black">
                    BIOGRAPHY
                  </span>
                  <p className="text-stone-600 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium text-justify">
                    {basicDetails.aboutMe}
                  </p>
                </div>
                <div className="text-[10px] text-stone-400 font-bold font-mono mt-4 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span>READ STORY</span>
                  <span>✦</span>
                </div>
              </div>
            )}

            {/* Skills grid (col-span-8) */}
            <div className="md:col-span-8 bg-sky-50 border-2 border-stone-900 rounded-[32px] p-6 shadow-[6px_6px_0px_0px_#18181B] flex flex-col justify-between group hover:-translate-y-0.5 transition-transform">
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white/60 p-1.5 rounded-2xl border border-stone-200/50">
                  <span className="text-[10px] font-black font-mono uppercase bg-stone-900 text-white px-3 py-1 rounded-xl">
                    CORE STRENGTHS
                  </span>
                  <span className="text-[10px] font-mono font-bold text-stone-500 mr-2">GRID VIEW</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {skills.length > 0 ? skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="bg-white border-2 border-stone-900 text-stone-900 px-3 py-2 rounded-2xl text-xs font-black font-mono shadow-[2px_2px_0px_0px_#18181B] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#18181B] transition-all cursor-pointer"
                    >
                      🚀 {skill}
                    </span>
                  )) : (
                    <p className="text-xs text-stone-500">No skills added yet.</p>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-stone-500 font-serif font-semibold mt-6 flex items-center gap-1">
                <span>Updated recently with certified expertise domains.</span>
              </div>
            </div>

            {/* Experience timeline (col-span-8) */}
            {experiences.length > 0 && (
              <div className="md:col-span-8 bg-white border-2 border-stone-900 rounded-[32px] p-6 shadow-[6px_6px_0px_0px_#18181B] group hover:-translate-y-0.5 transition-transform">
                <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-6">
                  <h3 className="text-md font-bold font-mono text-stone-900 uppercase">💼 Professional Timeline</h3>
                  <span className="text-xs text-[#F4B400] font-bold">HISTORY LOG ({experiences.length})</span>
                </div>
                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-6 border-l-2 border-stone-200 py-1 hover:border-[#F4B400] transition-colors">
                      <span className="absolute -left-1.5 top-1 bg-stone-900 w-2.5 h-2.5 rounded-full ring-4 ring-white"></span>
                      <div className="space-y-1">
                        <div className="flex flex-wrap justify-between items-baseline gap-2">
                          <h4 className="font-extrabold text-[#1F2937] text-md">{exp.role}</h4>
                          <span className="text-[10px] font-bold font-mono text-stone-500 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-lg">
                            {exp.startDate} - {exp.isCurrent ? "Active" : exp.endDate}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#F4B400] font-mono">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                        <p className="text-xs text-stone-500 font-semibold leading-relaxed pt-1">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aesthetic quote bubble (col-span-4) */}
            <div className="md:col-span-4 bg-yellow-100 border-2 border-stone-900 rounded-[32px] p-6 shadow-[6px_6px_0px_0px_#18181B] flex flex-col justify-between group hover:-translate-y-0.5 transition-transform">
              <div className="space-y-4">
                <span className="text-[10px] font-bold font-mono uppercase bg-white border border-yellow-300 px-2.5 py-1 rounded-lg inline-block text-stone-700 font-extrabold">TESTIMONIAL</span>
                <p className="text-stone-800 italic font-medium text-xs leading-relaxed">
                  "Phenomenal workflow execution. This system structures layout cards elegantly, giving recruiters instantaneous access to dynamic credentials."
                </p>
              </div>
              <div className="pt-4 border-t border-yellow-200/50 mt-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-stone-900 rounded-full"></div>
                <span className="text-[9px] font-bold font-mono uppercase text-stone-600">Product Manager • venture network</span>
              </div>
            </div>

            {/* Projects Grid (col-span-12) */}
            {projects.length > 0 && (
              <div className="md:col-span-12 bg-white border-2 border-stone-900 rounded-[32px] p-6 md:p-8 shadow-[6px_6px_0px_0px_#18181B]">
                <div className="flex justify-between items-center border-b border-stone-150 pb-4 mb-6">
                  <h3 className="text-lg font-black font-mono uppercase tracking-wider text-stone-900">🛠️ Dynamic Creations Showcase</h3>
                  <span className="text-xs text-sky-600 font-extrabold uppercase tracking-wider bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">Selected Works ({projects.length})</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-[#FAF9F5] border-2 border-stone-900 rounded-2xl overflow-hidden shadow-[4px_4px_0px_rgba(24,24,27,1)] hover:shadow-[1px_1px_0px_rgba(24,24,27,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex flex-col justify-between group">
                      <div className={`h-24 bg-gradient-to-r ${proj.imageTheme || 'from-sky-300 to-yellow-200'} p-3 border-b-2 border-stone-900 flex items-end relative`}>
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[8px] uppercase bg-stone-900 text-white font-mono font-bold tracking-wider">
                          POD
                        </div>
                        <h4 className="font-extrabold text-xs text-white bg-stone-900 px-2 py-1 rounded border border-stone-900 break-words max-w-full leading-snug">
                          {proj.title}
                        </h4>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-stone-500 font-semibold mb-3 line-clamp-3 leading-relaxed">
                            {proj.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {proj.tags.map((tg, idx) => (
                              <span key={idx} className="bg-white text-stone-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-stone-200">
                                #{tg}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-4 text-xs font-mono font-extrabold pt-2 border-t border-stone-200">
                          {proj.githubUrl && (
                            <a href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`} target="_blank" rel="noopener noreferrer" className="text-[#F4B400] hover:underline flex items-center gap-1">
                              <Github className="w-3 h-3" /> git
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a href={proj.liveUrl.startsWith('http') ? proj.liveUrl : `https://${proj.liveUrl}`} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline flex items-center gap-1 ml-auto">
                              <ExternalLink className="w-3 h-3" /> live
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Certs Pod block (col-span-12) */}
            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* College Card */}
              {educations.length > 0 && (
                <div className="md:col-span-1 bg-[#EEF2F6] border-2 border-stone-900 rounded-[24px] p-5 shadow-[4px_4px_0px_0px_#18181B] group hover:-translate-y-0.5 transition-transform flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[9px] font-bold font-mono uppercase text-stone-500 font-extrabold">SCHOLARSHIP STATUS</span>
                    <h4 className="text-sm font-black text-stone-900 uppercase">Institutions</h4>
                    <div className="space-y-4">
                      {educations.map((edu) => (
                        <div key={edu.id} className="space-y-1">
                          <p className="text-[10px] font-bold font-mono text-[#F4B400]">{edu.startDate} - {edu.endDate}</p>
                          <h5 className="font-extrabold text-stone-900 text-xs">{edu.degree}</h5>
                          <p className="text-[11px] text-stone-500 font-semibold">{edu.department}</p>
                          <p className="text-[11px] text-stone-400 font-medium">{edu.institution}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Accreditations and awards (col-span-2) */}
              {certificates.length > 0 && (
                <div className="md:col-span-2 bg-[#FAF8F5] border-2 border-stone-900 rounded-[24px] p-5 shadow-[4px_4px_0px_0px_#18181B] group hover:-translate-y-0.5 transition-transform">
                  <span className="text-[9px] font-bold font-mono uppercase text-[#F4B400] font-extrabold">HONORS & APPOINTMENTS</span>
                  <h4 className="text-sm font-black text-stone-900 uppercase mt-1 mb-4 font-extrabold">Credentials Ledger</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="p-3 bg-white border-2 border-stone-900 rounded-xl flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-extrabold text-stone-900 break-words leading-snug">{cert.title}</p>
                          <p className="text-[10px] text-stone-400 mt-0.5 font-semibold">{cert.issuer} • {cert.date}</p>
                        </div>
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-sky-600 font-black uppercase hover:underline ml-auto flex-shrink-0">
                            VERIFY
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    );
  }

  // --- LUXURY DARK GOLD TEMPLATE ---
  if (template === "luxury-dark-gold") {
    return (
      <div className="bg-[#0A0A0A] text-[#D4D4D8] min-h-screen font-serif relative overflow-hidden pb-24 selection:bg-[#F4B400]/30 selection:text-white">
        
        {/* Soft Golden Ambient Highlights */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#F4B400]/5 rounded-full blur-[140px] pointer-events-none font-extrabold"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-yellow-600/5 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 py-16 relative z-10 space-y-16">
          
          {/* Main Cinematic Header */}
          <header className="border-b border-zinc-900 pb-12 flex flex-col items-center text-center space-y-6">
            {basicDetails.avatarUrl ? (
              <img 
                src={basicDetails.avatarUrl} 
                alt={basicDetails.fullName} 
                className="w-28 h-28 rounded-full object-cover ring-2 ring-[#F4B400] shadow-[0_0_15px_rgba(244,180,0,0.15)] bg-zinc-950"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-zinc-950 border-2 border-[#F4B400] flex items-center justify-center font-bold text-3xl text-[#F4B400]">
                👑
              </div>
            )}
            
            <div className="space-y-3">
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#F4B400] uppercase font-black border border-[#F4B400]/25 px-4 py-1.5 bg-[#F4B400]/5 rounded-full inline-block font-extrabold">
                PREMIUM DIGITAL MONARCH
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white font-serif">
                {basicDetails.fullName || "Gilded Entrepreneur"}
              </h1>
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.14em] font-extrabold">
                {basicDetails.tagline || "Artisan Structuring Premium Enterprise Designs"}
              </p>
              {basicDetails.summary && (
                <p className="text-zinc-400 italic text-xs max-w-lg mx-auto pt-2 border-t border-zinc-900 leading-relaxed">
                  "{basicDetails.summary}"
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-zinc-400 font-sans font-semibold pt-4 w-full">
              {basicDetails.email && (
                <span className="flex items-center gap-1.5 hover:text-[#F4B400] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#F4B400]" /> {basicDetails.email}
                </span>
              )}
              {basicDetails.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#F4B400]/80" /> {basicDetails.phone}
                </span>
              )}
              {basicDetails.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F4B400]/80" /> {basicDetails.location}
                </span>
              )}
              {basicDetails.languages && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#F4B400]/80" /> Speaks: {basicDetails.languages}
                </span>
              )}
            </div>
            
            <div className="pt-2">
              <div className="flex gap-2 justify-center flex-wrap">
                {socialLinks.github && (
                  <a href={socialLinks.github.startsWith('http') ? socialLinks.github : `https://${socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="bg-zinc-950 hover:bg-[#F4B400]/10 text-zinc-400 hover:text-[#F4B400] p-2.5 rounded-full transition-all border border-zinc-900 inline-block" title="GitHub">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin.startsWith('http') ? socialLinks.linkedin : `https://${socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="bg-zinc-950 hover:bg-[#F4B400]/10 text-zinc-400 hover:text-[#F4B400] p-2.5 rounded-full transition-all border border-zinc-900 inline-block" title="LinkedIn">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram.startsWith('http') ? socialLinks.instagram : `https://${socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="bg-zinc-950 hover:bg-[#F4B400]/10 text-zinc-400 hover:text-[#F4B400] p-2.5 rounded-full transition-all border border-zinc-900 inline-block" title="Instagram">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.website && (
                  <a href={socialLinks.website.startsWith('http') ? socialLinks.website : `https://${socialLinks.website}`} target="_blank" rel="noopener noreferrer" className="bg-zinc-950 hover:bg-[#F4B400]/10 text-zinc-400 hover:text-[#F4B400] p-2.5 rounded-full transition-all border border-zinc-900 inline-block" title="Website">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </header>

          {/* Premium Statement (Biography) */}
          {basicDetails.aboutMe && (
            <section className="space-y-4">
              <h2 className="text-[10px] font-mono tracking-widest text-[#F4B400] uppercase font-bold text-center">PERSONAL STATEMENT</h2>
              <div className="bg-gradient-to-b from-zinc-950 to-zinc-900 border-t-2 border-[#F4B400]/40 p-8 rounded-2xl shadow-xl text-zinc-300 leading-relaxed text-sm md:text-base whitespace-pre-line text-center italic max-w-2xl mx-auto font-medium">
                "{basicDetails.aboutMe}"
              </div>
            </section>
          )}

          {/* Professional Work History */}
          {experiences.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-[10px] font-mono tracking-widest text-[#F4B400] uppercase font-bold text-center font-extrabold">APPOINTMENTS TIMELINE</h2>
              <div className="space-y-10 relative before:absolute before:inset-y-0 before:left-1/2 before:w-[1px] before:bg-zinc-800/40 hidden md:block">
                {experiences.map((exp, idx) => {
                  const isLeft = idx % 2 === 0;
                  return (
                    <div key={exp.id} className="relative flex justify-between items-center w-full">
                      <div className={`w-5/12 ${isLeft ? "text-right pr-6" : "order-last text-left pl-6"}`}>
                        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-2 hover:border-[#F4B400]/25 transition-colors">
                          <span className="text-[9px] font-mono text-[#F4B400] font-black uppercase tracking-wider">{exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}</span>
                          <h3 className="text-md font-bold text-white font-serif">{exp.role}</h3>
                          <p className="text-xs text-zinc-400 font-sans font-semibold">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                          <p className="text-xs text-zinc-500 leading-relaxed pt-2 font-sans font-medium">{exp.description}</p>
                        </div>
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[#F4B400] rounded-full border border-[#0A0A0A] shadow-[0_0_8px_#F4B400]"></div>
                      <div className="w-5/12"></div>
                    </div>
                  );
                })}
              </div>
              
              {/* Responsive fallback for mobile */}
              <div className="space-y-6 md:hidden">
                {experiences.map((exp) => (
                  <div key={exp.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 relative pl-8 border-l-2 border-l-[#F4B400] space-y-1">
                    <span className="text-[9px] font-mono text-[#F4B400] font-black uppercase tracking-wider">{exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}</span>
                    <h3 className="text-md font-bold text-white font-serif">{exp.role}</h3>
                    <p className="text-xs text-zinc-400 font-sans font-semibold">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                    <p className="text-xs text-zinc-500 whitespace-pre-line leading-relaxed pt-2 font-sans font-medium">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Selected Projects */}
          {projects.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-[10px] font-mono tracking-widest text-[#F4B400] uppercase font-bold text-center font-extrabold">GILDED CREATIONS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-gradient-to-b from-zinc-950 to-zinc-900/50 rounded-2xl border border-zinc-900 p-6 flex flex-col justify-between hover:border-[#F4B400]/40 transition-all duration-300 shadow-xl group">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-zinc-600 font-bold tracking-wider uppercase">PORT LINK</span>
                        <h3 className="text-lg font-bold text-white font-serif group-hover:text-[#F4B400] transition-colors">{proj.title}</h3>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans font-semibold">{proj.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.tags.map((tg, idx) => (
                          <span key={idx} className="bg-zinc-900 text-zinc-300 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded border border-zinc-800">
                            {tg}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-4 border-t border-zinc-900 pt-4 mt-6 text-xs font-mono font-bold">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                          codebase
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl.startsWith('http') ? proj.liveUrl : `https://${proj.liveUrl}`} target="_blank" rel="noopener noreferrer" className="text-[#F4B400] hover:text-[#FFD54F] transition-colors ml-auto">
                          production ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Combined Skills Core & Educational ledger */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Skills Core */}
            {skills.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-[10px] font-mono tracking-widest text-[#F4B400] uppercase font-bold font-extrabold">EXPERTISE SPHERE</h2>
                <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-3">
                  <div className="font-serif italic text-white text-xs mb-3 font-semibold">Dynamically verified capability domains</div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="bg-zinc-900 text-[#F4B400] px-3 py-1.5 rounded-lg text-xs font-mono border border-[#F4B400]/10 hover:border-[#F4B400]/40 transition-colors font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Scholastic Ledger */}
            {educations.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-[10px] font-mono tracking-widest text-[#F4B400] uppercase font-bold font-extrabold">SCHOLASTIC PROGRESS</h2>
                <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-6">
                  {educations.map((edu) => (
                    <div key={edu.id} className="border-l border-zinc-800 pl-4 py-1">
                      <p className="text-[9px] font-mono text-[#F4B400]/80">{edu.startDate} – {edu.endDate}</p>
                      <h4 className="font-bold text-sm text-white font-serif mt-0.5">{edu.degree}</h4>
                      <p className="text-xs text-zinc-400 font-sans font-semibold">{edu.department}</p>
                      <p className="text-[11px] text-zinc-500 font-mono mt-1">{edu.institution} {edu.grade ? `• GPA: ${edu.grade}` : ""}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Certifications Row */}
          {certificates.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-[10px] font-mono tracking-widest text-[#F4B400] uppercase font-bold text-center font-extrabold">COMMENDATIONS LEDGER</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl flex items-center justify-between">
                    <div className="min-w-0 pr-2 space-y-0.5 animate-pulse-slow">
                      <p className="text-xs font-bold text-white break-words leading-snug">{cert.title}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{cert.issuer} • {cert.date}</p>
                    </div>
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="p-1 px-3 border border-zinc-800 rounded text-[9px] font-mono font-bold text-[#F4B400] hover:bg-[#F4B400]/5 hover:border-[#F4B400] transition-colors ml-auto flex-shrink-0">
                        VERIFY
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    );
  }

  // --- 9. STUDIO GHIBLI INSPIRATIONAL COZY TEMPLATE ---
  if (template === "ghibli-cozy") {
    const isNight = isNightMode;
    const bgTheme = isNight ? "bg-[#181411] text-[#E6D8C2]" : "bg-[#FBF6EE] text-[#4A3B32]";
    const secText = isNight ? "text-[#C2B29D]" : "text-[#735D52]";
    const cardBg = isNight ? "bg-[#251F1B] border-[#383029]" : "bg-white border-[#E9E1D2]";
    const titleColor = isNight ? "text-[#FADFA6]" : "text-[#2A1D13]";
    const paperBg = isNight ? "bg-[#2E2721] border-[#44382E]" : "bg-[#FDFBF7] border-[#EEE5D5]";
    const accentGreen = isNight ? "bg-[#334637] border-[#425C47] text-[#A6FCB8]" : "bg-[#E6F3E9] border-[#C3DCC9] text-[#2E5E3D]";
    const accentAmber = isNight ? "bg-[#3B2C1A] border-[#57432C] text-[#FCD28C]" : "bg-[#FCF5E3] border-[#EADBBF] text-[#8C6239]";
    const badgeBg = isNight ? "bg-[#332A22] border-[#4D3F33] text-[#FCD28C]" : "bg-[#F5ECE1] border-[#E2D4C3] text-[#7A5B40]";
    
    return (
      <div className={`min-h-screen ${bgTheme} font-serif transition-colors duration-500 pb-24 relative overflow-hidden`}>
        {/* Warm local CSS styles for tea steam animation */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes ghibliSteam {
            0% { transform: translateY(0) scale(1) translateX(0); opacity: 0; }
            30% { opacity: 0.6; }
            100% { transform: translateY(-16px) scale(1.3) translateX(3px); opacity: 0; }
          }
          .animate-ghibli-steam {
            animation: ghibliSteam 3.2s infinite ease-out;
          }
        `}} />

        {/* Ambient background glow from night mode desk lamp */}
        {isNight && (
          <div className="absolute top-24 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-[110px] pointer-events-none"></div>
        )}

        {/* Cozily Hanging Desk Lamp string toggle */}
        <div className="absolute top-0 right-4 sm:right-10 flex flex-col items-center z-50">
          <div className={`w-0.5 h-16 sm:h-24 transition-colors duration-300 ${isNight ? "bg-[#FBD28C] h-20" : "bg-stone-500"}`}></div>
          <button 
            id="ghibli-lamp-pull-string"
            onClick={() => setIsNightMode(!isNight)}
            className={`p-3 rounded-full transition-all duration-300 relative flex items-center justify-center border-2 shadow-lg hover:scale-110 cursor-pointer ${
              isNight 
                ? "bg-[#FFA834] border-[#FBD28C] text-stone-900 shadow-[0_0_20px_rgba(255,168,52,0.6)]" 
                : "bg-white border-stone-300 text-stone-700 hover:bg-stone-100"
            }`}
            title="Click String - Toggle Cozy Sunset / Midnight Lamp Mode"
          >
            {isNight ? (
              <Sun className="w-5 h-5 text-stone-950 animate-pulse" />
            ) : (
              <Moon className="w-5 h-5 text-stone-700" />
            )}
            
            {/* Visual glow overlay */}
            {isNight && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-40 h-72 bg-gradient-to-b from-[#FFA834]/15 to-transparent blur-md pointer-events-none rounded-b-full"></div>
            )}
          </button>
          <span className="text-[9px] font-mono font-bold tracking-tight mt-1 text-center scale-90 select-none opacity-60">
            {isNight ? "NIGHT MODE" : "DAY MODE"}
          </span>
        </div>

        {/* Central visual profile stage */}
        <div className="max-w-4xl mx-auto px-6 pt-16 space-y-12 relative z-10">
          
          {/* Top header retreat bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dashed border-stone-350/30">
            <div className="flex items-center gap-3">
              {/* Steaming tea illustration */}
              <div className="relative p-2.5 bg-[#FAF1E6] border border-[#E7D6C2] rounded-2xl flex items-center justify-center text-[#8C6239] shadow-xs">
                <Coffee className="w-5 h-5" />
                {/* Steam lines */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1 justify-center pointer-events-none w-full scale-90">
                  <span className="w-0.5 h-4 bg-amber-500/40 rounded-full animate-ghibli-steam" style={{ animationDelay: "0s" }}></span>
                  <span className="w-0.5 h-4 bg-amber-400/30 rounded-full animate-ghibli-steam" style={{ animationDelay: "1.4s" }}></span>
                  <span className="w-0.5 h-4 bg-amber-500/40 rounded-full animate-ghibli-steam" style={{ animationDelay: "0.7s" }}></span>
                </div>
              </div>
              <div>
                <span className={`text-[10px] font-mono font-bold tracking-widest uppercase block ${isNight ? "text-[#FCD28C]" : "text-emerald-700"}`}>
                  COZY RETREAT CANVAS
                </span>
                <p className="text-[11px] font-sans font-semibold text-stone-500">
                  {isNight ? "Warm fireplace logs & code study" : "Mellow morning breeze & hot herbal tea"}
                </p>
              </div>
            </div>

            {/* Quick Contact Badge */}
            <div className="flex items-center gap-3 text-xs font-sans text-stone-500">
              {basicDetails.email && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5" /> {basicDetails.email}
                </span>
              )}
            </div>
          </div>

          {/* Arched Window to the Serene Sky Banner */}
          <div className="relative rounded-3xl overflow-hidden h-64 md:h-80 border-4 border-[#5C4533] shadow-md bg-sky-200">
            <img 
              src="https://images.unsplash.com/photo-1518655061766-48f23af9307f?auto=format&fit=crop&w=1200&q=80" 
              alt="Ghibli inspired golden window" 
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isNight ? "brightness-[0.4] saturate-[0.8] contrast-[1.1]" : "brightness-[0.95] saturate-[1.05]"}`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Arched Window bars for look and feel */}
            <div className="absolute inset-x-0 top-0 h-1/2 border-b-2 border-[#5C4533]/20 pointer-events-none"></div>
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-[#5C4533]/20 pointer-events-none"></div>
            
            <div className="absolute top-4 left-6 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[10px] font-mono tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>SKYWINDOW OF ASPIRATIONS</span>
            </div>

            {/* User credentials overlapping the sky */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1 text-white">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-serif drop-shadow-md">
                  {basicDetails.fullName || "Aesthetic Traveler"}
                </h1>
                <p className="text-sm font-sans tracking-wide text-amber-100 drop-shadow-sm font-medium">
                  {basicDetails.tagline || "Creative Innovator & Generalist"}
                </p>
                {basicDetails.summary && (
                  <p className="text-xs text-stone-200 mt-1 max-w-md drop-shadow-sm italic font-medium leading-normal">
                    "{basicDetails.summary}"
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {basicDetails.location && (
                  <span className="bg-[#4E3B2B]/75 backdrop-blur-md text-[#FFFDF9] rounded-xl px-3 py-1.5 text-xs font-sans tracking-wide border border-[#6E543F]/40 flex items-center gap-1">
                    📍 {basicDetails.location}
                  </span>
                )}
                {basicDetails.languages && (
                  <span className="bg-[#4E3B2B]/75 backdrop-blur-md text-[#FFFDF9] rounded-xl px-3 py-1.5 text-xs font-sans tracking-wide border border-[#6E543F]/40 flex items-center gap-1">
                    🌐 Speaks: {basicDetails.languages}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT SIDEBAR PANEL: Profile & Scholastic Logs */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Profile Frame with Ghibli Retro Grayscale effect */}
              {basicDetails.avatarUrl && (
                <div className={`p-3 rounded-2xl border-2 ${cardBg} flex justify-center shadow-xs transition-colors duration-300`}>
                  <img 
                    src={basicDetails.avatarUrl} 
                    alt={basicDetails.fullName} 
                    className={`w-full max-w-[200px] aspect-square object-cover rounded-xl border border-stone-300/40 transition-all duration-300 ${isNight ? "sepia-[0.3]" : "sepia-[0.1]"}`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Scholastic Chronicles */}
              {educations.length > 0 && (
                <div className={`p-5 rounded-2xl border-2 ${cardBg} shadow-xs space-y-4 transition-colors duration-300`}>
                  <h3 className={`text-xs font-mono font-extrabold uppercase tracking-widest ${isNight ? "text-[#FCD28C]" : "text-[#7A5B40]"} flex items-center gap-1.5`}>
                    <GraduationCap className="w-4 h-4 text-emerald-600" /> Education Scroll
                  </h3>
                  <div className="space-y-4">
                    {educations.map((edu) => (
                      <div key={edu.id} className="space-y-1 font-sans">
                        <span className="text-[10px] font-mono font-bold text-stone-500 block">
                          {edu.startDate} – {edu.endDate}
                        </span>
                        <h4 className={`font-extrabold text-xs transition-colors ${isNight ? "text-amber-100" : "text-stone-900"}`}>
                          {edu.degree}
                        </h4>
                        <p className={`text-[11px] font-medium ${secText}`}>
                          {edu.institution}
                        </p>
                        {edu.grade && (
                          <span className="text-[9px] bg-stone-100 dark:bg-stone-800 text-stone-500 px-1.5 py-0.5 rounded border border-stone-200/50">
                            GPA / Percentage: {edu.grade}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Beads Sphere */}
              {skills.length > 0 && (
                <div className={`p-5 rounded-2xl border-2 ${cardBg} shadow-xs space-y-4 transition-colors duration-300`}>
                  <h3 className={`text-xs font-mono font-extrabold uppercase tracking-widest ${isNight ? "text-[#FCD28C]" : "text-[#7A5B40]"} flex items-center gap-1.5`}>
                    <Sparkles className="w-4 h-4 text-[#F4B400]" /> Talent Beads
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, idx) => (
                      <span key={idx} className={`text-[10px] font-sans font-bold px-2.5 py-1 rounded-xl border transition-colors ${badgeBg}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT MAIN PANEL: About & Memoirs of Projects/Work */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* About Column styled like an Open Antique Diary */}
              <div className={`p-6 sm:p-8 rounded-3xl border-2 ${paperBg} shadow-md space-y-4 relative overflow-hidden transition-colors duration-500`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <h2 className="text-xl font-bold tracking-tight text-center font-serif flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#8C6239]" /> 
                  <span className={titleColor}>The Memoir and Aspirations</span>
                </h2>
                
                <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-line text-justify font-medium px-1 sm:px-3 ${isNight ? "text-[#DFCBB5]" : "text-[#58483D]"} font-serif`}>
                  {basicDetails.aboutMe || "A passionate explorer studying ways to turn digital mechanisms into friendly, heartwarming outcomes."}
                </p>

                {/* Aesthetic stamp footer */}
                <div className="flex justify-end pt-4 border-t border-dashed border-[#8C6239]/25">
                  <div className={`px-3 py-1 border border-amber-600/30 rounded-lg text-[9px] font-mono tracking-widest uppercase ${isNight ? "bg-amber-900/10 text-amber-200" : "bg-amber-50 text-amber-900"} font-black`}>
                    VERITAS AC INTEGRITAS
                  </div>
                </div>
              </div>

              {/* Work Milestones / Memoirs Timeline */}
              <div className="space-y-4">
                <h3 className={`text-xs font-mono font-extrabold uppercase tracking-widest ${isNight ? "text-[#FCD28C]" : "text-[#7A5B40]"} flex items-center gap-1.5 px-1`}>
                  <Briefcase className="w-4 h-4 text-emerald-600" /> Work memoir Timeline
                </h3>

                {isFresher || experiences.length === 0 ? (
                  <div className={`p-6 rounded-2xl border-2 border-dashed ${cardBg} text-center space-y-3 transition-colors duration-300`}>
                    <p className="text-sm font-semibold italic text-[#8B6E59]">
                      "💼 EMBARKING ON NEW MEMOIRS: Starting a clean chapter with fresh passion and dedicated energy."
                    </p>
                    <p className={`text-xs ${secText} leading-relaxed max-w-md mx-auto font-sans font-medium`}>
                      No full-time appointments logged yet. Equipped with rigorous training, high academic credentials, and eager willingness to learn. Let's build!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className={`p-5 rounded-2xl border-2 ${cardBg} shadow-xs relative overflow-hidden transition-colors duration-300`}>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                          <div>
                            <span className={`text-[10px] font-mono font-bold tracking-wider ${isNight ? "text-amber-300" : "text-[#8C6239]"}`}>
                              {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                            </span>
                            <h4 className={`text-base font-extrabold transition-colors ${isNight ? "text-amber-100" : "text-[#2A1D13]"}`}>
                              {exp.role}
                            </h4>
                            <p className="text-xs font-bold text-emerald-600 font-sans mt-0.5">
                              {exp.company} {exp.location ? `• ${exp.location}` : ""}
                            </p>
                          </div>
                        </div>
                        <p className={`text-xs leading-relaxed mt-3 whitespace-pre-line font-medium font-sans ${secText}`}>
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects List (Masterpieces Showcase) */}
              {!hasNoProjects && (
                <div className="space-y-4">
                  <h3 className={`text-xs font-mono font-extrabold uppercase tracking-widest ${isNight ? "text-[#FCD28C]" : "text-[#7A5B40]"} flex items-center gap-1.5 px-1`}>
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> Handcrafted Masterpieces
                  </h3>

                  {projects.length === 0 ? (
                    <p className="text-xs text-[#5F6368] font-medium text-center py-4 border border-dashed border-stone-200 bg-stone-50 rounded-2xl font-sans">
                      No masterpieces added yet. Skip or write custom titles in Step 5.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projects.map((proj) => (
                        <div key={proj.id} className={`p-5 rounded-2xl border-2 ${cardBg} shadow-xs flex flex-col justify-between h-52 transition-colors duration-300`}>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${proj.imageTheme} shadow-xs ring-1 ring-black/15`}></span>
                              <h4 className={`font-bold font-serif text-sm truncate ${isNight ? "text-amber-150" : "text-stone-900"}`}>{proj.title}</h4>
                            </div>
                            <p className={`text-xs line-clamp-3 mt-3 leading-relaxed font-sans font-medium ${secText}`}>
                              {proj.description}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-stone-200/40 flex items-center justify-between mt-auto">
                            <div className="flex flex-wrap gap-1">
                              {proj.tags.slice(0, 2).map((tg, i) => (
                                <span key={i} className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${badgeBg}`}>
                                  {tg}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex gap-2">
                              {proj.githubUrl && (
                                <a href={proj.githubUrl.startsWith("http") ? proj.githubUrl : `https://${proj.githubUrl}`} target="_blank" rel="noopener noreferrer" className="p-1 px-2.5 rounded-lg border border-stone-300 text-[10px] font-mono font-bold hover:bg-stone-50 transition-colors flex items-center gap-1">
                                  CODE
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Honors & Certifications Ledger */}
              {!hasNoCertificates && (
                <div className="space-y-4">
                  <h3 className={`text-xs font-mono font-extrabold uppercase tracking-widest ${isNight ? "text-[#FCD28C]" : "text-[#7A5B40]"} flex items-center gap-1.5 px-1`}>
                    <Award className="w-4 h-4 text-emerald-600" /> Honorable Credentials & Awards
                  </h3>

                  {certificates.length === 0 ? (
                    <p className="text-xs text-[#5F6368] font-medium text-center py-4 border border-dashed border-stone-200 bg-stone-50 rounded-2xl font-sans">
                      No honors logged. Check option or register credential records in Step 5.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {certificates.map((cert) => (
                        <div key={cert.id} className={`p-4 rounded-xl border-2 ${cardBg} shadow-xs flex items-center justify-between transition-colors duration-300`}>
                          <div className="font-sans min-w-0 pr-4">
                            <h4 className={`text-xs font-bold truncate ${isNight ? "text-amber-100" : "text-stone-900"}`}>{cert.title}</h4>
                            <p className="text-[10px] text-stone-500 font-mono mt-0.5">{cert.issuer} • {cert.date}</p>
                          </div>
                          {cert.credentialUrl && (
                            <a 
                              href={cert.credentialUrl.startsWith("http") ? cert.credentialUrl : `https://${cert.credentialUrl}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={`p-1 px-3 border rounded text-[9px] font-mono font-bold flex-shrink-0 transition-colors ${
                                isNight 
                                  ? "border-amber-500/40 text-[#FCD28C] hover:bg-[#FCD28C]/10" 
                                  : "border-stone-300 text-[#8C6239] hover:bg-[#8C6239]/5"
                              }`}
                            >
                              VERIFY
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Retro social link row */}
              <div className={`p-5 rounded-2xl border-2 ${cardBg} flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300`}>
                <div className="font-sans">
                  <h4 className={`text-xs font-extrabold uppercase ${isNight ? "text-amber-100" : "text-stone-900"}`}>Leave a signature greeting</h4>
                  <p className="text-[11px] text-stone-500 font-medium">Access any of these avenues to invite collaboration or mentorship.</p>
                </div>
                <div className="flex gap-2">
                  {renderSocials(`p-2 rounded-xl transition-all duration-150 border flex items-center justify-center shrink-0 ${
                    isNight 
                      ? "border-amber-500/20 bg-amber-950/10 text-[#FCD28C] hover:bg-amber-950/30 hover:scale-105" 
                      : "border-[#E2D4C3] bg-[#FCF8F2] text-[#8C6239] hover:bg-[#FAF1E6] hover:scale-105"
                  }`)}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // --- 5. TEACHER PROFESSIONAL TEMPLATE (Clean, formal, scholarly, well-structured) ---
  return (
    <div className="bg-[#FFFDF7] text-stone-900 min-h-screen font-serif pb-24">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Scholar Header */}
        <div className="border-y-2 border-stone-800 py-8 text-center bg-stone-50/50 space-y-3 shadow-sm rounded-xl">
          <p className="text-xs font-mono uppercase tracking-widest text-[#5F6368]">Professional Academic Portfolio & CV</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-stone-950">
            {basicDetails.fullName || "Distinguished Educator"}
          </h1>
          <p className="text-sm font-light text-stone-600 font-sans tracking-wide">
            {basicDetails.tagline || "Specialized Educator and Academic Scholar"}
          </p>
          {basicDetails.summary && (
            <p className="text-xs text-stone-500 font-sans italic max-w-xl mx-auto px-4 leading-normal">
              "{basicDetails.summary}"
            </p>
          )}
          
          <div className="flex flex-wrap items-center justify-center gap-y-1 gap-x-6 text-xs text-stone-500 font-sans font-medium pt-2 border-t border-stone-200/50 max-w-lg mx-auto">
            {basicDetails.email && <span>Email: {basicDetails.email}</span>}
            {basicDetails.phone && <span>Phone: {basicDetails.phone}</span>}
            {basicDetails.location && <span>Location: {basicDetails.location}</span>}
            {basicDetails.languages && <span>Languages: {basicDetails.languages}</span>}
          </div>

          <div className="flex justify-center border-t border-stone-200/50 pt-2">
            {renderSocials("bg-stone-50 hover:bg-stone-200/60 p-2 text-stone-700 rounded-full transition-colors duration-150 inline-block")}
          </div>
        </div>

        {/* Profile Pic & About Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-b border-stone-200">
          <div className="md:col-span-1 flex flex-col items-center">
            {basicDetails.avatarUrl ? (
              <img 
                src={basicDetails.avatarUrl} 
                alt={basicDetails.fullName} 
                className="w-28 h-28 rounded-xl object-cover border border-stone-300 filter grayscale bg-stone-50 shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-28 h-28 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center text-[#5F6368]">
                <GraduationCap className="w-10 h-10" />
              </div>
            )}
          </div>
          <div className="md:col-span-3 space-y-3 font-sans">
            <h3 className="text-xs font-mono uppercase tracking-widest text-stone-400 font-bold">Personal Statement</h3>
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line font-medium text-justify">
              {basicDetails.aboutMe}
            </p>
          </div>
        </div>

        {/* Dynamic educational logs */}
        {educations.length > 0 && (
          <section className="py-10 border-b border-stone-200">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#5F6368] font-bold mb-6 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-stone-700" /> Education History
            </h2>
            <div className="space-y-6">
              {educations.map((edu) => (
                <div key={edu.id} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="text-xs font-mono text-stone-500 font-bold">{edu.startDate} – {edu.endDate}</div>
                  <div className="md:col-span-3 space-y-1">
                    <h3 className="font-bold text-base text-stone-950">
                      {edu.degree} in {edu.department}
                    </h3>
                    <p className="text-sm text-stone-600 font-sans font-semibold">{edu.institution}</p>
                    {edu.grade && (
                       <span className="text-xs font-sans text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                         GPA / Percentage: {edu.grade}
                       </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pedagogical Expertise */}
        {skills.length > 0 && (
          <section className="py-10 border-b border-stone-200">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#5F6368] font-bold mb-6">Expertise Domains</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-sm font-sans font-medium text-stone-800">
              {skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-stone-800 rounded-full"></span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Academic / Teaching experiences */}
        {experiences.length > 0 && (
          <section className="py-10 border-b border-stone-200">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#5F6368] font-bold mb-6 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-stone-700" /> Professional Appointments
            </h2>
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="text-xs font-mono text-stone-500 font-bold">
                    {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <h3 className="font-bold text-base text-stone-950">{exp.role}</h3>
                    <p className="text-sm font-sans font-semibold text-stone-600">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                    <p className="text-xs font-sans text-stone-500 leading-relaxed text-slate-700 whitespace-pre-line text-justify font-medium">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Academic projects or publications */}
        {projects.length > 0 && (
          <section className="py-10 border-b border-stone-200">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#5F6368] font-bold mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4 text-stone-700" /> Scholarly Projects & Curriculums
            </h2>
            <div className="space-y-6">
              {projects.map((proj) => (
                <div key={proj.id} className="border-l-2 border-stone-800 pl-4 py-1 space-y-2">
                  <h3 className="font-bold text-base text-stone-950 flex items-center justify-between">
                    {proj.title}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-950 transition-colors duration-150">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </h3>
                  <p className="text-xs text-stone-500 font-sans font-medium hover:text-stone-800">
                    {proj.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {proj.tags.map((tg, idx) => (
                      <span key={idx} className="bg-stone-100 text-stone-600 text-[10px] font-mono font-medium px-2 py-0.5 rounded">
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Honors, Awards & Conferences */}
        {certificates.length > 0 && (
          <section className="py-10">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#5F6368] font-bold mb-6 flex items-center gap-2">
              <Award className="w-4 h-4 text-stone-700" /> Academic Commendations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="p-4 border border-stone-200 rounded-lg bg-stone-50/50 space-y-1 font-sans">
                  <h4 className="text-xs font-bold text-stone-900 leading-snug">{cert.title}</h4>
                  <p className="text-[11px] text-[#5F6368] font-medium">{cert.issuer} • {cert.date}</p>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-stone-700 underline flex items-center gap-1 font-medium hover:text-stone-950 mt-1">
                      Check Document <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
