import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectServices } from "./project.services";
import { notifyError } from "@/utils";

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["create-project"],
    mutationFn: ProjectServices.create,
    onError: (error: unknown) => notifyError(error),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["get-projects"],
      }),
  });

  return mutation;
};
