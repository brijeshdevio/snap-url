import { http } from "@/lib/http";
import type { CreateProjectDto } from "./project.schema";

export const ProjectServices = {
  create: (data: CreateProjectDto) =>
    http.post("/projects", data).then((res) => res.data),
  getAll: () => http.get("/projects").then((res) => res.data),
};
