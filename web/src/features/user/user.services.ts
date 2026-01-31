import { http } from "@/lib/http";

export const UserServices = {
  me: () => http.get("/users/me").then((res) => res.data),
};
