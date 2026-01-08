import { http } from "./http";

export const ImageService = {
  getAll: async () => (await http.get("/images")).data,
};
