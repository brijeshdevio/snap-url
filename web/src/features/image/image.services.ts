import { http } from "@/lib/http";

export const ImageServices = {
  getAll: () => http.get("/images").then((res) => res.data),
  delete: (imageId: string) =>
    http.delete(`/images/${imageId}`).then((res) => res.data),
  getById: (imageId: string) =>
    http.get(`/images/${imageId}`).then((res) => res.data),
  download: (signKey: string) =>
    http.get(`/images/download/${signKey}`).then((res) => res.data),
};
