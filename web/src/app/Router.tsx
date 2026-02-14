import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { AuthLayout, BaseLayout } from "./Layouts";
import {
  Dashboard,
  Docs,
  Home,
  Images,
  Login,
  Playground,
  Register,
} from "@/pages";
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
  );
}
