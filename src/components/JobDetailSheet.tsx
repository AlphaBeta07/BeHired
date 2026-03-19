import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, DollarSign, Building2, Briefcase, CheckCircle2, Wifi, Calendar, ExternalLink, Heart, XCircle } from "lucide-react";
import type { Job } from "@/lib/api/types";

interface JobDetailSheetProps {
  job: Job | null;
  onClose: () => void;
  onLike: () => void;
  onPass: () => void;
  isPending?: boolean;
}

export function JobDetailSheet({ job, onClose, onLike, onPass, isPending }: JobDetailSheetProps) {
  if (!job) return null;

  return (
    <AnimatePresence>
      {job && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 35 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-[32px] sm:rounded-[32px] z-10"
            style={{ background: "hsl(0, 0%, 10%)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-4 pb-2 sm:hidden">
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Hero banner */}
            <div className="relative h-48 overflow-hidden rounded-t-[32px] sm:rounded-t-[32px]">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-accent" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

              {/* Company logo badge */}
              <div className="absolute bottom-4 left-5 flex items-end gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-black text-2xl shadow-xl">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    job.company.charAt(0).toUpperCase()
                  )}
                </div>
              </div>

              {/* Type & Remote badges */}
              <div className="absolute top-4 left-5 flex gap-2">
                {job.type === "internship" && (
                  <span className="px-3 py-1 bg-accent/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                    Internship
                  </span>
                )}
                {job.remote && (
                  <span className="px-3 py-1 bg-success/90 text-white text-xs font-bold rounded-full backdrop-blur-sm flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> Remote
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Title & company */}
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-1">{job.title}</h2>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Building2 className="w-4 h-4" />
                  <span>{job.company}</span>
                </div>
              </div>

              {/* Meta info grid */}
              <div className="grid grid-cols-2 gap-3">
                {job.location && (
                  <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-3 border border-white/8">
                    <MapPin className="w-4 h-4 text-white/50 flex-shrink-0" />
                    <span className="text-white/80 text-sm font-medium truncate">{job.location}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-3 border border-white/8">
                    <DollarSign className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-success text-sm font-bold truncate">{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-3 border border-white/8">
                  <Briefcase className="w-4 h-4 text-white/50 flex-shrink-0" />
                  <span className="text-white/80 text-sm font-medium capitalize">{job.type}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-3 border border-white/8">
                  <Calendar className="w-4 h-4 text-white/50 flex-shrink-0" />
                  <span className="text-white/80 text-sm font-medium">{new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">About the Role</h3>
                <p className="text-white/75 text-sm leading-relaxed">{job.description}</p>
              </div>

              {/* Requirements */}
              {(job.requirements?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements!.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-white/75">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags / Skills */}
              {(job.tags?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">Skills & Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags!.map((tag, i) => (
                      <span key={i} className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2 pb-2">
                <button
                  onClick={() => { onPass(); onClose(); }}
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/70 font-bold hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5" />
                  Pass
                </button>
                <button
                  onClick={() => { onLike(); onClose(); }}
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold shadow-lg shadow-primary/30 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
