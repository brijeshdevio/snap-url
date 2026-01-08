import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageService } from "@/services/image.service";
import type { AxiosResponse } from "axios";
import { notifyError, notifySuccess } from "@/utils";

export function useGetAllImages() {
  return useQuery({
    queryKey: ["images"],
    queryFn: ImageService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ImageService.delete,
    onSuccess: (data: AxiosResponse["data"]) => {
      notifySuccess(data.message);
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
    onError: (error: unknown) => notifyError(error),
  });
}
