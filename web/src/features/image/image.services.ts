import { http } from "@/lib/http";

export const ImageServices = {
  getAll: () => http.get("/images").then((res) => res.data),
};
