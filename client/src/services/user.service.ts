import { http } from "./http";

export const UserService = {
  profile: async () => (await http.get("/users/profile")).data,
};
