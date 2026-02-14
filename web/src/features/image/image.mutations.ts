import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageServices } from "./image.services";
import { notifyError } from "@/utils";

export const useDeleteImageMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["delete-image"],
    mutationFn: ImageServices.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-images"] });
    },
    onError: (error: unknown) => notifyError(error),
  });
  return mutation;
};
