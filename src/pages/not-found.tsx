import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-12 h-12 text-destructive" />
      </div>
      <h1 className="text-4xl font-display font-black text-foreground mb-4 text-center">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground text-center max-w-md mb-8">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="gradient" size="lg" className="rounded-full px-8">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
