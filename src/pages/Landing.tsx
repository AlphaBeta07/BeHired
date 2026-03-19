import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Flame, Heart, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const { isAuthenticated, isJobseeker } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated) {
    setTimeout(() => {
      setLocation(isJobseeker ? "/swipe" : "/my-listings");
    }, 0);
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Full-bleed hero section */}
      <main className="flex-1 flex flex-col">
        {/* Tinder-style gradient hero */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-32 overflow-hidden">
          {/* Animated gradient background orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/15 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px]" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            {/* BeHired logo badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2 mb-10"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/40">
                <Flame className="w-9 h-9 text-white fill-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6"
            >
              Swipe Right on<br />
              <span className="gradient-text">Your Dream Job</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/60 leading-relaxed mb-10 max-w-lg mx-auto"
            >
              Stop sending resumes into a void. Match directly with employers who want you. It's like Tinder — but for your career.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg font-bold px-10 h-14 rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-2xl shadow-primary/30 border-0 transition-all hover:scale-105 active:scale-95"
                >
                  Create Free Account
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg font-bold px-10 h-14 rounded-full border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                >
                  Log In
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Floating card previews */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative z-10 mt-20 w-full max-w-sm mx-auto"
          >
            {/* Back cards (stacked) */}
            <div className="absolute inset-x-8 -top-4 h-64 bg-white/5 border border-white/10 rounded-[28px] rotate-[-6deg]" />
            <div className="absolute inset-x-4 -top-2 h-64 bg-white/8 border border-white/10 rounded-[28px] rotate-[-3deg]" />

            {/* Front card */}
            <div className="relative bg-gradient-to-br from-primary/80 to-accent/80 rounded-[28px] h-64 p-6 shadow-2xl shadow-primary/30 overflow-hidden border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-black text-2xl mb-1">Software Engineer</p>
                <p className="text-white/80 font-semibold text-sm">TechCorp • San Francisco, CA</p>
                <div className="flex gap-2 mt-3">
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">React</span>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">TypeScript</span>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">Remote</span>
                </div>
              </div>
              {/* LIKE stamp */}
              <div className="absolute top-6 left-6 border-[3px] border-success text-success font-black text-2xl px-3 py-0.5 rounded-lg rotate-[-12deg] bg-black/20 backdrop-blur-sm tracking-widest">
                LIKE
              </div>
            </div>

            {/* Action buttons below card */}
            <div className="flex justify-center gap-5 mt-6">
              <div className="w-14 h-14 rounded-full bg-card border border-white/10 flex items-center justify-center shadow-xl">
                <span className="text-destructive text-2xl font-black">✕</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/40">
                <Heart className="w-7 h-7 text-white fill-white" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features strip */}
        <section className="py-20 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Instant Matches", desc: "Know immediately when a company is interested. Zero waiting, zero guessing." },
              { icon: Heart, title: "Mutual Interest", desc: "Only connect when both sides say yes. Like Tinder — but it pays your bills." },
              { icon: Star, title: "Quality First", desc: "Every role is vetted. Every applicant is serious. No noise." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-3xl p-6 hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to find your match?</h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">Join thousands of job seekers and employers already making real connections on BeHired.</p>
          <Link href="/register">
            <Button className="h-14 px-12 rounded-full text-lg font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-2xl shadow-primary/30 border-0 hover:scale-105 active:scale-95 transition-all">
              Get Started Free
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Flame className="text-primary w-5 h-5 fill-primary" />
            <span className="font-bold text-white/70">BeHired</span>
          </div>
          <p className="text-white/30 text-sm">© {new Date().getFullYear()} BeHired. Swipe your way to success.</p>
        </div>
      </footer>
    </div>
  );
}
