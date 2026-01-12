import type { LoginForm, SignupForm } from "@/types/auth";
import { http } from "./http";

export const AuthService = {
  signup: async (formData: SignupForm) =>
    (await http.post("/auth/signup", formData)).data,

  login: async (formData: LoginForm) =>
    (await http.post("/auth/login", formData)).data,

  logout: async () => (await http.post("/auth/logout")).data,

  verifyEmail: async (token: string) =>
    (await http.get(`/auth/verify-email/${token}`)).data,

  resendEmail: async (formData: { email: string }) =>
    (await http.post("/auth/resend-email", formData)).data,
};
