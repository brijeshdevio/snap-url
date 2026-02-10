import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageServices } from "./image.services";

export const useDeleteImageMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["delete-image"],
    mutationFn: ImageServices.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-images"] });
    },
  });
  return mutation;
};
