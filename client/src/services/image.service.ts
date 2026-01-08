import { http } from "./http";

export const ImageService = {
  getAll: async () => (await http.get("/images")).data,
  delete: async (id: string) => (await http.delete(`/images/${id}`)).data,
};
