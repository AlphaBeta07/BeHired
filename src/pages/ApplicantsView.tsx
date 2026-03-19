import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetJobApplicants, useEmployerSwipe, useGetJobById } from "@/lib/api/hooks";
import { SwipeCard } from "@/components/SwipeCard";
import { MatchModal } from "@/components/MatchModal";
import { Button } from "@/components/ui/button";
import { Heart, X as XIcon, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ApplicantsView() {
  const params = useParams();
  const jobId = params.jobId || "";
  
  const { data: job } = useGetJobById(jobId);
  const { data: applicants, isLoading, refetch } = useGetJobApplicants(jobId);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchData, setMatchData] = useState<any>(null);

  const swipeMutation = useEmployerSwipe();

  const handleSwipe = async (direction: "like" | "pass") => {
    if (!applicants || currentIndex >= applicants.length) return;
    
    const applicant = applicants[currentIndex];
    setCurrentIndex(prev => prev + 1);
    
    try {
      const result = await swipeMutation.mutateAsync({
        data: {
          jobId,
          applicantId: applicant.applicantId,
          direction
        }
      });
      
      if (result.matched) {
        setMatchData({
          applicant,
          job
        });
      }
    } catch (e) {
      console.error("Failed to record swipe", e);
    }
  };

  const hasMore = applicants && currentIndex < applicants.length;

  return (
    <div className="min-h-screen bg-background pt-12 pb-32 flex flex-col items-center">
      <div className="w-full max-w-md mb-6 px-4">
        <Link href="/my-listings" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to jobs
        </Link>
        <h1 className="text-2xl font-bold font-display leading-tight">{job?.title || "Loading..."}</h1>
        <p className="text-muted-foreground">Reviewing applicants</p>
      </div>

      <div className="relative w-full max-w-md h-[600px] flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p className="font-semibold">Loading applicants...</p>
          </div>
        ) : !hasMore ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center p-8 bg-card rounded-3xl border border-border shadow-xl h-full w-full"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2 font-display">Inbox zero!</h3>
            <p className="text-muted-foreground mb-8">You've reviewed all current applicants for this position.</p>
            <Button variant="outline" onClick={() => refetch()} className="rounded-full font-bold">
              Check for new applicants
            </Button>
          </motion.div>
        ) : (
          <div className="w-full h-full relative">
            <AnimatePresence>
              {applicants?.slice(currentIndex, currentIndex + 3).reverse().map((applicant, idx, arr) => {
                const isTop = idx === arr.length - 1;
                return (
                  <SwipeCard
                    key={applicant.id}
                    data={applicant}
                    type="applicant"
                    onSwipe={handleSwipe}
                    active={isTop}
                    zIndex={idx}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Manual Swipe Buttons */}
      <div className="mt-10 flex gap-6 z-10">
        <button 
          onClick={() => handleSwipe("pass")}
          disabled={!hasMore || swipeMutation.isPending}
          className="w-16 h-16 rounded-full bg-white border border-border shadow-lg flex items-center justify-center text-destructive hover:bg-destructive hover:text-white hover:border-destructive transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          <XIcon className="w-8 h-8 stroke-[3px]" />
        </button>
        <button 
          onClick={() => handleSwipe("like")}
          disabled={!hasMore || swipeMutation.isPending}
          className="w-16 h-16 rounded-full bg-white border border-border shadow-lg flex items-center justify-center text-success hover:bg-success hover:text-white hover:border-success transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Heart className="w-8 h-8 fill-current stroke-[1.5px]" />
        </button>
      </div>

      <MatchModal
        isOpen={!!matchData}
        onClose={() => setMatchData(null)}
        title="It's a Match!"
        subtitle={`You can now contact ${matchData?.applicant?.name}.`}
        image1={matchData?.job?.companyLogo}
        image2={matchData?.applicant?.avatar}
        name1={matchData?.job?.company || "Company"}
        name2={matchData?.applicant?.name || "Applicant"}
      />
    </div>
  );
}
