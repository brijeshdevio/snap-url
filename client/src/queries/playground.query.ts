import { playgroundService } from "@/services/playground.service";
import { notifyError, notifySuccess } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

export function useUploadImage() {
  return useMutation({
    mutationKey: ["upload-image"],
    mutationFn: (data: any) => playgroundService.upload(data),
    onSuccess: (data: AxiosResponse["data"]) => {
      notifySuccess(data.message);
    },
    onError: (error: unknown) => notifyError(error),
  });
}
