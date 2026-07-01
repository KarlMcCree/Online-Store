import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/use-admin";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isAdmin, loading } = useIsAdmin();

  useEffect(() => {
    if (!loading && !authLoading) {
      if (!isAuthenticated) toast.error("Please sign in to continue.");
      else if (!isAdmin) toast.error("Access denied.");
    }
  }, [loading, authLoading, isAuthenticated, isAdmin]);

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking access…
      </div>
    );
  }
  if (!isAuthenticated || !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}
