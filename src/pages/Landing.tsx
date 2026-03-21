import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import {
  Zap, Heart, Star, Users, TrendingUp, Shield, Globe,
  CheckCircle, ArrowRight, Briefcase, Search, Moon, Sun
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: "easeOut" as const }
});

const FEATURES = [
  { icon: Zap,        title: "Instant Matching",     desc: "Our smart algorithm connects you with opportunities the moment both sides swipe right."  },
  { icon: Search,     title: "Talent Discovery",      desc: "Employers browse a curated pool of pre-vetted job seekers — no more cold outreach."     },
  { icon: Heart,      title: "Mutual Interest Only",  desc: "Zero spam. Conversations only start when both parties genuinely want to connect."         },
  { icon: Shield,     title: "Verified Profiles",     desc: "Every profile is reviewed to keep the quality of connections consistently high."          },
  { icon: Globe,      title: "Remote-Friendly",       desc: "Filter by remote, hybrid, or on-site. Find the arrangement that works for your life."    },
  { icon: TrendingUp, title: "Career Growth",         desc: "Track your market value and get insights on in-demand skills for your target role."      },
];

const STATS = [
  { label: "Jobs Listed",        value: "12,400+" },
  { label: "Successful Matches", value: "8,900+"  },
  { label: "Active Employers",   value: "3,200+"  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Frontend Developer @ Infosys",
    quote: "I got 3 interview calls in my first week. The mutual-interest model means every employer actually wants to talk to me.",
    stars: 5,
  },
  {
    name: "Rahul Desai",
    role: "Hiring Manager @ Razorpay",
    quote: "The talent pool quality is incredible. We hired two engineers in two weeks — faster than any job board we've used.",
    stars: 5,
  },
];

