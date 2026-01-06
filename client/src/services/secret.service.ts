import { http } from "./http";
import type { SecretForm } from "@/types/secret";

export const SecretService = {
  create: async (data: SecretForm) => (await http.post("/secrets", data)).data,
  getAll: async () => (await http.get("/secrets")).data,
};
