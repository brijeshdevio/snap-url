import { http } from "./http";
import type { KeyForm } from "@/types/key";

export const KeyService = {
  create: async (data: KeyForm) => (await http.post("/keys", data)).data,
  getAll: async () => (await http.get("/keys")).data
};
