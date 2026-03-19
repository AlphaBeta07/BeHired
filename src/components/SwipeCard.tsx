import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { Briefcase, MapPin, DollarSign, Building2, ChevronUp } from "lucide-react";
import type { Job, Applicant } from "@/lib/api/types";

interface SwipeCardProps {
  data: Job | Applicant;
  type: "job" | "applicant";
  onSwipe: (direction: "like" | "pass") => void;
  onExpand?: () => void;
  active: boolean;
  zIndex: number;
}

export function SwipeCard({ data, type, onSwipe, onExpand, active, zIndex }: SwipeCardProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-300, -200, 0, 200, 300], [0, 1, 1, 1, 0]);
  
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [0, -100], [0, 1]);

  const handleDragEnd = async (e: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    if (offset > 150 || velocity > 500) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe("like");
    } else if (offset < -150 || velocity < -500) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe("pass");
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  const isJob = type === "job";
  const job = data as Job;
  const applicant = data as Applicant;

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full flex items-center justify-center origin-bottom"
      style={{ zIndex, rotate, x, opacity }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileTap={active ? { scale: 1.02, cursor: "grabbing" } : {}}
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-full max-w-[340px] h-[560px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative group cursor-grab bg-slate-900 border-none select-none">
        
        {/* Full Bleed Background Image or Gradient */}
        <div className="absolute inset-0">
          {(isJob ? job.companyLogo : applicant.avatar) ? (
            <img src={isJob ? job.companyLogo! : applicant.avatar!} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-primary to-accent flex flex-col items-center justify-center opacity-90">
              <span className="text-[120px] text-white/40 font-black drop-shadow-xl">
                {(isJob ? job.company : applicant.name).charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />

        {/* Swipe Indicators */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-5 z-20 pointer-events-none">
          <div className="border-[4px] border-success text-success text-3xl tracking-widest font-black px-3 py-0.5 rounded-xl uppercase rotate-[-15deg] bg-black/20 backdrop-blur-sm">
            LIKE
          </div>
        </motion.div>
        
        <motion.div style={{ opacity: passOpacity }} className="absolute top-10 right-5 z-20 pointer-events-none">
          <div className="border-[4px] border-destructive text-destructive text-3xl tracking-widest font-black px-3 py-0.5 rounded-xl uppercase rotate-[15deg] bg-black/20 backdrop-blur-sm">
            NOPE
          </div>
        </motion.div>

        {/* Content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col text-white z-10">
          
          {/* Title + expand button row */}
          <div className="flex items-end justify-between mb-1">
            <h2 className="text-2xl font-black leading-tight tracking-tight drop-shadow-md pr-3 line-clamp-2">
              {isJob ? job.title : applicant.name}
            </h2>
            {/* Tap to expand button */}
            {active && onExpand && (
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); onExpand(); }}
                className="flex-shrink-0 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all active:scale-95"
                title="View full details"
              >
                <ChevronUp className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
          
          <div className="flex items-center text-white/85 font-semibold text-base gap-2 mb-2">
            {isJob ? <Building2 className="w-4 h-4 flex-shrink-0" /> : <Briefcase className="w-4 h-4 flex-shrink-0" />}
            <span className="truncate">{isJob ? job.company : "Applicant"}</span>
          </div>
          
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {(isJob ? job.location : applicant.location) && (
              <div className="flex items-center gap-1 text-xs font-medium text-white/70">
                <MapPin className="w-3 h-3" /> {isJob ? job.location : applicant.location}
              </div>
            )}
            {isJob && job.salary && (
              <div className="flex items-center gap-1 text-xs font-medium text-success">
                <DollarSign className="w-3 h-3" /> {job.salary}
              </div>
            )}
            <div className="flex gap-1.5 flex-wrap">
              {isJob && job.type === "internship" && (
                <span className="px-2 py-0.5 bg-white/15 backdrop-blur-md rounded-full text-[11px] font-bold text-white border border-white/10">
                  Internship
                </span>
              )}
              {isJob && job.remote && (
                <span className="px-2 py-0.5 bg-success/30 rounded-full text-[11px] font-bold text-success border border-success/20">
                  Remote
                </span>
              )}
            </div>
          </div>

          {/* Description truncated */}
          <p className="text-xs text-white/65 line-clamp-2 leading-relaxed border-l-2 border-white/20 pl-2.5 mb-3">
            {isJob ? job.description : applicant.bio}
          </p>

          {/* Tags */}
          {((isJob ? job.tags : applicant.skills)?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {(isJob ? job.tags : applicant.skills)?.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2.5 py-0.5 bg-black/50 border border-white/10 text-white rounded-full text-[11px] font-medium backdrop-blur-sm">
                  {tag}
                </span>
              ))}
              {((isJob ? job.tags : applicant.skills)?.length ?? 0) > 3 && (
                <span className="px-2.5 py-0.5 bg-black/50 text-white/60 rounded-full text-[11px] backdrop-blur-sm">
                  +{(isJob ? job.tags : applicant.skills)!.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Expand hint */}
          {active && onExpand && (
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onExpand(); }}
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white/70 text-xs font-semibold hover:bg-white/15 transition-all"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              Tap to see full details
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
