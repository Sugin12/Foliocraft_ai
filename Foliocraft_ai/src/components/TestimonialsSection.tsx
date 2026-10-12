import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Star, Quote, MessageSquare, Heart, Award } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  approved: boolean;
  createdAt: any;
}

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const q = query(
          collection(db, "feedbacks"), 
          where("approved", "==", true)
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TestimonialItem[];

        // Sort in memory to avoid requiring a composite index draft in Firestore
        const sorted = fetched.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        setTestimonials(sorted);
      } catch (err) {
        console.warn("Failed to load approved testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApproved();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F4B400] mb-3" />
        <span className="text-xs font-mono text-stone-500">Curating client success stories...</span>
      </div>
    );
  }

  if (testimonials.length === 0) {
    // Fallback beautiful mockup testimonials if nobody has submitted yet
    const backupTestimonials: TestimonialItem[] = [
      {
        id: "mock1",
        name: "Clara Dupont",
        role: "Developer",
        message: "Foliocraft is insanely efficient. I designed my portfolio and secured 3 client copy contracts in under an hour! The direct PDF vector direct alignment downloads cleanly.",
        rating: 5,
        approved: true,
        createdAt: null
      },
      {
        id: "mock2",
        name: "Marcus Aurelius",
        role: "Freelancer",
        message: "The bento-grid layouts are brilliant! The AI assist helped condense my bios perfectly, and copying my live portfolio address was instantaneous.",
        rating: 5,
        approved: true,
        createdAt: null
      },
      {
        id: "mock3",
        name: "Vishaal Kumar",
        role: "Student",
        message: "My recruiters loved standard minimalist designs. I sent them my curated custom link, and got an internship interview the next day. Brilliant system!",
        rating: 5,
        approved: true,
        createdAt: null
      }
    ];

    return (
      <section className="py-12 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3.5">
          <div className="inline-flex items-center gap-1.5 bg-[#F4B400]/10 text-[#F4B400] text-xs font-bold uppercase tracking-widest font-mono px-3.5 py-1.5 rounded-full border border-[#F4B400]/20">
            <Heart className="w-3.5 h-3.5 fill-current animate-pulse text-[#F4B400]" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-stone-200 tracking-tight font-display">
            Loved by Developers, Professionals & Students
          </h2>
          <p className="text-xs text-stone-400">
            No active custom cloud approvals yet - showing featured creator highlights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {backupTestimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-stone-900 border-2 border-stone-850 p-6 rounded-3xl relative flex flex-col justify-between"
            >
              <Quote className="absolute top-4 right-4 w-10 h-10 text-stone-800/60 shrink-0" />
              <div>
                <div className="flex gap-0.5 text-[#F4B400] mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-[#F4B400]" />
                  ))}
                </div>
                <p className="text-xs text-stone-300 font-medium leading-relaxed italic z-10 relative">
                  "{t.message}"
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-stone-800/80 pt-4">
                <div className="h-9 w-9 rounded-full bg-[#F4B400] text-stone-950 font-black flex items-center justify-center text-xs border border-stone-900 shadow">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-black text-stone-100">{t.name}</h4>
                  <span className="text-[10px] font-bold text-stone-500 font-mono tracking-wider bg-stone-950 px-2 py-0.5 rounded border border-stone-850">
                    {t.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3.5">
        <div className="inline-flex items-center gap-1.5 bg-[#F4B400]/10 text-[#F4B400] text-xs font-bold uppercase tracking-widest font-mono px-3.5 py-1.5 rounded-full border border-[#F4B400]/20">
          <MessageSquare className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>Real-time Feedback</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-stone-200 tracking-tight font-display">
          What Our Users Are Saying
        </h2>
        <p className="text-xs text-stone-400 leading-relaxed">
          See live curated feedback and authentic reviews from creators who built their profiles using FolioCraft!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-[#FAF9F5] border-3 border-stone-900 p-6 rounded-3xl relative flex flex-col justify-between shadow-[4px_4px_0px_rgba(28,25,23,1)] text-stone-950 hover:shadow-[6px_6px_0px_rgba(244,180,0,1)] transition-all duration-300"
          >
            <Quote className="absolute top-4 right-4 w-9 h-9 text-stone-200/80 shrink-0" />
            <div>
              <div className="flex gap-0.5 text-[#F4B400] mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < t.rating ? "fill-current text-[#F4B400]" : "text-stone-300"}`} 
                  />
                ))}
              </div>
              <p className="text-xs text-stone-800 font-semibold leading-relaxed italic relative z-10 whitespace-pre-wrap">
                "{t.message}"
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2.5 border-t border-stone-200 pt-4">
              <div className="h-9 w-9 rounded-full bg-stone-900 text-[#F4B400] font-black flex items-center justify-center text-xs border border-stone-900 font-mono shadow">
                {t.name[0].toUpperCase()}
              </div>
              <div className="my-1">
                <h4 className="text-xs font-black text-stone-950 font-sans leading-tight">{t.name}</h4>
                <div className="mt-1">
                  <span className="text-[9px] font-mono leading-none tracking-widest text-[#F4B400] uppercase font-black bg-stone-900 px-2 py-0.5 rounded">
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
