import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { Loader } from "@/components";

export default function AuthRoute() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <Loader className="h-screen" />;
  if (user && isAuthenticated) return <Navigate to="/keys" replace />;
  return <Outlet />;
}
