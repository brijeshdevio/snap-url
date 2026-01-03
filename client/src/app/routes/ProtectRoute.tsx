import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { Loader } from "@/components";

export default function ProtectRoute() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <Loader className="h-screen" />;
  if (!user && !isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
