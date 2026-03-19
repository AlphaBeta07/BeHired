import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetMyProfile, useUpdateMyProfile } from "@/lib/api/hooks";
import { useToast } from "@/hooks/use-toast";
import { User, Camera, Link as LinkIcon, MapPin, Loader2, FileText, Upload, CheckCircle2, Trash2, Briefcase, Building2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  bio: z.string().optional(),
  location: z.string().optional(),
  skills: z.string().optional(),
  avatar: z.string().optional().or(z.literal("")),
  resumeUrl: z.string().optional().or(z.literal("")),
  companyName: z.string().optional(),
  companyWebsite: z.string().optional().or(z.literal("")),
  companyLogo: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { toast } = useToast();
  const { isEmployer } = useAuth();
  const { data: profile, isLoading } = useGetMyProfile();
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", bio: "", location: "", skills: "", avatar: "", resumeUrl: "", companyName: "", companyWebsite: "", companyLogo: "" },
  });

  useEffect(() => {
    if (profile) {
      const url = profile.resumeUrl || "";
      setResumeUrl(url);
      if (profile.avatar) setAvatarPreview(profile.avatar);
      form.reset({
        name: profile.name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        skills: profile.skills?.join(", ") || "",
        avatar: profile.avatar || "",
        resumeUrl: url,
        companyName: profile.companyName || "",
        companyWebsite: profile.companyWebsite || "",
        companyLogo: profile.companyLogo || "",
      });
    }
  }, [profile, form]);

  const updateMutation = useUpdateMyProfile({
    mutation: {
      onSuccess: () => {
        toast({ title: "Profile saved! ✓", description: "Your changes have been saved." });
      },
      onError: () => {
        toast({ title: "Error", description: "Could not update profile.", variant: "destructive" });
      }
    }
  });

  const onSubmit = (values: FormValues) => {
    updateMutation.mutate({
      data: {
        ...values,
        resumeUrl: resumeUrl || undefined,
        skills: values.skills ? values.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        avatar: values.avatar || undefined,
        companyLogo: values.companyLogo || undefined,
        companyWebsite: values.companyWebsite || undefined,
      }
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max image size is 10MB.", variant: "destructive" });
      return;
    }
    setUploadingAvatar(true);
    try {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          // Compress & resize to max 512x512, JPEG quality 0.75 — keeps base64 small enough for RTDB
          const MAX = 512;
          let { width, height } = img;
          if (width > height) {
            if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
          } else {
            if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.75);
          setAvatarPreview(compressed);
          form.setValue("avatar", compressed);
          setUploadingAvatar(false);
          toast({ title: "Photo selected! 📸", description: "Save changes to update your profile photo." });
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingAvatar(false);
      toast({ title: "Failed to load image", variant: "destructive" });
    }
  };


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 10MB.", variant: "destructive" });
      return;
    }

    setUploadingResume(true);
    try {
      const res = await fetch("/api/upload/resume", {
        method: "POST",
        headers: { "Content-Type": "application/pdf" },
        body: file,
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      const { url } = await res.json();
      setResumeUrl(url);
      form.setValue("resumeUrl", url);
      toast({ title: "Resume uploaded! 📄", description: "Your PDF has been saved." });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message || "Could not upload resume.", variant: "destructive" });
    } finally {
      setUploadingResume(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-14 pb-32">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <div className="mb-8 pt-4">
          <h1 className="text-3xl font-black text-white tracking-tight">Your Profile</h1>
          <p className="text-white/50 text-sm mt-1">Update your details to stand out.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl border border-white/8 p-6 space-y-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-white text-base">Basic Info</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Full Name</label>
              <input
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                placeholder="Your name"
                {...form.register("name")}
              />
              {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  placeholder="City, Country"
                  {...form.register("location")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Bio</label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
                placeholder="Tell employers about yourself..."
                {...form.register("bio")}
              />
            </div>

            {/* Profile Photo Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Profile Photo</label>
              <div className="flex items-center gap-4">
                {/* Avatar circle */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border-2 border-white/10 flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-white/20" />
                    )}
                  </div>
                  {/* Camera badge */}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-60"
                  >
                    {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Camera className="w-3.5 h-3.5 text-white" />}
                  </button>
                </div>
                {/* Text & actions */}
                <div className="space-y-1">
                  <p className="text-white/80 text-sm font-medium">{avatarPreview ? "Photo selected" : "No photo yet"}</p>
                  <p className="text-white/35 text-xs">JPG, PNG or GIF · Max 10MB</p>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => { setAvatarPreview(""); form.setValue("avatar", ""); }}
                      className="text-xs text-destructive hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove photo
                    </button>
                  )}
                </div>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
          </motion.div>

          {/* Job Seeker: Skills + Resume */}
          {!isEmployer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="glass-card rounded-3xl border border-white/8 p-6 space-y-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-white text-base">Professional Details</h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Skills (comma separated)</label>
                <input
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  placeholder="React, Python, Figma..."
                  {...form.register("skills")}
                />
              </div>

              {/* Resume PDF Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Resume / CV</label>

                {resumeUrl ? (
                  /* Uploaded state */
                  <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-success font-semibold text-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resume uploaded
                      </p>
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/50 text-xs hover:text-primary transition-colors truncate block mt-0.5"
                      >
                        View PDF →
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all"
                        title="Replace"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setResumeUrl(""); form.setValue("resumeUrl", ""); }}
                        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:text-destructive hover:bg-destructive/10 transition-all"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Upload area */
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingResume}
                    className="w-full flex flex-col items-center gap-3 p-6 bg-white/3 border-2 border-dashed border-white/15 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all group disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {uploadingResume ? (
                      <>
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <span className="text-sm text-white/60 font-medium">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                          <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-semibold text-sm">Upload your Resume</p>
                          <p className="text-white/40 text-xs mt-0.5">PDF only · Max 10MB</p>
                        </div>
                      </>
                    )}
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </motion.div>
          )}

          {/* Employer section */}
          {isEmployer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="glass-card rounded-3xl border border-white/8 p-6 space-y-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-white text-base">Company Details</h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Company Name</label>
                <input
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  placeholder="Acme Inc."
                  {...form.register("companyName")}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Website</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    placeholder="https://..."
                    {...form.register("companyWebsite")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Company Logo URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/25 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    placeholder="https://..."
                    {...form.register("companyLogo")}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Save button */}
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-primary to-accent shadow-xl shadow-primary/30 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
          >
            {updateMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </span>
            ) : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
