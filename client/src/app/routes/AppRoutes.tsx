import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BaseLayout } from "../layouts/BaseLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { ProtectLayout } from "../layouts/ProtectLayout";
import {
  DashboardPage,
  HomePage,
  ImagePage,
  LoginPage,
  PlaygroundPage,
  ProfilePage,
  SignupPage,
} from "@/pages";
import ProtectRoute from "./ProtectRoute";
import AuthRoute from "./AuthRoute";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
        </Route>
        <Route element={<ProtectLayout />}>
          <Route element={<ProtectRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/images" element={<ImagePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route element={<AuthLayout />}>
          <Route element={<AuthRoute />}>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
