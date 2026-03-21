import { useState, useEffect } from "react";
import { SwipeCard } from "@/components/SwipeCard";
import { ApplicantDetailSheet } from "@/components/ApplicantDetailSheet";
import { Button } from "@/components/ui/button";
import { Heart, X as XIcon, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Applicant } from "@/lib/api/types";

// Custom fetch hooks to avoid modifying generated Orval output
const fetchTalent = async (): Promise<Applicant[]> => {
  const res = await fetch("/api/employer/talent");
  if (!res.ok) throw new Error("Failed to fetch talent");
  return res.json();
};

const swipeTalent = async (data: { applicantId: string, direction: "like" | "pass" }) => {
  const res = await fetch("/api/employer/swipe-talent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to swipe");
  return res.json();
};

export default function EmployerTalentView() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: talent, isLoading } = useQuery({
    queryKey: ['employer-talent'],
    queryFn: fetchTalent
  });

  const swipeMutation = useMutation({
    mutationFn: swipeTalent,
    onSuccess: (res) => {
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 2000);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Finding Top Talent...</h2>
        <p className="text-white/50 text-center max-w-sm">
          We're matching the best registered professionals to your standard.
        </p>
      </div>
    );
  }

  if (!talent || talent.length === 0 || currentIndex >= talent.length) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 rounded-3xl text-center max-w-sm border border-white/10"
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3 tracking-tight">You've seen everyone!</h2>
          <p className="text-white/50 leading-relaxed mb-8">
            There are no more registered jobseekers to review right now.
          </p>
        </motion.div>
      </div>
    );
  }

  const handleSwipe = (direction: "like" | "pass") => {
    if (currentIndex >= talent.length) return;
    
    const currentTalent = talent[currentIndex];
    
    // Optimistic UI update
    setCurrentIndex(prev => prev + 1);
    
    // API request 
    swipeMutation.mutate({ 
      applicantId: currentTalent.id, 
      direction: direction 
    });
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col pt-14 pb-24 sm:pb-32 items-center">
      {/* Dynamic Background Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center mb-6 pt-4">
        <h1 className="text-3xl font-black text-white tracking-tight">Explore Talent</h1>
        <p className="text-white/50 text-sm mt-1">
          {talent.length - currentIndex} jobseekers left
        </p>
      </div>

      {/* Cards container */}
      <div className="relative w-full max-w-[400px] h-[580px] px-4 flex-shrink-0 perspective-1000 z-20">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-5 left-1/2 -translate-x-1/2 z-50 bg-black/80 px-4 py-2 rounded-full border border-white/20 text-white font-bold text-sm tracking-wide backdrop-blur-md whitespace-nowrap"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {talent.slice(currentIndex, currentIndex + 2).map((applicant, idx) => {
            const isTop = idx === 0;
            return (
              <SwipeCard
                key={applicant.id}
                data={{
                  ...applicant,
                  jobId: applicant.id // Mock jobId requirement for Applicant type
                } as any}
                type="applicant"
                onSwipe={handleSwipe}
                onExpand={() => setShowDetails(true)}
                active={isTop}
                zIndex={idx}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Tinder-style Action Buttons */}
      <div className="relative z-20 flex items-center gap-6 mt-10">
        <Button
          variant="outline"
          size="icon"
          className="w-16 h-16 rounded-full border-2 border-destructive/20 bg-background/50 backdrop-blur-md text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-all hover:scale-110 active:scale-95 group shadow-xl"
          onClick={() => handleSwipe("pass")}
        >
          <XIcon className="w-8 h-8 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-16 h-16 rounded-full border-2 border-success/20 bg-background/50 backdrop-blur-md text-success hover:bg-success/10 hover:border-success/50 transition-all hover:scale-110 active:scale-95 group shadow-xl"
          onClick={() => handleSwipe("like")}
        >
          <Heart className="w-8 h-8 fill-success/20 group-hover:fill-success/50 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] transition-all" />
        </Button>
      </div>

      <ApplicantDetailSheet
        applicant={showDetails && talent ? talent[currentIndex] : null}
        onClose={() => setShowDetails(false)}
        onLike={() => { setShowDetails(false); handleSwipe("like"); }}
        onPass={() => { setShowDetails(false); handleSwipe("pass"); }}
        isPending={swipeMutation.isPending}
      />
    </div>
  );
}
