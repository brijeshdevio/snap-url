import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { KeyService } from "@/services/key.service";
import { notifyError, notifySuccess } from "@/utils";
import type { KeyForm } from "@/types/key";

export function useCreateKey() {
  const { refetch } = useGetAllKey();

  return useMutation({
    mutationKey: ["create-key"],
    mutationFn: (data: KeyForm) => KeyService.create(data),
    onSuccess: (data: AxiosResponse["data"]) => {
      notifySuccess(data.message);
      refetch();
    },
    onError: (error: unknown) => notifyError(error),
  });
}

export function useGetAllKey() {
  return useQuery({
    queryKey: ["get-all-key"],
    queryFn: () => KeyService.getAll(),
    enabled: false,
  });
}
