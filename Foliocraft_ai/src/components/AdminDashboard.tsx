import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  CheckCircle, 
  Trash2, 
  Home, 
  MessageSquare, 
  Star, 
  Users, 
  Eye, 
  Clock, 
  Flame, 
  AlertOctagon,
  LogOut
} from "lucide-react";
import { collection, query, orderBy, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";

interface FeedbackItem {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  approved: boolean;
  createdAt: any;
}

interface AdminDashboardProps {
  onBackToLanding: () => void;
  showToast: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToLanding, showToast }) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved">("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const fetched: FeedbackItem[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as FeedbackItem[];
      setFeedbacks(fetched);
    } catch (err: any) {
      console.error("Failed to load feedbacks for moderation:", err);
      showToast("❌ Could not load feedback records. Access Denied.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleApprove = async (id: string, name: string) => {
    try {
      await updateDoc(doc(db, "feedbacks", id), {
        approved: true,
      });
      showToast(`✓ Approved feedback from ${name}!`);
      // Update local state instantly
      setFeedbacks(prev =>
        prev.map((item) => (item.id === id ? { ...item, approved: true } : item))
      );
    } catch (err: any) {
      console.error("Approval Firestore write failed:", err);
      showToast("❌ Approval write failed.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteDoc(doc(db, "feedbacks", id));
      showToast(`✓ Permanently removed feedback from ${name}.`);
      setFeedbacks(prev => prev.filter((item) => item.id !== id));
      if (deleteConfirmId === id) {
        setDeleteConfirmId(null);
      }
    } catch (err: any) {
      console.error("Deletion update failed:", err);
      showToast("❌ Deletion update failed.");
    }
  };

  const handleAdminSignOut = async () => {
    try {
      await signOut(auth);
      showToast("✓ Admin logged out successfully.");
      onBackToLanding();
    } catch (err) {
      console.error(err);
    }
  };

  // Calculations
  const totalSubmissions = feedbacks.length;
  const pendingFeedbacksCount = feedbacks.filter((f) => !f.approved).length;
  const approvedFeedbacksCount = feedbacks.filter((f) => f.approved).length;
  const averageRating = totalSubmissions > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalSubmissions).toFixed(1)
    : "0.0";

  // Filter list
  const filteredFeedbacks = feedbacks.filter((item) => {
    if (activeTab === "pending") return !item.approved;
    if (activeTab === "approved") return item.approved;
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Admin header rail */}
      <header className="bg-[#FAF9F5] text-stone-950 border-b-4 border-stone-900 sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-stone-900 text-[#F4B400] rounded-2xl border-2 border-stone-900 shadow-[2px_2px_0px_rgba(28,25,23,0.15)]">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight font-display text-stone-900">
                FolioCraft Administrative Moderation
              </h1>
              <p className="text-[10px] font-mono leading-none tracking-widest text-[#F4B400] uppercase mt-1 font-black bg-stone-900 inline-block px-2 py-0.5 rounded">
                Admin Role: suginjoshuva@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLanding}
              className="bg-white hover:bg-stone-100 border-2 border-stone-900 text-stone-950 font-extrabold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Homepage</span>
            </button>
            <button
              onClick={handleAdminSignOut}
              className="bg-black hover:bg-stone-900 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4 text-stone-300" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-8">
        
        {/* Metric Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-[#FAF9F5] border-4 border-stone-900 p-5 rounded-2xl shadow-[4px_4px_0px_rgba(24,24,27,1)] flex items-center justify-between text-stone-950"
          >
            <div>
              <span className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest">
                Total Submissions
              </span>
              <p className="text-3xl font-black mt-1 font-display">{totalSubmissions}</p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl border-2 border-blue-500/20">
              <MessageSquare className="w-6 h-6" />
            </div>
          </motion.div>

          {/* Pending */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-[#FAF9F5] border-4 border-stone-900 p-5 rounded-2xl shadow-[4px_4px_0px_rgba(24,24,27,1)] flex items-center justify-between text-stone-950"
          >
            <div>
              <span className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest">
                Pending Queue
              </span>
              <p className="text-3xl font-black mt-1 font-display text-amber-600">{pendingFeedbacksCount}</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl border-2 border-amber-500/20">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
          </motion.div>

          {/* Approved */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-[#FAF9F5] border-4 border-stone-900 p-5 rounded-2xl shadow-[4px_4px_0px_rgba(24,24,27,1)] flex items-center justify-between text-stone-950"
          >
            <div>
              <span className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest">
                Testimonials Published
              </span>
              <p className="text-3xl font-black mt-1 font-display text-emerald-600">{approvedFeedbacksCount}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl border-2 border-emerald-500/20">
              <Eye className="w-6 h-6" />
            </div>
          </motion.div>

          {/* Rating */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-[#FAF9F5] border-4 border-stone-900 p-5 rounded-2xl shadow-[4px_4px_0px_rgba(24,24,27,1)] flex items-center justify-between text-stone-950"
          >
            <div>
              <span className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest">
                Avg Rating Stars
              </span>
              <p className="text-3xl font-black mt-1 font-display text-yellow-600">{averageRating}/5.0</p>
            </div>
            <div className="p-3 bg-[#F4B400]/10 text-yellow-600 rounded-xl border-2 border-[#F4B400]/20">
              <Star className="w-6 h-6 fill-current" />
            </div>
          </motion.div>
        </section>

        {/* Tab Selection Filter */}
        <div className="flex border-b-2 border-stone-800 gap-1 pb-px">
          {(["all", "pending", "approved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-t-xl text-xs font-black uppercase tracking-wider font-mono cursor-pointer transition-colors border-t-2 border-x-2 border-stone-950/0 ${
                activeTab === tab
                  ? "bg-[#F4B400] text-stone-950 font-black border-stone-900"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              {tab} ({
                tab === "all" ? totalSubmissions :
                tab === "pending" ? pendingFeedbacksCount : approvedFeedbacksCount
              })
            </button>
          ))}
        </div>

        {/* Dynamic submissions display items */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F4B400] mb-4" />
            <p className="text-xs font-mono text-stone-500">Querying active feedbacks database...</p>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="text-center py-20 border-3 border-dashed border-stone-850 rounded-2xl bg-stone-900/40">
            <AlertOctagon className="w-12 h-12 text-stone-500 mx-auto mb-3" />
            <h3 className="text-lg font-black text-stone-300">No submissions found</h3>
            <p className="text-xs text-stone-550 mt-1.5 max-w-md mx-auto">
              There is currently no feedback matching this view state. Share of link copy or direct PDF download will trigger review options automatically on editor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFeedbacks.map((f) => (
              <motion.div
                key={f.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FAF9F5] border-4 border-stone-900 rounded-3xl p-6 shadow-[6px_6px_0px_rgba(28,25,23,1)] hover:shadow-[10px_10px_0px_rgba(244,180,0,0.85)] transition-all duration-300 text-stone-950"
              >
                {/* Review Card header info */}
                <div className="flex justify-between items-start gap-4 pb-4 border-b border-stone-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-stone-950 text-base">{f.name}</span>
                      <span className="text-[10px] uppercase font-mono font-black tracking-wider bg-stone-900 text-[#F4B400] px-2 py-0.5 rounded border border-stone-900">
                        {f.role}
                      </span>
                      {f.approved ? (
                        <span className="text-[9px] uppercase font-mono font-black bg-emerald-100 text-emerald-850 px-2 py-0.5 rounded border border-emerald-400">
                          Active Testimonial
                        </span>
                      ) : (
                        <span className="text-[9px] uppercase font-mono font-black bg-amber-100 text-amber-850 px-2 py-0.5 rounded border border-amber-400 animate-pulse">
                          Pending Moderation
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-500 font-mono">
                      Received: {f.createdAt?.toDate ? f.createdAt.toDate().toLocaleString() : "Recently"}
                    </p>
                  </div>

                  {/* Rating Stars view */}
                  <div className="flex gap-0.5 text-[#F4B400] shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < f.rating ? "fill-current" : "text-stone-300"}`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Message comment body */}
                <p className="mt-4 text-xs font-semibold leading-relaxed text-stone-750 bg-stone-100 p-3.5 rounded-2xl border border-stone-205 min-h-[70px] whitespace-pre-wrap">
                  "{f.message}"
                </p>

                {/* Moderation Actions button bar */}
                <div className="mt-5 pt-4 border-t border-stone-200 flex items-center justify-end gap-2.5">
                  {deleteConfirmId === f.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-stone-500 font-mono text-[10px] uppercase font-bold animate-pulse">Confirm?</span>
                      <button
                        onClick={() => handleDelete(f.id, f.name)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all border border-red-700 cursor-pointer text-xs flex items-center gap-1 font-bold"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Now</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl transition-all border border-stone-300 cursor-pointer text-xs flex items-center gap-1 font-bold"
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(f.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all border border-red-300 cursor-pointer text-xs flex items-center gap-1 font-bold"
                      title="Delete permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  )}

                  {!f.approved && (
                    <button
                      onClick={() => handleApprove(f.id, f.name)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(28,25,23,1)] border border-stone-900"
                    >
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>Approve Review</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
