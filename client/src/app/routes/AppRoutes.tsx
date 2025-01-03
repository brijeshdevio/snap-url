import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BaseLayout } from "../layouts/BaseLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { ProtectLayout } from "../layouts/ProtectLayout";
import {
  ApiKeyPage,
  Home,
  ImagePage,
  Login,
  PlaygroundPage,
  ProfilePage,
  Signup,
  SystemHealthPage,
} from "@/pages";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}></Route>
        <Route element={<ProtectLayout />}>
          <Route index element={<Home />} />
          <Route path="/keys" element={<ApiKeyPage />} />
          <Route path="/images" element={<ImagePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/system-health" element={<SystemHealthPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
