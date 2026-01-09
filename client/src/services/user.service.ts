import { http } from "./http";

export const UserService = {
  profile: async () => (await http.get("/users/me")).data,
  changeEmail: async (formData: { email: string }) =>
    (await http.patch("/users/change-email", formData)).data,
};
