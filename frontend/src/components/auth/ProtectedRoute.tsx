import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks";
import { CheckCircle2, Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400 absolute -bottom-1 -right-1 bg-white dark:bg-neutral-900 rounded-full p-0.5" />
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
