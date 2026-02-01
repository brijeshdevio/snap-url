import { useQuery } from "@tanstack/react-query";
import { ProjectServices } from "./project.services";
import { transform } from "@/utils";

export const useGetProjectsQuery = () =>
  useQuery({
    queryKey: ["get-projects"],
    queryFn: ProjectServices.getAll,
    select: transform,
  });
