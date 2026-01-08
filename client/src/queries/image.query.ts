import { useQuery } from "@tanstack/react-query";
import { ImageService } from "@/services/image.service";

export function useGetAllImages() {
  return useQuery({
    queryKey: ["images"],
    queryFn: ImageService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
