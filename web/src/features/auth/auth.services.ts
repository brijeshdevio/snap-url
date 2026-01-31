import { http } from "@/lib/http";
import type { LoginDto, RegisterDto } from "./auth.schema";

export const AuthServices = {
  register: (data: RegisterDto) =>
    http.post("/auth/register", data).then((res) => res.data),
  login: (data: LoginDto) =>
    http.post("/auth/login", data).then((res) => res.data),
  logout: () => http.post("/auth/logout").then((res) => res.data),
};
