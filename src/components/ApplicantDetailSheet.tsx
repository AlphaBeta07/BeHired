import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Briefcase, FileText, Calendar, Heart, XCircle, Mail, Download } from "lucide-react";
import type { Applicant } from "@/lib/api/types";

interface ApplicantDetailSheetProps {
  applicant: Applicant | null;
  onClose: () => void;
  onLike: () => void;
  onPass: () => void;
  isPending?: boolean;
}

export function ApplicantDetailSheet({ applicant, onClose, onLike, onPass, isPending }: ApplicantDetailSheetProps) {
  if (!applicant) return null;

  return (
    <AnimatePresence>
      {applicant && (
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
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-[32px] sm:rounded-[32px] z-10 pb-6"
            style={{ background: "hsl(0, 0%, 10%)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-4 pb-2 sm:hidden">
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all z-20 backdrop-blur-md"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Hero banner */}
            <div className="relative h-56 overflow-hidden rounded-t-[32px] sm:rounded-t-[32px]">
              {applicant.avatar ? (
                <img src={applicant.avatar} alt={applicant.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white/40 font-black text-6xl">{applicant.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Title inside hero area */}
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight mb-1">{applicant.name}</h2>
                  <div className="flex items-center gap-2 text-primary/90 font-semibold">
                    <Briefcase className="w-4 h-4" />
                    <span>Applicant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                {applicant.location ? (
                  <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-3 border border-white/8">
                    <MapPin className="w-4 h-4 text-white/50 flex-shrink-0" />
                    <span className="text-white/80 text-sm font-medium truncate">{applicant.location}</span>
                  </div>
                ) : null}
                {applicant.email ? (
                  <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-3 border border-white/8 col-span-2">
                    <Mail className="w-4 h-4 text-white/50 flex-shrink-0" />
                    <span className="text-white/80 text-sm font-medium truncate">{applicant.email}</span>
                  </div>
                ) : null}
                {applicant.swipedAt ? (
                  <div className="col-span-2 sm:col-span-1 flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-3 border border-white/8">
                    <Calendar className="w-4 h-4 text-white/50 flex-shrink-0" />
                    <span className="text-white/80 text-sm font-medium truncate">
                      Swiped on {new Date(applicant.swipedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Resume Download/View */}
              {applicant.resumeUrl && (
                <div>
                  <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">Resume</h3>
                  <a
                    href={applicant.resumeUrl}
                    download={`${applicant.name.replace(/\s+/g, '_')}_Resume.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full bg-primary/10 hover:bg-primary/20 transition-colors rounded-2xl border border-primary/20 px-5 py-4 group"
                  >
                    <div className="flex items-center gap-3 text-primary">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-primary">View Full Resume</span>
                        <span className="text-xs text-primary/60">PDF Document</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Download className="w-4 h-4" />
                    </div>
                  </a>
                </div>
              )}

              {/* Bio */}
              <div>
                <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-2">About Jobseeker</h3>
                <p className="text-white/75 text-sm leading-relaxed border-l-2 border-white/10 pl-3">
                  {applicant.bio || "No bio provided."}
                </p>
              </div>

              {/* Skills / Tags */}
              {(applicant.skills?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills!.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/90 rounded-full text-xs font-semibold backdrop-blur-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
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
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-success/90 to-success text-white font-bold shadow-lg shadow-success/20 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  Match
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
