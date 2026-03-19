import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, X } from "lucide-react";
import { Link } from "wouter";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  image1?: string;
  image2?: string;
  name1: string;
  name2: string;
}

export function MatchModal({ isOpen, onClose, title, subtitle, image1, image2, name1, name2 }: MatchModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-sm text-center z-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-2 right-0 w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Gradient text header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-5xl font-black gradient-text mb-2 tracking-tight">
                {title}
              </h2>
              <p className="text-white/60 text-base font-medium mb-10">{subtitle}</p>
            </motion.div>

            {/* Overlapping avatars */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center justify-center mb-10"
            >
              {/* Avatar 1 */}
              <div className="relative w-[120px] h-[120px] rounded-full border-4 border-background shadow-2xl overflow-hidden z-10 translate-x-4">
                <AvatarFallback name={name1} url={image1} />
              </div>

              {/* Heart icon in middle */}
              <div className="relative z-20 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/40 -mx-2">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>

              {/* Avatar 2 */}
              <div className="relative w-[120px] h-[120px] rounded-full border-4 border-background shadow-2xl overflow-hidden z-10 -translate-x-4">
                <AvatarFallback name={name2} url={image2} />
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-3"
            >
              <Link href="/matches" onClick={onClose}>
                <button className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-primary to-accent shadow-xl shadow-primary/30 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Send Message
                </button>
              </Link>
              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl font-bold text-white/60 text-base bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                Keep Swiping
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function AvatarFallback({ name, url }: { name: string; url?: string }) {
  if (url) {
    return <img src={url} alt={name} className="w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-4xl">
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}
