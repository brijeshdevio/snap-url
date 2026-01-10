import type { ChangePasswordForm } from "@/types/user";
import { http } from "./http";

export const UserService = {
  profile: async () => (await http.get("/users/me")).data,
  update: async (formData: { name: string }) =>
    (await http.patch("/users/me", formData)).data,
  changeEmail: async (formData: { email: string }) =>
    (await http.patch("/users/change-email", formData)).data,
  changePassword: async (formData: ChangePasswordForm) =>
    (await http.patch("/users/change-password", formData)).data,
  deleteAccount: async () => (await http.delete("/users/delete-account")).data,
};
