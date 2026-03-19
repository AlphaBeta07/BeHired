import { useState, useEffect } from "react";
import { useGetJobs, useCreateSwipe } from "@/lib/api/hooks";
import { useAuth } from "@/hooks/use-auth";
import { SwipeCard } from "@/components/SwipeCard";
import { MatchModal } from "@/components/MatchModal";
import { JobDetailSheet } from "@/components/JobDetailSheet";
import { Heart, X as XIcon, Loader2, Sparkles, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Job } from "@/lib/api/types";

export default function SwipeView() {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<"all" | "job" | "internship">("all");
  const [expandedJob, setExpandedJob] = useState<Job | null>(null);
  
  const { data: jobs, isLoading, refetch } = useGetJobs({ type: filterType });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchData, setMatchData] = useState<any>(null);

  const swipeMutation = useCreateSwipe();

  useEffect(() => {
    setCurrentIndex(0);
  }, [jobs?.length, filterType]);

  const handleSwipe = async (direction: "like" | "pass") => {
    if (!jobs || currentIndex >= jobs.length) return;
    const currentJob = jobs[currentIndex];
    setCurrentIndex(prev => prev + 1);
    try {
      const result = await swipeMutation.mutateAsync({ data: { jobId: currentJob.id, direction } });
      if (result.matched) {
        setMatchData({ job: currentJob, user });
      }
    } catch (e) {
      console.error("Failed to record swipe", e);
    }
  };

  const hasMore = jobs && currentIndex < jobs.length;
  const currentJob = hasMore ? jobs![currentIndex] : null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pb-32 pt-12">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-6 glass-card rounded-full px-1.5 py-1.5 border border-white/10 shadow-xl">
        {(["all", "job", "internship"] as const).map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-bold capitalize transition-all",
              filterType === t
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {t === "all" ? "All" : t === "job" ? "Jobs" : "Internships"}
          </button>
        ))}
      </div>

      {/* Card area */}
      <div className="relative w-full max-w-sm h-[560px] flex items-center justify-center px-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-white/40">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p className="font-semibold">Finding opportunities...</p>
          </div>
        ) : !hasMore ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center p-10 glass-card rounded-[32px] border border-white/10 shadow-2xl h-full w-full"
          >
            <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">You're all caught up!</h3>
            <p className="text-white/50 mb-8 text-sm max-w-[220px]">
              We've shown you all {filterType !== "all" ? filterType + "s" : "listings"} right now.
            </p>
            <button
              onClick={() => refetch()}
              className="px-8 py-3 rounded-full bg-white/10 border border-white/15 text-white font-bold text-sm hover:bg-white/15 transition-all"
            >
              Refresh Feed
            </button>
          </motion.div>
        ) : (
          <div className="w-full h-full relative">
            <AnimatePresence>
              {jobs?.slice(currentIndex, currentIndex + 3).reverse().map((job, idx, arr) => {
                const isTop = idx === arr.length - 1;
                return (
                  <SwipeCard
                    key={job.id}
                    data={job}
                    type="job"
                    onSwipe={handleSwipe}
                    onExpand={isTop ? () => setExpandedJob(job) : undefined}
                    active={isTop}
                    zIndex={idx}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Tinder action buttons */}
      <div className="mt-8 flex items-center gap-5 z-10">
        <button
          onClick={() => handleSwipe("pass")}
          disabled={!hasMore || swipeMutation.isPending}
          className="w-14 h-14 rounded-full glass-card border border-white/10 shadow-xl flex items-center justify-center text-destructive hover:border-destructive/50 hover:bg-destructive/10 transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
        >
          <XIcon className="w-7 h-7 stroke-[2.5px]" />
        </button>

        <button
          disabled={!hasMore || swipeMutation.isPending}
          onClick={() => currentJob && setExpandedJob(currentJob)}
          className="w-12 h-12 rounded-full glass-card border border-white/10 shadow-xl flex items-center justify-center text-yellow-400 hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
          title="View Details"
        >
          <Star className="w-5 h-5 stroke-[2.5px]" />
        </button>

        <button
          onClick={() => handleSwipe("like")}
          disabled={!hasMore || swipeMutation.isPending}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-primary to-accent shadow-xl shadow-primary/40 hover:opacity-90 transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
        >
          <Heart className="w-7 h-7 fill-white stroke-0" />
        </button>
      </div>

      {/* Job Detail Bottom Sheet */}
      <JobDetailSheet
        job={expandedJob}
        onClose={() => setExpandedJob(null)}
        onLike={() => handleSwipe("like")}
        onPass={() => handleSwipe("pass")}
        isPending={swipeMutation.isPending}
      />

      <MatchModal
        isOpen={!!matchData}
        onClose={() => setMatchData(null)}
        title="It's a Match!"
        subtitle={`${matchData?.job?.company} liked your profile too. 🎉`}
        image1={matchData?.user?.avatar}
        image2={matchData?.job?.companyLogo}
        name1={matchData?.user?.name || "You"}
        name2={matchData?.job?.company || "Company"}
      />
    </div>
  );
}
