import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegisterUser, getGetCurrentUserQueryKey } from "@/lib/api/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Briefcase, ChevronRight, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["jobseeker", "employer"], { required_error: "Please select a role" }),
});

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"role" | "details">("role");
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", role: "jobseeker" },
  });

  const registerMutation = useRegisterUser({
    mutation: {
      onSuccess: (data) => {
        queryClient.setQueryData(getGetCurrentUserQueryKey(), data);
        toast({ title: "Account created! 🎉", description: "Welcome to BeHired." });
        setLocation(data.role === "jobseeker" ? "/swipe" : "/my-listings");
      },
      onError: (error: any) => {
        toast({ 
          title: "Registration failed", 
          description: error?.data?.error || error?.message || "Could not create account. Please try again.",
          variant: "destructive" 
        });
      }
    }
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate({ data: values });
  };

  const selectedRole = form.watch("role");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* BG orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30 mb-4">
            <Flame className="w-9 h-9 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {step === "role" ? "I am a..." : "Create Account"}
          </h1>
          <p className="text-white/50 text-sm mt-1 font-medium">
            {step === "role" ? "How do you want to use BeHired?" : "Just a few details to get started."}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-7">
          <AnimatePresence mode="wait">
            {step === "role" ? (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {/* Job Seeker */}
                <button
                  type="button"
                  onClick={() => form.setValue("role", "jobseeker")}
                  className={cn(
                    "w-full flex items-center p-4 rounded-2xl border-2 transition-all text-left",
                    selectedRole === "jobseeker"
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  )}
                >
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center mr-4 transition-colors flex-shrink-0",
                    selectedRole === "jobseeker" ? "bg-primary text-white" : "bg-white/10 text-white/50"
                  )}>
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white">Job Seeker</p>
                    <p className="text-xs text-white/50 mt-0.5">I'm looking for a job or internship</p>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 transition-colors", selectedRole === "jobseeker" ? "text-primary" : "text-white/20")} />
                </button>

                {/* Employer */}
                <button
                  type="button"
                  onClick={() => form.setValue("role", "employer")}
                  className={cn(
                    "w-full flex items-center p-4 rounded-2xl border-2 transition-all text-left",
                    selectedRole === "employer"
                      ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  )}
                >
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center mr-4 transition-colors flex-shrink-0",
                    selectedRole === "employer" ? "bg-accent text-white" : "bg-white/10 text-white/50"
                  )}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white">Employer</p>
                    <p className="text-xs text-white/50 mt-0.5">I want to hire great talent</p>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 transition-colors", selectedRole === "employer" ? "text-accent" : "text-white/20")} />
                </button>

                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="w-full mt-3 py-3.5 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Continue <ChevronRight className="inline w-4 h-4 ml-1" />
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      placeholder={selectedRole === "employer" ? "Company / Recruiter Name" : "John Doe"}
                      className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                      {...form.register("name")}
                    />
                  </div>
                  {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                      {...form.register("email")}
                    />
                  </div>
                  {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="password"
                      placeholder="Min. 6 characters"
                      className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                      {...form.register("password")}
                    />
                  </div>
                  {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep("role")}
                    className="px-5 py-3 rounded-2xl font-bold text-white/70 text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="flex-1 py-3 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {registerMutation.isPending ? "Creating..." : "Create Account"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-sm text-white/40 font-medium mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
