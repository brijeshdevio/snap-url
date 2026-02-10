import { useQuery } from "@tanstack/react-query";
import { ImageServices } from "./image.services";
import { transform } from "@/utils";

export const useGetImagesQuery = () =>
  useQuery({
    queryKey: ["get-images"],
    queryFn: ImageServices.getAll,
    select: transform,
  });
