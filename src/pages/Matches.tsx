import { useGetMatches } from "@/lib/api/hooks";
import { Link } from "wouter";
import { formatRelativeTime } from "@/lib/utils";
import { MessageCircle, Heart, MapPin, Calendar, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export default function Matches() {
  const { data: matches, isLoading } = useGetMatches();
  const { isEmployer, user } = useAuth();

  return (
    <div className="min-h-screen bg-background pt-14 pb-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 pt-4">
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">Your Matches</h1>
          <p className="text-white/50 text-sm">
            {isEmployer ? "Jobseekers who matched with your listings." : "Companies that swiped right on you too."}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 glass-card rounded-2xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : matches?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-24 glass-card rounded-3xl border border-white/10"
          >
            <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-9 h-9 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">No matches yet</h2>
            <p className="text-white/50 text-sm mb-8 max-w-[220px]">
              {isEmployer ? "Keep reviewing applicants to find your perfect hire." : "Keep swiping to find your next big opportunity."}
            </p>
            <Link href={isEmployer ? "/my-listings" : "/swipe"}>
              <button className="px-8 py-3 rounded-full font-bold text-white text-sm bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/30 hover:opacity-90 transition-all hover:scale-105 active:scale-95">
                {isEmployer ? "View Listings" : "Go Swiping"}
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {matches?.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl border border-white/8 p-4 flex items-center gap-4 hover:border-primary/30 transition-all group cursor-pointer"
              >
                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                  {(isEmployer ? match.applicantAvatar : match.companyLogo) ? (
                    <img 
                      src={isEmployer ? match.applicantAvatar : match.companyLogo} 
                      alt={isEmployer ? match.applicantName : match.company} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-xl">
                      {isEmployer 
                        ? match.applicantName?.charAt(0).toUpperCase() || "A"
                        : match.company?.charAt(0).toUpperCase() || "C"}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-base leading-tight truncate">
                    {isEmployer ? match.applicantName : match.jobTitle}
                  </h3>
                  <p className="text-primary font-semibold text-sm truncate flex items-center gap-1.5 mt-0.5">
                    {isEmployer ? <Briefcase className="w-3.5 h-3.5" /> : null}
                    {isEmployer ? `Applied for: ${match.jobTitle}` : match.company}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-white/30 text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatRelativeTime(match.matchedAt)}
                    </span>
                    <span className="text-success text-xs font-bold bg-success/10 px-2 flex items-center rounded-full">
                      ✓ Matched
                    </span>
                  </div>
                </div>

                {/* Message button */}
                <a
                  href={`mailto:${isEmployer ? 'hello@' + match.applicantName?.toLowerCase().replace(/\s/g, '') + '.com' : 'hello@' + match.company?.toLowerCase().replace(/\s/g, '') + '.com'}`}
                  className="w-11 h-11 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all flex-shrink-0 group-hover:scale-110"
                  onClick={e => e.stopPropagation()}
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
