import { http } from "./http";

export const AuthService = {
  signup: async (formData:any) =>
    (await http.post("/auth/signup", formData)).data,

  login: async (formData: any) =>
    (await http.post("/auth/login", formData)).data,

  logout: async () => (await http.post("/auth/logout")).data,
};
