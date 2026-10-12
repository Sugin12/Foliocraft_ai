import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  X, 
  Lock, 
  Key, 
  Eye, 
  Database, 
  HeartHandshake, 
  Share2, 
  EyeOff, 
  Server, 
  RefreshCw, 
  AlertTriangle 
} from "lucide-react";

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-3xl bg-stone-900 border-2 border-stone-800 rounded-3xl p-6 md:p-8 shadow-2xl relative text-left text-white max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Elegant Header with Banner Background */}
            <div className="flex justify-between items-center pb-5 border-b border-stone-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#F4B400]/10 rounded-2xl border border-[#F4B400]/20 text-[#F4B400]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black font-display tracking-tight text-white mb-0.5">
                    Security & Data Protection
                  </h2>
                  <p className="text-[10px] md:text-xs text-stone-400 font-mono tracking-wider font-semibold uppercase">
                    Platform Trust Certificate
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 bg-stone-800/80 hover:bg-stone-750 text-stone-400 hover:text-white rounded-full border border-stone-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto py-6 pr-2 space-y-8 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
              
              {/* Introduction Card */}
              <div className="bg-stone-950/50 border border-stone-800 rounded-2xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4B400]/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <p className="text-sm text-stone-300 leading-relaxed font-medium">
                  At <strong className="text-white font-extrabold">FolioCraft</strong>, protecting user portfolios and personal information is one of our highest priorities. Every portfolio, document, and user interaction is designed to operate inside a secure cloud infrastructure powered by modern web technologies and Firebase services.
                </p>
              </div>

              {/* Grid of Security Aspects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Secure Authentication */}
                <div className="bg-stone-950/30 border border-stone-800/80 rounded-2xl p-5 hover:border-stone-700/60 transition-colors space-y-2.5">
                  <div className="flex items-center gap-2.5 text-stone-200">
                    <Key className="w-4 h-4 text-[#F4B400]" />
                    <h3 className="font-extrabold text-sm tracking-tight">Secure Authentication</h3>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-semibold">
                    User authentication is protected using Firebase Authentication systems. Login sessions are securely managed and sensitive account credentials are never publicly exposed.
                  </p>
                </div>

                {/* 2. Encrypted Cloud Storage */}
                <div className="bg-stone-950/30 border border-stone-800/80 rounded-2xl p-5 hover:border-stone-700/60 transition-colors space-y-2.5">
                  <div className="flex items-center gap-2.5 text-stone-200">
                    <Lock className="w-4 h-4 text-[#F4B400]" />
                    <h3 className="font-extrabold text-sm tracking-tight">Encrypted Cloud Storage</h3>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-semibold">
                    Portfolio information, profile details, and uploaded content are securely stored in cloud databases with protected access rules and controlled permissions.
                  </p>
                </div>

                {/* 3. Portfolio Privacy */}
                <div className="bg-stone-950/30 border border-stone-800/80 rounded-2xl p-5 hover:border-stone-700/60 transition-colors space-y-2.5">
                  <div className="flex items-center gap-2.5 text-stone-200">
                    <Eye className="w-4 h-4 text-[#F4B400]" />
                    <h3 className="font-extrabold text-sm tracking-tight">Portfolio Privacy</h3>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-semibold">
                    Users maintain control over their own portfolio links and public visibility. Sensitive data is never intentionally shared without user interaction or permission.
                  </p>
                </div>

                {/* 4. Protected Database Access */}
                <div className="bg-stone-950/30 border border-stone-800/80 rounded-2xl p-5 hover:border-stone-700/60 transition-colors space-y-2.5">
                  <div className="flex items-center gap-2.5 text-stone-200">
                    <Database className="w-4 h-4 text-[#F4B400]" />
                    <h3 className="font-extrabold text-sm tracking-tight">Protected Database Access</h3>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-semibold">
                    All database interactions are protected using Firebase Firestore security rules to prevent unauthorized access, spam activity, and malicious modifications.
                  </p>
                </div>

                {/* 5. Admin Moderation System */}
                <div className="bg-stone-950/30 border border-stone-800/80 rounded-2xl p-5 hover:border-stone-700/60 transition-colors space-y-2.5">
                  <div className="flex items-center gap-2.5 text-stone-200">
                    <HeartHandshake className="w-4 h-4 text-[#F4B400]" />
                    <h3 className="font-extrabold text-sm tracking-tight">Admin Moderation System</h3>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-semibold">
                    Public testimonials and feedback submissions are manually reviewed before appearing on the website. This helps maintain authenticity, professionalism, and platform quality.
                  </p>
                </div>

                {/* 6. Secure Portfolio Sharing */}
                <div className="bg-stone-950/30 border border-stone-800/80 rounded-2xl p-5 hover:border-stone-700/60 transition-colors space-y-2.5">
                  <div className="flex items-center gap-2.5 text-stone-200">
                    <Share2 className="w-4 h-4 text-[#F4B400]" />
                    <h3 className="font-extrabold text-sm tracking-tight">Secure Portfolio Sharing</h3>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-semibold">
                    Generated portfolio links are designed for safe public sharing while keeping internal management systems protected from unauthorized users.
                  </p>
                </div>

                {/* 7. Anti-Spam Protection */}
                <div className="bg-stone-950/30 border border-stone-800/80 rounded-2xl p-5 hover:border-stone-700/60 transition-colors space-y-2.5">
                  <div className="flex items-center gap-2.5 text-stone-200">
                    <EyeOff className="w-4 h-4 text-[#F4B400]" />
                    <h3 className="font-extrabold text-sm tracking-tight">Anti-Spam Protection</h3>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-semibold">
                    The platform includes validation systems and moderation layers to reduce spam submissions, fake feedback, and abusive activity.
                  </p>
                </div>

                {/* 8. Real-Time Cloud Infrastructure */}
                <div className="bg-stone-950/30 border border-stone-800/80 rounded-2xl p-5 hover:border-stone-700/60 transition-colors space-y-2.5">
                  <div className="flex items-center gap-2.5 text-stone-200">
                    <Server className="w-4 h-4 text-[#F4B400]" />
                    <h3 className="font-extrabold text-sm tracking-tight">Real-Time Cloud Infrastructure</h3>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-semibold">
                    FolioCraft uses modern cloud technologies for stable performance, fast loading speeds, and reliable data synchronization across devices.
                  </p>
                </div>

              </div>

              {/* Continuous Improvements callout */}
              <div className="bg-gradient-to-r from-stone-950/40 via-stone-900/60 to-stone-950/40 border border-stone-800/80 rounded-2xl p-5 flex items-start gap-4">
                <div className="p-2 bg-stone-800 rounded-xl text-[#F4B400] shrink-0 mt-0.5">
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-stone-200 leading-none">Continuous Improvements</h4>
                  <p className="text-xs text-stone-400 leading-relaxed font-medium">
                    Security systems, UI stability, and database protections are continuously improved to maintain a smooth and safe user experience.
                  </p>
                </div>
              </div>

              {/* Technologies Division */}
              <div className="border-t border-stone-800/85 pt-6 space-y-3">
                <h4 className="text-xs font-mono font-black text-stone-400 uppercase tracking-widest">Platform Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {["Firebase Firestore", "Firebase Authentication", "Next.js", "Tailwind CSS", "Secure Cloud Hosting"].map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 bg-stone-950 text-[11px] font-mono text-stone-300 font-bold border border-stone-800 rounded-lg hover:border-[#F4B400]/30 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Security Notice Callout */}
              <div className="bg-[#FAF9F5]/5 border border-stone-700/50 rounded-2xl p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-[#F4B400]">
                  <AlertTriangle className="w-4 h-4" />
                  <h4 className="font-bold text-xs font-mono uppercase tracking-wider">Security Notice</h4>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-medium">
                  FolioCraft is actively developed and continuously upgraded with modern web security practices and infrastructure improvements.
                </p>
                <div className="pt-1.5 border-t border-stone-850 text-center font-display text-xs text-[#F4B400] font-black tracking-wide">
                  Your creativity, portfolios, and professional identity deserve a safe and reliable platform.
                </div>
              </div>

            </div>

            {/* Bottom Info Ribbon */}
            <div className="pt-4 border-t border-stone-800 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-mono text-stone-500">
              <span>FolioCraft Standard 2.1 Encryption</span>
              <span className="text-[#F4B400]">🔒 Verified Secure</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
