import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Send, X, AlertTriangle } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, showToast }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Developer");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roles = ["Student", "Teacher", "Developer", "Freelancer"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide your name.");
      return;
    }
    if (!message.trim()) {
      setError("Please write a short review or message.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, "feedbacks"), {
        name: name.trim(),
        role: role,
        message: message.trim(),
        rating: rating,
        approved: false, // Moderated by default
        createdAt: serverTimestamp(),
      });

      showToast("❤️ Thank you so much! Your feedback has been sent for moderation.");
      onClose();
      // Reset form
      setName("");
      setRole("Developer");
      setMessage("");
      setRating(5);
    } catch (err: any) {
      console.error("Firestore submit error:", err);
      setError("Could not submit feedback due to database rules. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full max-w-lg bg-[#FAF9F5] border-4 border-stone-900 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_rgba(28,25,23,1)] relative text-left"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors border border-stone-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Heading */}
          <div className="mb-6">
            <span className="text-[10px] font-mono font-black tracking-widest text-[#F4B400] bg-stone-900 px-3 py-1 rounded-full uppercase">
              How did we do?
            </span>
            <h3 className="text-2xl font-black text-stone-900 leading-tight mt-3 font-display">
              We'd love your Feedback!
            </h3>
            <p className="text-xs text-stone-600 mt-1 font-medium">
              Your design link is ready or downloaded! Your honest review helps us build the premium digital standard.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-100 border-2 border-red-400 text-red-900 rounded-xl text-xs font-bold font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-650 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating Selector */}
            <div>
              <label className="block text-xs font-black text-stone-850 uppercase tracking-wider font-mono mb-2">
                Your Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 rounded-lg transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating ?? rating)
                          ? "fill-[#F4B400] text-[#F4B400]"
                          : "fill-transparent text-stone-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-stone-850 uppercase tracking-wider font-mono mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border-2 border-stone-900 rounded-xl p-3 text-xs font-semibold text-stone-900 placeholder-stone-400 outline-none focus:border-[#F4B400] font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-850 uppercase tracking-wider font-mono mb-1.5">
                  Your Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white border-2 border-stone-900 rounded-xl p-3 text-xs font-semibold text-stone-900 outline-none focus:border-[#F4B400] font-sans cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message input */}
            <div>
              <label className="block text-xs font-black text-stone-850 uppercase tracking-wider font-mono mb-1.5">
                Review Description
              </label>
              <textarea
                required
                rows={3}
                placeholder="Write your suggestions or general feedback experience here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border-2 border-stone-900 rounded-xl p-3 text-xs font-semibold text-stone-900 placeholder-stone-400 outline-none focus:border-[#F4B400] font-sans resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 border-2 border-stone-900 bg-stone-100 hover:bg-stone-250 text-stone-900 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Skip / Later
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-stone-900 hover:bg-stone-950 text-[#F4B400] font-black text-xs rounded-xl flex items-center gap-2 shadow-[2px_2px_0px_rgba(244,180,0,0.85)] border-2 border-stone-900 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Submit Feedback"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
