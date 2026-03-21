import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { 
  CheckCircle2, XCircle, Loader2, History, Briefcase, 
  Building2, MapPin, Calendar, User, Heart
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

const fetchHistory = async () => {
  const res = await fetch("/api/history");
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json() as Promise<{ accepted: any[]; rejected: any[] }>;
};

type Tab = "accepted" | "rejected";

export default function HistoryPage() {
  const { isEmployer } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("accepted");

  const { data, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: fetchHistory,
  });

  const acceptedItems = data?.accepted || [];
  const rejectedItems = data?.rejected || [];
  const items = activeTab === "accepted" ? acceptedItems : rejectedItems;

  const tabs: { id: Tab; label: string; count: number; icon: React.ReactNode; color: string }[] = [
    {
      id: "accepted",
      label: isEmployer ? "Accepted" : "Liked",
      count: acceptedItems.length,
      icon: <Heart className="w-4 h-4" />,
      color: "text-success",
    },
    {
      id: "rejected",
      label: isEmployer ? "Rejected" : "Passed",
      count: rejectedItems.length,
      icon: <XCircle className="w-4 h-4" />,
      color: "text-destructive",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-14 pb-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 pt-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <History className="w-5 h-5 text-white/60" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">History</h1>
          </div>
          <p className="text-white/50 text-sm ml-[52px]">
            {isEmployer ? "Your review decisions on applicants." : "Your swipe history on jobs."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm transition-all border ${
                activeTab === tab.id
                  ? tab.id === "accepted"
                    ? "bg-success/15 border-success/30 text-success"
                    : "bg-destructive/15 border-destructive/30 text-destructive"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white/60 hover:bg-white/8"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === tab.id
                  ? tab.id === "accepted" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                  : "bg-white/10 text-white/40"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-white/40 text-sm">Loading your history...</p>
          </div>
        ) : items.length === 0 ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-20 glass-card rounded-3xl border border-white/10"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              activeTab === "accepted" ? "bg-success/10" : "bg-destructive/10"
            }`}>
              {activeTab === "accepted"
                ? <CheckCircle2 className="w-8 h-8 text-success" />
                : <XCircle className="w-8 h-8 text-destructive" />
              }
            </div>
            <h2 className="text-xl font-black text-white mb-2">Nothing here yet</h2>
            <p className="text-white/40 text-sm max-w-[200px]">
              {activeTab === "accepted"
                ? isEmployer ? "You haven't accepted any applicants yet." : "You haven't liked any jobs yet."
                : isEmployer ? "You haven't rejected any applicants yet." : "You haven't passed on any jobs yet."
              }
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "accepted" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {items.map((item: any, i: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-card rounded-2xl border border-white/8 p-4 flex items-center gap-4"
                >
                  {/* Avatar / Logo */}
                  <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-white font-black text-lg">
                    {isEmployer ? (
                      item.applicantAvatar ? (
                        <img src={item.applicantAvatar} alt={item.applicantName} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as any).style.display = "none"; }} />
                      ) : (
                        <User className="w-6 h-6 text-white/70" />
                      )
                    ) : (
                      item.companyLogo ? (
                        <img src={item.companyLogo} alt={item.company} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as any).style.display = "none"; }} />
                      ) : (
                        item.company?.charAt(0).toUpperCase() || "C"
                      )
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm leading-tight truncate">
                      {isEmployer ? item.applicantName : item.jobTitle}
                    </h3>
                    <p className="text-white/50 text-xs truncate flex items-center gap-1 mt-0.5">
                      {isEmployer
                        ? <><Briefcase className="w-3 h-3 flex-shrink-0" />{item.jobTitle}</>
                        : <><Building2 className="w-3 h-3 flex-shrink-0" />{item.company}</>
                      }
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      {!isEmployer && item.location && (
                        <span className="flex items-center gap-0.5 text-white/30 text-[11px]">
                          <MapPin className="w-3 h-3" />{item.location}
                        </span>
                      )}
                      <span className="flex items-center gap-0.5 text-white/30 text-[11px]">
                        <Calendar className="w-3 h-3" />
                        {item.swipedAt ? formatRelativeTime(item.swipedAt) : "Recently"}
                      </span>
                      {/* Match status badge for jobseeker */}
                      {!isEmployer && item.matchStatus === "accepted" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success border border-success/20">
                          ✓ Matched!
                        </span>
                      )}
                       {!isEmployer && item.matchStatus === "pending" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                          ⏳ Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Icon */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeTab === "accepted" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                  }`}>
                    {activeTab === "accepted"
                      ? <CheckCircle2 className="w-5 h-5" />
                      : <XCircle className="w-5 h-5" />
                    }
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
