import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { useCreateJob, useGetMyProfile } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Link } from "wouter";

const jobSchema = z.object({
  title: z.string().min(2, "Title is required"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  type: z.enum(["job", "internship"]),
  salary: z.string().optional(),
  description: z.string().min(10, "Description needs more detail"),
  requirements: z.string().optional(), // Will split by comma
  tags: z.string().optional(), // Will split by comma
  remote: z.boolean().default(false),
});

export default function PostJob() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: profile } = useGetMyProfile();

  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: profile?.companyName || "",
      location: "",
      type: "job",
      salary: "",
      description: "",
      requirements: "",
      tags: "",
      remote: false,
    },
  });

  const createJobMutation = useCreateJob({
    mutation: {
      onSuccess: () => {
        toast({ title: "Success!", description: "Your listing has been posted." });
        setLocation("/my-listings");
      },
      onError: (err: any) => {
        const errorMsg = err?.response?.data?.error || err?.message || "Failed to post job.";
        toast({ title: "Error", description: errorMsg, variant: "destructive" });
      }
    }
  });

  const onSubmit = (values: z.infer<typeof jobSchema>) => {
    createJobMutation.mutate({
      data: {
        ...values,
        requirements: values.requirements?.split(",").map(s => s.trim()).filter(Boolean) || [],
        tags: values.tags?.split(",").map(s => s.trim()).filter(Boolean) || [],
        companyLogo: profile?.companyLogo,
      }
    });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/my-listings" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
        </Link>

        <div className="bg-card border border-border/50 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-accent p-8 text-white">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4 border border-white/20">
              <Briefcase className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-display font-bold">Post a New Listing</h1>
            <p className="text-white/80 font-medium mt-1">Create a job or internship and start swiping on candidates.</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" placeholder="e.g. Senior Frontend Engineer" {...form.register("title")} />
                {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" {...form.register("company")} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. San Francisco, CA" {...form.register("location")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select 
                  id="type"
                  {...form.register("type")}
                  className="flex h-14 w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:border-primary"
                >
                  <option value="job">Full-time Job</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the role, responsibilities, and what the day-to-day looks like..."
                className="min-h-[160px]"
                {...form.register("description")} 
              />
              {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range (Optional)</Label>
                <Input id="salary" placeholder="e.g. $120k - $150k" {...form.register("salary")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Comma separated)</Label>
                <Input id="tags" placeholder="React, TypeScript, Remote" {...form.register("tags")} />
              </div>
            </div>
            
            <div className="flex items-center gap-3 py-2">
              <input 
                type="checkbox" 
                id="remote" 
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-primary"
                {...form.register("remote")}
              />
              <Label htmlFor="remote" className="text-base cursor-pointer">This is a remote position</Label>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button type="submit" variant="gradient" size="lg" className="px-10" isLoading={createJobMutation.isPending}>
                Publish Listing
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
