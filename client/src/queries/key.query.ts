import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { SecretService } from "@/services/secret.service";
import { notifyError, notifySuccess } from "@/utils";
import type { SecretForm } from "@/types/secret";

export function useCreateSecret() {
  const { refetch } = useGetAllSecret();

  return useMutation({
    mutationKey: ["create-secret"],
    mutationFn: (data: SecretForm) => SecretService.create(data),
    onSuccess: (data: AxiosResponse["data"]) => {
      notifySuccess(data.message);
      refetch();
    },
    onError: (error: unknown) => notifyError(error),
  });
}

export function useDeleteSecret() {
  const { refetch } = useGetAllSecret();

  return useMutation({
    mutationKey: ["delete-secret"],
    mutationFn: (id: string) => SecretService.delete(id),
    onSuccess: (data: AxiosResponse["data"]) => {
      notifySuccess(data.message);
      refetch();
    },
    onError: (error: unknown) => notifyError(error),
  });
}

export function useGetAllSecret() {
  return useQuery({
    queryKey: ["get-all-secret"],
    queryFn: () => SecretService.getAll(),
    enabled: false,
  });
}
