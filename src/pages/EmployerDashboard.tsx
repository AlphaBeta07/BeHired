import { useGetMyJobs } from "@/lib/api/hooks";
import { Link } from "wouter";
import { Plus, Users, MapPin, Briefcase, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function EmployerDashboard() {
  const { data: jobs, isLoading } = useGetMyJobs();

  return (
    <div className="min-h-screen bg-background pt-14 pb-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">My Listings</h1>
            <p className="text-white/50 text-sm mt-1">Manage your jobs and internships.</p>
          </div>
          <Link href="/post-job">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white text-sm bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/30 hover:opacity-90 transition-all hover:scale-105 active:scale-95">
              <Plus className="w-4 h-4" />
              Post Job
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 glass-card rounded-2xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : jobs?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-24 glass-card rounded-3xl border border-white/10 border-dashed"
          >
            <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mb-6">
              <Briefcase className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">No listings yet</h2>
            <p className="text-white/50 text-sm mb-8 max-w-[220px]">Post your first listing to start getting matches from top candidates.</p>
            <Link href="/post-job">
              <button className="px-8 py-3 rounded-full font-bold text-white text-sm bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/30 hover:opacity-90 transition-all hover:scale-105">
                Create Listing
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {jobs?.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/applicants/${job.id}`}>
                  <div className="glass-card rounded-2xl border border-white/8 p-4 flex items-center gap-4 hover:border-primary/30 transition-all cursor-pointer group">
                    {/* Logo */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-xl">
                      {job.company?.charAt(0)?.toUpperCase() || "J"}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-white text-base truncate">{job.title}</h3>
                        <span className="text-xs font-bold bg-white/10 text-white/60 px-2 py-0.5 rounded-full capitalize flex-shrink-0">
                          {job.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{job.location}
                          </span>
                        )}
                        {job.remote && (
                          <span className="text-success font-semibold">Remote</span>
                        )}
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Applicants CTA */}
                    <div className="flex items-center gap-2 text-primary flex-shrink-0">
                      <div className="flex items-center gap-1.5 font-bold bg-primary/10 px-3 py-1.5 rounded-full">
                        <Users className="w-4 h-4" />
                        <span>{(job as any).applicantCount || 0}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform opacity-50" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