export default function Landing() {
  const { isAuthenticated, isJobseeker } = useAuth();
  const [, setLocation] = useLocation();
  const { isDark, toggle } = useTheme();

  if (isAuthenticated) {
    setTimeout(() => setLocation(isJobseeker ? "/swipe" : "/my-listings"), 0);
    return null;
  }

  // Dynamic class helpers — theme-aware
  const bg        = isDark ? "bg-[#111111]"          : "bg-white";
  const bgMuted   = isDark ? "bg-[#191919]"          : "bg-gray-50";
  const text      = isDark ? "text-white"             : "text-gray-900";
  const textMuted = isDark ? "text-white/50"          : "text-gray-500";
  const border    = isDark ? "border-white/8"         : "border-gray-100";
  const cardBg    = isDark ? "bg-[#1a1a1a]"          : "bg-white";
  const navBg     = isDark ? "bg-[#111111]/85"       : "bg-white/80";
  const navBorder = isDark ? "border-white/8"        : "border-gray-100";
  const navText   = isDark ? "text-white/60"          : "text-gray-500";
  const navHover  = isDark ? "hover:text-white"       : "hover:text-gray-900";
  const iconBtn   = isDark
    ? "border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-800";
  const loginBtn  = isDark ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-900";
  const getStartedBtn = isDark
    ? "bg-white text-gray-900 hover:bg-gray-100"
    : "bg-gray-900 hover:bg-gray-700 text-white";
  const statBg    = isDark ? "bg-[#1a1a1a] border border-white/10 border-dashed" : "bg-white border border-dashed border-gray-300";
  const stepBg    = isDark ? "bg-[#1a1a1a] border border-white/8"                : "bg-white border border-gray-100";
  const stepNum   = isDark ? "text-white/5"           : "text-gray-100";
  const reviewBg  = isDark ? "bg-[#1a1a1a] border border-white/8"               : "bg-white border border-gray-100";
  const badgeBg   = isDark ? "bg-white/8 border-white/10 text-white/60"          : "bg-gray-100 border-gray-200 text-gray-600";
  const companyText = isDark ? "text-white/15"        : "text-gray-300";
  const heroBg    = isDark
    ? "bg-gradient-to-br from-[#1a0a0e] via-[#111111] to-[#0d0d0d]"
    : "bg-white";

  return (
    <div className={`min-h-screen ${bg} font-sans overflow-x-hidden transition-colors duration-300`}>

      {/* ── NAV ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${navBg} backdrop-blur-lg border-b ${navBorder} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/Gemini_Generated_Image_kfiw8akfiw8akfiw.png"
              alt="BeHired Logo"
              className="w-9 h-9 object-contain rounded-xl"
            />
            <span className={`font-black text-lg tracking-tight ${text}`}>BeHired</span>
          </Link>
          <nav className={`hidden md:flex items-center gap-8 text-sm font-semibold ${navText}`}>
            <a href="#features"      className={`${navHover} transition-colors`}>Features</a>
            <a href="#how-it-works"  className={`${navHover} transition-colors`}>How It Works</a>
            <a href="#testimonials"  className={`${navHover} transition-colors`}>Testimonials</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all shadow-sm ${iconBtn}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/login">
              <Button variant="ghost" size="sm" className={`font-semibold ${loginBtn}`}>Login</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className={`rounded-full px-5 font-bold shadow-none border-0 ${getStartedBtn}`}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className={`relative pt-32 pb-24 px-6 overflow-hidden ${heroBg} transition-colors duration-300`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[120px] ${isDark ? "bg-gradient-to-r from-[#e5405e]/15 via-[#a855f7]/10 to-[#3b82f6]/10" : "bg-gradient-to-r from-[#e5405e]/8 via-[#a855f7]/6 to-[#3b82f6]/6"}`} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp(0)} className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold mb-8 ${badgeBg}`}>
            <span className="w-2 h-2 rounded-full bg-[#e5405e] animate-pulse" />
            Now Live — Join the waitlist
          </motion.div>

          <motion.h1 {...fadeUp(0.08)} className={`text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter ${text} leading-[1.05] mb-6`}>
            Don't just apply.<br />
            <span className="bg-gradient-to-r from-[#e5405e] via-[#a855f7] to-[#f97316] bg-clip-text text-transparent">
              Get BeHired.
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.15)} className={`text-lg ${textMuted} leading-relaxed mb-10 max-w-xl mx-auto`}>
            The Tinder for jobs. Swipe right on your dream role, let employers discover you,
            and only connect when both sides say yes. No spam. No cold applications.
          </motion.p>

          <motion.div {...fadeUp(0.22)} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-8 h-12 bg-gradient-to-r from-[#e5405e] to-[#f97316] hover:opacity-90 text-white font-bold border-0 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#e5405e]/20">
                Create Free Account <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className={`rounded-full px-8 h-12 font-semibold transition-all hover:scale-105 active:scale-95 ${isDark ? "border-white/15 text-white bg-white/5 hover:bg-white/10" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                I'm an Employer
              </Button>
            </Link>
          </motion.div>

          <motion.p {...fadeUp(0.3)} className={`mt-10 text-xs font-medium tracking-wide uppercase ${textMuted}`}>
            Trusted by teams at
          </motion.p>
          <motion.div {...fadeUp(0.35)} className="flex flex-wrap items-center justify-center gap-8 mt-4">
            {["Razorpay", "Zepto", "CRED", "Groww", "Meesho"].map(name => (
              <span key={name} className={`text-sm font-black tracking-wide ${companyText}`}>{name}</span>
            ))}
          </motion.div>
        </div>

        {/* Hero card mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
          className="relative max-w-sm mx-auto mt-20"
        >
          <div className={`absolute inset-x-10 -top-5 h-60 rounded-[28px] rotate-[-6deg] shadow-sm ${isDark ? "bg-white/4 border border-white/8" : "bg-gradient-to-br from-purple-50 to-pink-50 border border-gray-200"}`} />
          <div className={`absolute inset-x-5 -top-2 h-60 rounded-[28px] rotate-[-3deg] shadow-sm ${isDark ? "bg-white/6 border border-white/8" : "bg-gradient-to-br from-orange-50 to-red-50 border border-gray-200"}`} />
          <div className="relative bg-gradient-to-br from-[#e5405e] to-[#f97316] rounded-[28px] h-64 p-6 shadow-2xl shadow-[#e5405e]/25 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white font-black text-2xl mb-1">Senior Backend Engineer</p>
              <p className="text-white/80 font-semibold text-sm">Razorpay · Bangalore, IN</p>
              <div className="flex gap-2 mt-3">
                {["Node.js", "Go", "Remote"].map(t => (
                  <span key={t} className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">{t}</span>
                ))}
              </div>
            </div>
            <div className="absolute top-6 left-6 border-[3px] border-green-400 text-green-400 font-black text-2xl px-3 py-0.5 rounded-lg rotate-[-12deg] bg-black/20 backdrop-blur-sm tracking-widest">
              LIKED
            </div>
          </div>
          <div className="flex justify-center gap-5 mt-5">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg text-red-400 text-2xl font-black border ${isDark ? "bg-white/5 border-white/10" : "bg-white border border-gray-200"}`}>✕</div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#e5405e] to-[#f97316] flex items-center justify-center shadow-xl shadow-[#e5405e]/30">
              <Heart className="w-7 h-7 text-white fill-white" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className={`py-14 px-6 ${bgMuted} border-y ${isDark ? "border-white/6" : "border-gray-100"} transition-colors duration-300`}>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`text-center p-6 rounded-2xl ${statBg}`}>
              <div className={`text-3xl font-black ${text} mb-1`}>{s.value}</div>
              <div className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className={`py-24 px-6 ${bg} transition-colors duration-300`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <motion.p {...fadeUp(0)} className="text-xs font-bold uppercase tracking-widest text-[#e5405e] mb-3">Everything You Need</motion.p>
            <motion.h2 {...fadeUp(0.05)} className={`text-4xl md:text-5xl font-black ${text} tracking-tight mb-4`}>
              Built for how hiring <span className="bg-gradient-to-r from-[#e5405e] to-[#f97316] bg-clip-text text-transparent">actually works</span>
            </motion.h2>
            <motion.p {...fadeUp(0.1)} className={`${textMuted} max-w-lg mx-auto leading-relaxed`}>
              From discovery to match — BeHired handles every step so you can focus on the conversation, not the application.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className={`group p-6 rounded-2xl ${cardBg} border ${border} border-l-4 border-l-transparent hover:border-l-[#e5405e] hover:border-[#e5405e]/15 hover:shadow-xl hover:shadow-[#e5405e]/5 transition-all hover:-translate-y-1`}>
                <div className="w-10 h-10 rounded-xl bg-[#e5405e]/10 flex items-center justify-center mb-4 group-hover:bg-[#e5405e]/20 transition-colors">
                  <f.icon className="w-5 h-5 text-[#e5405e]" />
                </div>
                <h3 className={`font-bold ${text} mb-2`}>{f.title}</h3>
                <p className={`text-sm ${textMuted} leading-relaxed`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className={`py-24 px-6 ${bgMuted} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.p {...fadeUp(0)} className="text-xs font-bold uppercase tracking-widest text-[#e5405e] mb-3">How It Works</motion.p>
          <motion.h2 {...fadeUp(0.05)} className={`text-4xl font-black ${text} mb-14`}>Three steps to your match</motion.h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { step: "01", icon: Briefcase, title: "Create Your Profile", desc: "Sign up, add your skills and resume, and set your preferences in under 3 minutes." },
              { step: "02", icon: Heart,     title: "Swipe & Discover",    desc: "Browse jobs or talent. Swipe right to express interest, left to skip. No pressure." },
              { step: "03", icon: Users,     title: "It's a Match!",       desc: "When both sides swipe right, you get connected instantly. Start the conversation." },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className={`relative p-6 rounded-2xl ${stepBg}`}>
                <span className={`text-6xl font-black absolute top-4 right-5 leading-none ${stepNum}`}>{s.step}</span>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e5405e] to-[#f97316] flex items-center justify-center mb-4 shadow-lg shadow-[#e5405e]/20">
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className={`font-black ${text} mb-2 text-lg`}>{s.title}</h3>
                <p className={`text-sm ${textMuted} leading-relaxed`}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className={`py-24 px-6 ${bg} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 {...fadeUp(0)} className={`text-4xl font-black ${text} mb-3`}>
            Loved by <span className="bg-gradient-to-r from-[#e5405e] to-[#f97316] bg-clip-text text-transparent">thousands</span>
          </motion.h2>
          <motion.p {...fadeUp(0.05)} className={`${textMuted} mb-12`}>Don't take our word for it — here's what real users say.</motion.p>
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`text-left p-6 rounded-2xl ${reviewBg} shadow-sm`}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className={`${isDark ? "text-white/70" : "text-gray-700"} leading-relaxed mb-5 text-sm`}>"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e5405e] to-[#f97316] flex items-center justify-center text-white font-black text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className={`font-bold ${text} text-sm`}>{t.name}</p>
                    <p className="text-xs text-[#e5405e] font-semibold">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-24 px-6 bg-gray-900 text-white text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Ready to find your <br />
            <span className="bg-gradient-to-r from-[#e5405e] via-[#f97316] to-[#a855f7] bg-clip-text text-transparent">perfect match?</span>
          </h2>
          <p className="text-white/50 mb-10 leading-relaxed">
            Join thousands of job seekers and employers already making real connections on BeHired.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-8 h-12 bg-gradient-to-r from-[#e5405e] to-[#f97316] hover:opacity-90 text-white font-bold border-0 transition-all hover:scale-105 active:scale-95">
                Create Free Account <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 border-white/20 text-white bg-white/5 hover:bg-white/10 font-semibold transition-all hover:scale-105">
                Sign In
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-white/30">
            {["Free forever plan", "No credit card needed", "Cancel anytime"].map(t => (
              <span key={t} className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-400" />{t}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={`border-t py-8 px-6 ${isDark ? "bg-[#0d0d0d] border-white/5" : "bg-gray-900 border-white/5"} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/images/Gemini_Generated_Image_kfiw8akfiw8akfiw.png"
              alt="BeHired Logo"
              className="w-7 h-7 object-contain"
            />
            <span className="font-black text-white/80">BeHired</span>
          </div>
          <p className="text-white/25 text-sm">© {new Date().getFullYear()} BeHired · Swipe your way to success.</p>
          <div className="flex gap-5 text-sm text-white/30 font-medium">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
