import type { ReactNode } from "react";
import { Loader2Icon } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-zinc-200">
        <Loader2Icon className="size-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        replace
        to="/login"
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
