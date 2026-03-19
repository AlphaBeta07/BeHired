import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useGetCurrentUser, useLogoutUser, getGetCurrentUserQueryKey } from "@/lib/api/hooks";

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: user, isLoading, error } = useGetCurrentUser({
    query: {
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  });

  const logoutMutation = useLogoutUser({
    mutation: {
      onSuccess: () => {
        queryClient.setQueryData(getGetCurrentUserQueryKey(), null);
        queryClient.clear();
        setLocation("/");
      }
    }
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isJobseeker: user?.role === "jobseeker",
    isEmployer: user?.role === "employer",
    logout: () => logoutMutation.mutateAsync(),
    isLoggingOut: logoutMutation.isPending
  };
}
