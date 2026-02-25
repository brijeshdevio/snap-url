import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { AuthLayout, BaseLayout } from "./Layouts";
import React, { Suspense } from "react";
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const Docs = React.lazy(() => import("@/pages/Docs"));
const Home = React.lazy(() => import("@/pages/Home"));
const Images = React.lazy(() => import("@/pages/Images"));
const Login = React.lazy(() => import("@/pages/Login"));
const Playground = React.lazy(() => import("@/pages/Playground"));
const Register = React.lazy(() => import("@/pages/Register"));

import { useAuth } from "@/hooks";
import { Loader } from "@/components/ui";

function ProtectRouter() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <Loader className="h-screen" />;
  if (user && isAuthenticated) return <Outlet />;
  return <Navigate to="/login" replace />;
}

function AuthRouter() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <Loader className="h-screen" />;
  if (user && isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export function Router() {
  return (
    <Suspense fallback={<Loader className="h-screen" />}>
      <BrowserRouter>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/playground" element={<Playground />} />
            <Route element={<ProtectRouter />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/images" element={<Images />} />
            </Route>
          </Route>

          <Route element={<AuthLayout />}>
            <Route element={<AuthRouter />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}
