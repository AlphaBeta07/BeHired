import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { MatchModal } from "@/components/MatchModal";
import { useGetMatches } from "@/lib/api/hooks";
import { useState, useEffect } from "react";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import SwipeView from "@/pages/SwipeView";
import Matches from "@/pages/Matches";
import Profile from "@/pages/Profile";
import EmployerDashboard from "@/pages/EmployerDashboard";
import PostJob from "@/pages/PostJob";
import ApplicantsView from "@/pages/ApplicantsView";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, allowedRole }: { component: any, allowedRole?: "jobseeker" | "employer" }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (allowedRole && user?.role !== allowedRole) {
    setLocation(user?.role === "jobseeker" ? "/swipe" : "/my-listings");
    return null;
  }

  return <Component />;
}

function MatchListener() {
  const { isAuthenticated, user } = useAuth();
  const isJobseeker = user?.role === "jobseeker";
  const [previousMatchesCount, setPreviousMatchesCount] = useState<number | null>(null);
  const [newMatch, setNewMatch] = useState<any>(null);

  const { data: matches } = useGetMatches({
    query: { refetchInterval: 5000, enabled: isAuthenticated && isJobseeker }
  });

  useEffect(() => {
    if (!isAuthenticated || !isJobseeker || !matches) return;
    
    // Only alert if the count strictly increases, meaning a brand new match just fell from the sky!
    if (previousMatchesCount !== null && matches.length > previousMatchesCount) {
      if (previousMatchesCount > 0) {
        setNewMatch(matches[0]);
      }
      setPreviousMatchesCount(matches.length);
    } else if (previousMatchesCount === null || matches.length < previousMatchesCount) {
      // First mount initialization or match was deleted
      setPreviousMatchesCount(matches.length);
    }
  }, [matches, previousMatchesCount, isAuthenticated, isJobseeker]);

  if (!isAuthenticated || !isJobseeker) return null;

  return (
    <MatchModal
      isOpen={!!newMatch}
      onClose={() => setNewMatch(null)}
      title="It's a Match!"
      subtitle={newMatch ? `You got matched with ${newMatch.company}!` : "You got matched!"}
      image1={newMatch?.companyLogo}
      image2={newMatch?.applicantAvatar}
      name1={newMatch?.company || "Company"}
      name2={newMatch?.applicantName || "You"}
    />
  );
}

function Router() {
  return (
    <>
      <Navbar />
      <MatchListener />
      <Switch>
        {/* Public / Generic */}
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        
        {/* Protected - Both Roles */}
        <Route path="/matches">
          {() => <ProtectedRoute component={Matches} />}
        </Route>
        <Route path="/profile">
          {() => <ProtectedRoute component={Profile} />}
        </Route>

        {/* Protected - Job Seeker Only */}
        <Route path="/swipe">
          {() => <ProtectedRoute component={SwipeView} allowedRole="jobseeker" />}
        </Route>

        {/* Protected - Employer Only */}
        <Route path="/my-listings">
          {() => <ProtectedRoute component={EmployerDashboard} allowedRole="employer" />}
        </Route>
        <Route path="/post-job">
          {() => <ProtectedRoute component={PostJob} allowedRole="employer" />}
        </Route>
        <Route path="/applicants/:jobId">
          {() => <ProtectedRoute component={ApplicantsView} allowedRole="employer" />}
        </Route>

        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
