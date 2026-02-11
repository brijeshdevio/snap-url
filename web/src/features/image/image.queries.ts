import { useQuery } from "@tanstack/react-query";
import { ImageServices } from "./image.services";
import { transform } from "@/utils";

export const useGetImagesQuery = () =>
  useQuery({
    queryKey: ["get-images"],
    queryFn: ImageServices.getAll,
    select: transform,
  });

export const useGetImageQuery = (imageId: string) =>
  useQuery({
    queryKey: ["get-image", imageId],
    queryFn: () => ImageServices.getById(imageId),
    select: transform,
    enabled: false,
  });
