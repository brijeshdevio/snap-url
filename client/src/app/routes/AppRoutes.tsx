import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BaseLayout } from "../layouts/BaseLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { ProtectLayout } from "../layouts/ProtectLayout";
import { Dashboard, Home, Login, Signup } from "@/pages";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/dashboard" element={<ProtectLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
